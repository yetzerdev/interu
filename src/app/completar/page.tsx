import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import CompletarForm from '@/components/completar-form'

export const metadata = { title: 'Completa tu perfil — InterU Honduras' }

type Univ = { id: string; name: string; code: string }
type Campus = { id: string; university_id: string; name: string }

export default async function CompletarPage() {
  const sesion = await getCurrentUser()
  if (!sesion) redirect('/')
  if (sesion.tienePerfil) redirect(sesion.esAdmin ? '/admin' : '/esperando')

  const supabase = await createClient()
  const { data: sesionAuth } = await supabase.auth.getUser()

  // Cinturon: sin correo confirmado no se completa el perfil.
  if (!sesionAuth.user?.email_confirmed_at) redirect('/verifica-correo')

  const [{ data: universities }, { data: campuses }] = await Promise.all([
    supabase
      .from('universities')
      .select('id, name, code')
      .eq('active', true)
      .order('name'),
    supabase
      .from('campuses')
      .select('id, university_id, name')
      .eq('active', true)
      .order('name'),
  ])

  return (
    <AuthShell
      titulo="Completa tu perfil"
      subtitulo="Tu cuenta ya está creada. Esto toma 20 segundos."
      panel={{
        badge: 'Último paso',
        titulo: 'Ya casi. Dinos de dónde vienes.',
        texto: 'Tu universidad y campus solo sirven para darte un seudónimo y conectarte con gente de tu misma facultad.',
      }}
    >
      <CompletarForm
        universities={(universities ?? []) as Univ[]}
        campuses={(campuses ?? []) as Campus[]}
      />
    </AuthShell>
  )
}
