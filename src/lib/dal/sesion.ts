import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

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
