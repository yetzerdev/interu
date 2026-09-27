'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import {
  registrar,
  reenviarConfirmacion,
  completarPerfil,
  subirCarne,
  aprobarSolicitud,
  rechazarSolicitud,
} from '@/lib/dal/verificaciones'

export type EstadoForm = { error?: string }

// Re-verifica que el caller sea admin. La página /admin solo controla qué UI
// se renderiza; la action DEBE validar por su cuenta (evita escalada).
async function requireAdminUserId(): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) redirect('/ingresar')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (profile?.role !== 'admin') redirect('/')
  return user.id
}

// ---------- REGISTRO (paso 1: correo + contrasena) ----------
export async function registrarAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const cabeceras = await headers()
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    cabeceras.get('origin') ??
    `${cabeceras.get('x-forwarded-proto') ?? 'http'}://${cabeceras.get('host')}`

  const resultado = await registrar({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    origin,
  })

  if (!resultado.ok) return { error: resultado.error }

  // No hay sesion todavia: la cuenta nace sin confirmar. Va a /verifica-correo
  // a esperar el enlace que manda Supabase.
  redirect('/verifica-correo')
}

// ---------- REENVIAR EL CORREO DE CONFIRMACION ----------
export async function reenviarConfirmacionAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm & { enviado?: boolean }> {
  const cabeceras = await headers()
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    cabeceras.get('origin') ??
    `${cabeceras.get('x-forwarded-proto') ?? 'http'}://${cabeceras.get('host')}`

  const resultado = await reenviarConfirmacion(
    String(formData.get('email') ?? ''),
    origin,
  )
  if (!resultado.ok) return { error: resultado.error }
  return { enviado: true }
}

// ---------- PERFIL (paso 2: nombre + universidad + campus) ----------
export async function completarPerfilAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/')

  // La pagina ya lo bloquea, pero la action DEBE validar por su cuenta:
  // sin esto, un POST directo completaria el perfil sin confirmar el correo.
  if (!data.user.email_confirmed_at) redirect('/verifica-correo')

  const resultado = await completarPerfil({
    userId: data.user.id,
    legalName: String(formData.get('legalName') ?? ''),
    universityId: String(formData.get('universityId') ?? ''),
    campusId: String(formData.get('campusId') ?? ''),
  })

  if (!resultado.ok) return { error: resultado.error }

  redirect('/')
}

// ---------- LOGIN ----------
export async function iniciarSesionAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (/not confirmed|email not confirmed/i.test(error.message))
      return {
        error: 'Tu correo todavía no está confirmado. Revisá tu bandeja y el enlace que te enviamos.',
      }
    return { error: 'Credenciales inválidas.' }
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user!.id)
    .maybeSingle()

  if (!perfil) redirect('/completar')
  redirect(perfil.role === 'admin' ? '/admin' : '/')
}

export async function cerrarSesionAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ---------- RECUPERAR / CAMBIAR CONTRASEÑA ----------
// El correo lo envía Supabase Auth a través del SMTP configurado (Resend).
// El enlace vuelve a /auth/confirm, que canjea el code por sesión.
export async function recuperarClaveAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm & { enviado?: boolean }> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email || !email.includes('@')) return { error: 'Correo inválido.' }

  const cabeceras = await headers()
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    cabeceras.get('origin') ??
    `${cabeceras.get('x-forwarded-proto') ?? 'http'}://${cabeceras.get('host')}`

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // `siguiente` le dice a /auth/confirm a dónde ir tras canjear el code.
    redirectTo: `${origin}/auth/confirm?siguiente=/actualizar-clave`,
  })

  // No revelamos si el correo existe: misma respuesta en ambos casos.
  if (error) return { error: 'No pudimos enviar el correo. Intenta de nuevo.' }
  return { enviado: true }
}

export async function actualizarClaveAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const clave = String(formData.get('password') ?? '')
  const repetir = String(formData.get('password2') ?? '')

  if (clave.length < 8)
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  if (clave !== repetir) return { error: 'Las contraseñas no coinciden.' }

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user)
    return { error: 'El enlace venció. Pide uno nuevo para recuperar tu clave.' }

  const { error } = await supabase.auth.updateUser({ password: clave })
  if (error) return { error: 'No pudimos actualizar tu contraseña.' }

  redirect('/')
}

// ---------- SSO (OAuth) ----------
// Google / Microsoft 365. Requiere habilitar el proveedor en Supabase Auth y
// registrar <origin>/auth/callback entre las URLs de redireccion permitidas.
export async function oauthAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const provider = String(formData.get('provider') ?? '')
  if (provider !== 'google' && provider !== 'azure')
    return { error: 'Proveedor no soportado.' }

  const cabeceras = await headers()
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    cabeceras.get('origin') ??
    `${cabeceras.get('x-forwarded-proto') ?? 'http'}://${cabeceras.get('host')}`

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  })

  if (error || !data.url)
    return { error: 'No pudimos conectar con ese proveedor.' }

  redirect(data.url)
}

// ---------- CARNÉ (fallback manual) ----------
export async function subirCarneAction(
  _prev: EstadoForm,
  formData: FormData,
): Promise<EstadoForm> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/ingresar')

  const file = formData.get('carne')
  if (!(file instanceof File) || file.size === 0)
    return { error: 'Selecciona la foto de tu carné.' }

  const resultado = await subirCarne(data.user.id, file)
  if (!resultado.ok) return { error: resultado.error ?? 'Error al subir.' }

  revalidatePath('/esperando')
  return {}
}

// ---------- ADMIN ----------
// Retornan Promise<void> para poder bindearse directamente a <form action>
// en el server component de /admin. En error, lanzan (error boundary).
export async function aprobarAction(requestId: string): Promise<void> {
  const adminUserId = await requireAdminUserId()
  const resultado = await aprobarSolicitud(requestId, adminUserId)
  if (!resultado.ok) throw new Error(resultado.error)
  revalidatePath('/admin')
}

export async function rechazarAction(requestId: string): Promise<void> {
  const adminUserId = await requireAdminUserId()
  const resultado = await rechazarSolicitud(requestId, adminUserId)
  if (!resultado.ok) throw new Error(resultado.error)
  revalidatePath('/admin')
}
