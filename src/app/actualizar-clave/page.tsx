import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import ActualizarClaveForm from './ActualizarClaveForm'

export const metadata = { title: 'Nueva contraseña — InterU Honduras' }

export default async function ActualizarClavePage() {
  // La sesión de recuperación la abrió /auth/confirm al canjear el code.
  const sesion = await getCurrentUser()
  if (!sesion) redirect('/recuperar')

  return (
    <AuthShell
      titulo="Elige una nueva contraseña"
      subtitulo="Cuando la guardes quedarás con sesión iniciada."
      panel={{
        badge: 'Casi listo',
        titulo: 'Una clave nueva y Entramos.',
        texto: 'No reutilices la clave de otro servicio. Combina palabras que no se te olviden.',
      }}
    >
      <ActualizarClaveForm />
    </AuthShell>
  )
}
