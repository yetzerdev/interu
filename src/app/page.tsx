import { redirect } from 'next/navigation'
import { getCurrentUser, getNombreReal } from '@/lib/dal/sesion'
import Navbar from '@/components/navbar'
import Saludo from '@/components/saludo'

export const metadata = { title: 'InterU Honduras' }

export default async function HomePage() {
  const sesion = await getCurrentUser()
  if (sesion && !sesion.tienePerfil) redirect('/completar')
  if (sesion?.esAdmin) redirect('/admin')

  const nombre = sesion ? await getNombreReal(sesion.userId) : null

  return (
    <div className="bg-dot-pattern flex min-h-dvh flex-col">
      <Navbar nombre={nombre} alias={sesion?.alias ?? null} />

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <Saludo nombre={nombre} />
        </div>
      </main>
    </div>
  )
}
