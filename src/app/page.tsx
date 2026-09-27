import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircleIcon } from '@hugeicons/core-free-icons'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import SiteFooter from '@/components/site-footer'
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
    <div className="bg-dot-pattern flex min-h-dvh flex-col justify-between p-4 text-slate-800 antialiased sm:p-6 lg:p-8">
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center py-2">
        <div className="grid w-full grid-cols-1 items-stretch gap-4 rounded-[28px] border border-slate-100 bg-white p-3 shadow-[0_20px_55px_-15px_rgba(20,30,65,0.12)] sm:p-4 lg:grid-cols-12 lg:gap-8">
          {/* ---------- Panel de marca ---------- */}
          <section className="hero-mesh-gradient relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-white sm:min-h-[420px] sm:p-8 lg:col-span-5 lg:min-h-[580px]">
            <Image
              src="/jovenes.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full object-cover object-center"
            />
            <div aria-hidden className="absolute inset-0 bg-[#082654]/30" />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#082654] via-[#0d3b82]/82 to-transparent"
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/95 p-2 shadow-lg backdrop-blur-md">
                <Image
                  src="/isotipo.png"
                  alt="InterU Honduras"
                  width={36}
                  height={36}
                  className="size-9 object-contain"
                  priority
                />
              </div>
            </div>

            <div className="relative z-10 space-y-4 drop-shadow-[0_2px_12px_rgba(6,26,60,0.75)]">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-200">
                <HugeiconsIcon
                  icon={CheckmarkCircleIcon}
                  className="size-4 text-cyan-300"
                  strokeWidth={2}
                />
                Acceso seguro verificado
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                Tu comunidad universitaria reunida en un solo lugar.
              </h2>
              <p className="text-sm leading-relaxed text-blue-100/90">
                Conecta, comparte apuntes y debate ideas con pares de las
                principales instituciones académicas de Honduras.
              </p>
            </div>
          </section>

          {/* ---------- Formulario ---------- */}
          <section className="flex flex-col justify-center px-4 py-6 sm:px-8 lg:col-span-7 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Crear una cuenta
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Dos campos y dentro. Tu nombre y universidad te los preguntamos
                después.
              </p>
            </div>

            <AccesoForm />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
