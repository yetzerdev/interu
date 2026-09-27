import 'server-only'

import { createClient } from '@supabase/supabase-js'

/**
 * Cliente con service_role. Bypasea RLS y es el UNICO acceso permitido al
 * schema `private` (identidad real). Solo debe usarse dentro de la DAL, jamas
 * en componentes ni en codigo de cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
