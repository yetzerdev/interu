const ENLACES = [
  { label: 'Términos de servicio', href: '#terminos' },
  { label: 'Protección de datos HN', href: '#privacidad' },
  { label: 'Mesa de ayuda estudiantil', href: '#soporte' },
]

export default function SiteFooter() {
  return (
    <footer className="w-full max-w-6xl mx-auto py-3 text-center text-xs text-slate-400 space-y-1">
      <p>© {new Date().getFullYear()} InterU Honduras</p>
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
        {ENLACES.map((e, i) => (
          <span key={e.href} className="flex items-center gap-4">
            {i > 0 && <span aria-hidden>•</span>}
            <a className="hover:underline" href={e.href}>
              {e.label}
            </a>
          </span>
        ))}
      </div>
    </footer>
  )
}
