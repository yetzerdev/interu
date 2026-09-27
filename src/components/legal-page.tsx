import Link from 'next/link'
import type { ReactNode } from 'react'
import SiteFooter from '@/components/site-footer'

/**
 * Cromosoma de /privacidad y /terminos. Documentos largos, asi que usan
 * un tamano de lectura comodo en vez del armazon partido del home.
 */
export default function LegalPage({
  titulo,
  resumen,
  actualizado,
  children,
}: {
  titulo: string
  resumen: string
  actualizado: string
  children: ReactNode
}) {
  return (
    <div className="bg-dot-pattern flex min-h-dvh flex-col justify-between p-4 antialiased sm:p-6 lg:p-8">
      <main className="mx-auto w-full max-w-3xl flex-1 py-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_55px_-15px_rgba(20,30,65,0.12)] sm:p-10">
          <Link
            href="/"
            className="text-xs font-semibold text-brand-800 transition hover:text-brand-900 hover:underline"
          >
            ← Volver a InterU
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {titulo}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Última actualización: {actualizado}</p>
          <p className="mt-5 text-base leading-relaxed text-slate-600">{resumen}</p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export function Seccion({
  titulo,
  children,
}: {
  titulo: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-bold tracking-tight text-slate-900">{titulo}</h2>
      <div className="space-y-3 [&_a]:font-semibold [&_a]:text-brand-800 [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  )
}

/** Marca un dato que el administrador tiene que rellenar antes de publicar. */
export function Pendiente({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-900">
      {children}
    </code>
  )
}
