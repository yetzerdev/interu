import Image from 'next/image'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Logout01Icon,
} from '@hugeicons/core-free-icons'
import { cerrarSesionAction } from '@/app/actions'

/**
 * Barra superior del home. Solo dos zonas: marca a la izquierda, perfil a la
 * derecha. Una sola linea en escritorio por construccion, porque no hay items
 * de navegacion que puedan desbordar.
 *
 * Radio (regla de forma del proyecto): pastilla para lo que se toca como
 * chip de identidad (trigger del perfil, avatar), 12px para las acciones del
 * menu. Nunca se mezclan en el mismo control.
 */
export default function Navbar({ alias }: { alias: string | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition active:scale-[0.98]"
          aria-label="InterU Honduras, inicio"
        >
          <Image
            src="/isotipo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="size-8 object-contain"
          />
          <span className="text-[15px] font-extrabold tracking-tight text-ink">
            InterU
          </span>
        </Link>

        {alias ? <MenuPerfil alias={alias} /> : <LinksAcceso />}
      </div>
    </header>
  )
}

function MenuPerfil({ alias }: { alias: string }) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pr-3 pl-1 text-sm font-semibold text-ink transition hover:border-slate-300 active:scale-[0.97] [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-800 text-xs font-bold text-white"
        >
          {alias.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[10ch] truncate">@{alias}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="size-3.5 shrink-0 text-slate-400 transition-transform duration-200 ease-out group-open:rotate-180"
          strokeWidth={2}
          aria-hidden
        />
      </summary>

      <div className="nav-menu absolute right-0 z-30 mt-2 w-60 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_34px_-14px_rgba(15,23,42,0.25)]">
        <div className="px-3 py-2.5">
          <p className="text-sm font-bold text-ink">@{alias}</p>
          <p className="mt-0.5 text-xs text-muted">Tu seudónimo público</p>
        </div>
        <div className="my-1 h-px bg-slate-100" />
        <Link
          href="/esperando"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-slate-50 active:scale-[0.98]"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 text-slate-400"
            strokeWidth={2}
            aria-hidden
          />
          Ver mi cuenta
        </Link>
        <form action={cerrarSesionAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink active:scale-[0.98]"
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              className="size-4 text-slate-400"
              strokeWidth={2}
              aria-hidden
            />
            Cerrar sesión
          </button>
        </form>
      </div>
    </details>
  )
}

function LinksAcceso() {
  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/ingresar"
        className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-ink active:scale-[0.98]"
      >
        Ingresar
      </Link>
      <Link
        href="/crear-cuenta"
        className="rounded-xl bg-brand-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-900 active:scale-[0.97]"
      >
        Crear cuenta
      </Link>
    </div>
  )
}
