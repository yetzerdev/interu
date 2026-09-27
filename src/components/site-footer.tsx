import Link from 'next/link'

const ENLACES = [
  { label: 'Términos de servicio', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Mesa de ayuda estudiantil', href: 'mailto:hola@interu.kibo.company' },
]

export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl space-y-1 py-3 text-center text-xs text-slate-400">
      <p>© {new Date().getFullYear()} InterU Honduras</p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
        {ENLACES.map((e, i) => (
          <span key={e.href} className="flex items-center gap-4">
            {i > 0 && <span aria-hidden>•</span>}
            {e.href.startsWith('/') ? (
              <Link className="transition hover:text-brand-800 hover:underline" href={e.href}>
                {e.label}
              </Link>
            ) : (
              <a className="transition hover:text-brand-800 hover:underline" href={e.href}>
                {e.label}
              </a>
            )}
          </span>
        ))}
      </div>
    </footer>
  )
}
