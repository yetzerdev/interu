import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const supabase = await createClient()
  if (code) await supabase.auth.exchangeCodeForSession(code)

  const { data } = await supabase.auth.getUser()
  if (!data.user) return NextResponse.redirect(`${origin}/ingresar`)

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (!perfil) return NextResponse.redirect(`${origin}/completar`)

  return NextResponse.redirect(
    `${origin}${perfil.role === 'admin' ? '/admin' : '/esperando'}`,
  )
}
