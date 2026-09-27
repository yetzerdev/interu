import 'server-only'

import { randomInt } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'

// =====================================================================
// DAL de verificacion (Fase 1) — SOLO SERVIDOR.
//
// Concentra TODA mutacion en service_role, de modo que el cliente no
// pueda auto-aprobar su verificacion ni ascenderse a admin. Cada funcion
// de escritura re-verifica la sesion en la capa de actions.
// =====================================================================

const EVIDENCE_BUCKET = 'evidence'

type VerificationRequest = {
  id: string
  user_id: string
  university_id: string
  campus_id: string
  method: 'email_institucional' | 'carne'
  status: 'pendiente' | 'aprobado' | 'rechazado'
  evidence_path: string | null
  evidence_hmac: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export type EstadoUsuario = {
  status: 'aprobado' | 'pendiente' | 'rechazado' | null
  alias: string | null
  method: 'email_institucional' | 'carne' | null
  requestId: string | null
  hasEvidence: boolean
}

export type ResultadoRegistro =
  | { ok: true; estado: 'aprobado'; alias: string }
  | { ok: true; estado: 'pendiente' }
  | { ok: false; error: string }

// ---------- Alias NO adivinable ----------
// Se deriva de palabras aleatorias + numero, NUNCA del nombre/correo real,
// para no deanonymizar. El campus se agrega como sufijo (prueba social).
const ADJETIVOS = [
  'zarpado', 'centella', 'cobre', 'halcon', 'jade', 'lince', 'marea', 'nébula',
  'ocaso', 'puma', 'quirco', 'roble', 'sable', 'tucán', 'urbe', 'vórtice',
  'coral', 'duna', 'espuma', 'faro', 'grafito', 'hiedra', 'Índigo', 'junco',
]
const SUSTANTIVOS = [
  'caoba', 'duna', 'eco', 'faro', 'gaviota', 'higo', 'Índigo', 'junco',
  'karst', 'lago', 'mango', 'nido', 'ocaso', 'puma', 'roble', 'sierra',
  'tola', 'urbe', 'vena', 'yunque',
]

function palabra<T>(lista: T[]): T {
  return lista[randomInt(lista.length)]
}

async function generarAlias(campusSlug: string): Promise<string> {
  const admin = createAdminClient()
  for (let intento = 0; intento < 12; intento++) {
    const alias = `${palabra(ADJETIVOS)}${randomInt(100, 999)}_${palabra(SUSTANTIVOS)}${randomInt(10, 99)}_${campusSlug}`.toLowerCase()
    const { data } = await admin.from('profiles').select('id').eq('alias', alias).maybeSingle()
    if (!data) return alias
  }
  return `alias${randomInt(100000, 999999)}_${campusSlug}`.toLowerCase()
}

// ---------- HMAC de evidencia (prueba sin PII, detecta reuso de carné) ----------
async function hmacEvidencia(bytes: ArrayBuffer): Promise<string> {
  const secret = process.env.ALIAS_HMAC_SECRET
  if (!secret) throw new Error('Falta ALIAS_HMAC_SECRET')
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, bytes)
  return Buffer.from(sig).toString('hex')
}

// =====================================================================
// REGISTRO en dos pasos
//   1. registrar()      -> solo correo + contrasena. Crea la cuenta y ya.
//   2. completarPerfil() -> nombre + universidad + campus. Genera el alias.
//
// El paso 1 no toca `profiles` porque alias/university_id/campus_id son
// NOT NULL: el perfilPublico nace en el paso 2, con el campus en mano.
// =====================================================================
export async function registrar(input: {
  email: string
  password: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient()
  const email = input.email.trim().toLowerCase()

  if (!email || !email.includes('@')) return { ok: false, error: 'Correo inválido.' }
  if (!input.password || input.password.length < 8)
    return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' }

  const { error: userErr } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
  })
  if (userErr) {
    if (/already|registered|exists/i.test(userErr.message))
      return { ok: false, error: 'Ese correo ya está registrado.' }
    return { ok: false, error: userErr.message }
  }

  return { ok: true }
}

export async function completarPerfil(input: {
  userId: string
  legalName: string
  universityId: string
  campusId: string
}): Promise<ResultadoRegistro> {
  const admin = createAdminClient()
  const legalName = input.legalName?.trim() ?? ''

  if (!legalName) return { ok: false, error: 'Nombre requerido.' }

  const { data: campus } = await admin
    .from('campuses')
    .select('id, university_id, alias_slug')
    .eq('id', input.campusId)
    .maybeSingle()
  if (!campus) return { ok: false, error: 'Campus inválido.' }
  if (campus.university_id !== input.universityId)
    return { ok: false, error: 'El campus no pertenece a esa universidad.' }

  const { data: uni } = await admin
    .from('universities')
    .select('id')
    .eq('id', input.universityId)
    .maybeSingle()
  if (!uni) return { ok: false, error: 'Universidad inválida.' }

  // PII -> schema privado via RPC (service_role only)
  const { error: piiErr } = await admin.rpc('private_insert_identity', {
    p_user_id: input.userId,
    p_legal_name: legalName,
    p_national_id: null,
    p_email: null,
  })
  if (piiErr) return { ok: false, error: piiErr.message }

  // Acceso abierto: el alias se genera siempre y no se toca la cola de
  // revision. La identidad real nunca sale de `private`.
  const alias = await generarAlias(campus.alias_slug)
  const { error: profErr } = await admin.from('profiles').insert({
    id: input.userId,
    alias,
    university_id: input.universityId,
    campus_id: input.campusId,
    verification_status: 'aprobado',
  })
  if (profErr) return { ok: false, error: profErr.message }

  return { ok: true, estado: 'aprobado', alias }
}

