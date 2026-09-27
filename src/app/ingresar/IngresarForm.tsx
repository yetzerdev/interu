'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { iniciarSesionAction } from '@/app/actions'

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

export default function IngresarForm() {
  const [estado, accion, pendiente] = useActionState(iniciarSesionAction, {})

  return (
    <form action={accion} className="space-y-4">
      <div>
        <label className={label} htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className={`${input} px-4`}
          placeholder="tu.correo@ejemplo.com"
          autoComplete="email"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className={label} htmlFor="password" style={{ marginBottom: 0 }}>
            Contraseña
          </label>
          <a
            href="/recuperar"
            className="text-xs font-semibold text-brand-800 transition hover:text-brand-900 hover:underline"
          >
            ¿La olvidaste?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={`${input} px-4`}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      {estado.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {estado.error}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pendiente}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/25 transition duration-200 ease-out hover:bg-brand-900 disabled:opacity-60"
        >
          {pendiente ? 'Entrando…' : 'Ingresar'}
          {!pendiente && (
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          )}
        </button>
      </div>

      <p className="text-center text-xs text-slate-500">
        ¿Todavía no tienes cuenta?{' '}
        <Link
          href="/crear-cuenta"
          className="font-bold text-brand-800 transition hover:text-brand-900 hover:underline"
        >
          Crear una
        </Link>
      </p>
    </form>
  )
}
