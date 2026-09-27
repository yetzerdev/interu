import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import AccesoForm from '@/components/acceso-form'

export default async function HomePage() {
  const sesion = await getCurrentUser()
  if (sesion)
    redirect(
      !sesion.tienePerfil
        ? '/completar'
        : sesion.esAdmin
          ? '/admin'
          : '/esperando',
    )

  return (
    <AuthShell
      titulo="Crear una cuenta"
      subtitulo="Dos campos y dentro. Tu nombre y universidad te los preguntamos después."
    >
      <AccesoForm />
    </AuthShell>
  )
}