// =====================================================================
// SUBIR CARNÉ (fallback manual) — adjunta evidencia a la solicitud pendiente
// =====================================================================
export async function subirCarne(userId: string, file: File): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient()

  if (!file || file.size === 0) return { ok: false, error: 'Selecciona una foto.' }
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: 'La foto supera 5 MB.' }

  const { data: req } = await admin
    .from('verification_requests')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pendiente')
    .maybeSingle()
  if (!req) return { ok: false, error: 'No hay una solicitud pendiente.' }

  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().slice(0, 5)
  const path = `${userId}/${Date.now()}-${randomInt(1000, 9999)}.${ext}`

  const { error: upErr } = await admin.storage
    .from(EVIDENCE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (upErr) return { ok: false, error: upErr.message }

  // HMAC del contenido: permite detectar el MISMO carné reutilizado por otra
  // cuenta (anti-fraude) sin conservar la imagen.
  const hmac = await hmacEvidencia(await file.arrayBuffer())

  await admin
    .from('verification_requests')
    .update({ evidence_path: path, evidence_hmac: hmac })
    .eq('id', req.id)

  // Vincula la foto al schema privado (se purga al aprobar).
  await admin.rpc('private_set_photo', { p_user_id: userId, p_photo_path: path })

  return { ok: true }
}

// =====================================================================
// ADMIN — aprobar / rechazar
// =====================================================================

async function cargarCampusSlug(campusId: string): Promise<string> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('campuses')
    .select('alias_slug')
    .eq('id', campusId)
    .maybeSingle()
  return data?.alias_slug ?? 'hn'
}

export async function aprobarSolicitud(requestId: string, adminUserId: string) {
  const admin = createAdminClient()

  const { data: req } = await admin
    .from('verification_requests')
    .select('*')
    .eq('id', requestId)
    .maybeSingle()
  if (!req) return { ok: false as const, error: 'Solicitud no encontrada.' }
  if (req.status !== 'pendiente') return { ok: false as const, error: 'La solicitud ya fue revisada.' }

  // PURGA de la imagen (Regla Zero-Knowledge). El HMAC se conserva como
  // prueba sin PII para una revocacion posterior.
  if (req.evidence_path) {
    await admin.storage.from(EVIDENCE_BUCKET).remove([req.evidence_path])
  }
  await admin.rpc('private_purge_photo', { p_user_id: req.user_id })

  // Perfil público con alias (idempotente).
  const { data: existing } = await admin
    .from('profiles')
    .select('id, alias')
    .eq('id', req.user_id)
    .maybeSingle()

  let alias = existing?.alias ?? null
  if (!alias) {
    alias = await generarAlias(await cargarCampusSlug(req.campus_id))
    const { error: profErr } = await admin.from('profiles').insert({
      id: req.user_id,
      alias,
      university_id: req.university_id,
      campus_id: req.campus_id,
      verification_status: 'aprobado',
    })
    if (profErr) return { ok: false as const, error: profErr.message }
  } else {
    await admin
      .from('profiles')
      .update({ verification_status: 'aprobado' })
      .eq('id', req.user_id)
  }

  // Cierra la solicitud: evidence_path = NULL, se CONSERVA evidence_hmac.
  const { error: upErr } = await admin
    .from('verification_requests')
    .update({
      status: 'aprobado',
      evidence_path: null,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)
  if (upErr) return { ok: false as const, error: upErr.message }

  return { ok: true as const, alias }
}

export async function rechazarSolicitud(requestId: string, adminUserId: string) {
  const admin = createAdminClient()
  const { data: req } = await admin
    .from('verification_requests')
    .select('id, user_id, evidence_path, status')
    .eq('id', requestId)
    .maybeSingle()
  if (!req) return { ok: false as const, error: 'Solicitud no encontrada.' }
  if (req.status !== 'pendiente') return { ok: false as const, error: 'La solicitud ya fue revisada.' }

  // Purga la imagen también al rechazar (minimización de datos).
  if (req.evidence_path) {
    await admin.storage.from(EVIDENCE_BUCKET).remove([req.evidence_path])
  }
  await admin.rpc('private_purge_photo', { p_user_id: req.user_id })

  const { error } = await admin
    .from('verification_requests')
    .update({
      status: 'rechazado',
      evidence_path: null,
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)
  if (error) return { ok: false as const, error: error.message }

  await admin.from('profiles').update({ verification_status: 'rechazado' }).eq('id', req.user_id)
  return { ok: true as const }
}

// =====================================================================
// LECTURAS
// =====================================================================
export async function listarColaPendiente() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('verification_requests')
    .select('id, user_id, method, status, evidence_path, created_at')
    .eq('status', 'pendiente')
    .order('created_at', { ascending: true })
  return (data ?? []) as Pick<
    VerificationRequest,
    'id' | 'user_id' | 'method' | 'status' | 'evidence_path' | 'created_at'
  >[]
}

export async function obtenerEstadoUsuario(userId: string): Promise<EstadoUsuario> {
  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('alias, verification_status')
    .eq('id', userId)
    .maybeSingle()

  const { data: req } = await admin
    .from('verification_requests')
    .select('id, method, status, evidence_path')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    status: (profile?.verification_status ?? req?.status ?? null) as EstadoUsuario['status'],
    alias: profile?.alias ?? null,
    method: (req?.method ?? null) as EstadoUsuario['method'],
    requestId: req?.id ?? null,
    hasEvidence: !!req?.evidence_path,
  }
}
