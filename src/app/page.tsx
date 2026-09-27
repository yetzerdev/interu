import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import { saludoHonduras } from '@/lib/saludo'
import Navbar from '@/components/navbar'

export const metadata = { title: 'InterU Honduras' }

export default async function HomePage() {
  const sesion = await getCurrentUser()
  if (sesion && !sesion.tienePerfil) redirect('/completar')
  if (sesion?.esAdmin) redirect('/admin')

  return (
    <div className="bg-dot-pattern flex min-h-dvh flex-col">
      <Navbar alias={sesion?.alias ?? null} />

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          {/* leading-[1.05] y no leading-none: la "g" de "días" tiene
              descendente y con line-height 1 se recorta. pb-1 le da aire. */}
          <h1 className="greeting max-w-[14ch] pb-1 text-5xl leading-[1.05] font-extrabold tracking-tighter text-ink sm:text-6xl lg:text-7xl">
            {saludoHonduras(new Date())}
          </h1>
        </div>
      </main>
    </div>
  )
}
