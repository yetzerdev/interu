import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import AccesoForm from '@/components/acceso-form'

export const metadata = { title: 'Crear una cuenta — InterU Honduras' }

export default async function CrearCuentaPage() {
  const sesion = await getCurrentUser()
  if (sesion) redirect('/')

  return (
    <AuthShell
      titulo="Crear una cuenta"
      subtitulo="Dos campos y dentro. Tu nombre y universidad te los preguntamos después."
    >
      <AccesoForm />
    </AuthShell>
  )
}
