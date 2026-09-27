import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Destino del enlace que manda Supabase Auth (recuperar contraseña, confirmar
 * correo, magic link). Supabase llega aquí con ?code=... en flujo PKCE; lo
 * canjeamos por sesión y reenviamos a la pantalla que corresponde.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `siguiente` es el nombre que genera registrar() y recuperarClaveAction().
  // `next` se acepta como alias por si algun enlace viejo quedara en vuelo.
  const siguiente = searchParams.get('siguiente') ?? searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/ingresar?error=recovery`)
    }
  }

  const destino = siguiente?.startsWith('/') ? siguiente : '/'
  return NextResponse.redirect(`${origin}${destino}`)
}
