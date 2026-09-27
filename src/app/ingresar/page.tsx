import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import IngresarForm from './IngresarForm'

export const metadata = { title: 'Ingresar — InterU' }

export default async function IngresarPage() {
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

  return (
    <main className="flex-1 flex items-start justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Ingresar</h1>
        <IngresarForm />
      </div>
    </main>
  )
}
