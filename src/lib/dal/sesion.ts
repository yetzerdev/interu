import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type SesionActual = {
  userId: string
  alias: string | null
  esAdmin: boolean
  /** false = la cuenta existe pero el perfil publico aun no (falta el paso 2). */
  tienePerfil: boolean
} | null

/**
 * Sesion actual cacheada por request (React cache), para no re-consultar
 * en cada uso dentro del mismo render.
 */
export const getCurrentUser = cache(async (): Promise<SesionActual> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return null

  const { data: perfil } = await supabase
    .from('profiles')
    .select('alias, role')
    .eq('id', user.id)
    .maybeSingle()

  return {
    userId: user.id,
    alias: perfil?.alias ?? null,
    esAdmin: perfil?.role === 'admin',
    tienePerfil: !!perfil,
  }
})

/**
 * Nombre real, para el saludo del home.
 *
 * Vive en `private.real_identities`, que no es alcanzable por PostgREST ni
 * siquiera con service_role: la unica puerta es el RPC private_get_legal_name
 * (0003). Se lee para la sesion actual y no sale de este servidor.
 */
export const getNombreReal = cache(
  async (userId: string): Promise<string | null> => {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('private_get_legal_name', {
      p_user_id: userId,
    })
    if (error) return null
    return typeof data === 'string' && data.length > 0 ? data : null
  },
)
