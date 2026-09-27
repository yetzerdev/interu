import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import RecuperarForm from './RecuperarForm'

export const metadata = { title: 'Recuperar contraseña — InterU Honduras' }

export default async function RecuperarPage() {
  const sesion = await getCurrentUser()
  if (sesion) redirect(sesion.tienePerfil ? '/esperando' : '/completar')

  return (
    <AuthShell
      titulo="Recuperar contraseña"
      subtitulo="Te enviamos un enlace por correo para que elijas una nueva."
      panel={{
        badge: 'Ayuda de acceso',
        titulo: '¿Se te olvidó la clave?',
        texto: 'No pasa nada. Pide un enlace, elige una contraseña nueva y listo.',
      }}
    >
      <RecuperarForm />
    </AuthShell>
  )
}
