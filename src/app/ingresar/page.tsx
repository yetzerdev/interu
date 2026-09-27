import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import IngresarForm from './IngresarForm'

export const metadata = { title: 'Ingresar — InterU Honduras' }

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const sesion = await getCurrentUser()
  if (sesion) {
    redirect(
      !sesion.tienePerfil
        ? '/completar'
        : sesion.esAdmin
          ? '/admin'
          : '/esperando',
    )
  }

  const { error } = await searchParams
  const enlaceVencio = error === 'recovery'

  return (
    <AuthShell
      titulo="Ingresar"
      subtitulo="Accede a tus debates, apuntes de clase y red estudiantil hondureña."
      panel={{
        badge: 'Bienvenido de vuelta',
        titulo: 'Tu comunidad te estuvo esperando.',
        texto: 'Entra con el correo que usaste al registrarte para recuperar tus apuntes y debates.',
      }}
    >
      {enlaceVencio && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800"
        >
          El enlace para cambiar la contraseña venció o ya se usó. Pide uno nuevo.
        </p>
      )}
      <IngresarForm />
    </AuthShell>
  )
}
