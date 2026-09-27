'use client'

import { useActionState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, MailboxIcon } from '@hugeicons/core-free-icons'
import { recuperarClaveAction } from '@/app/actions'

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

export default function RecuperarForm() {
  const [estado, accion, pendiente] = useActionState(recuperarClaveAction, {})

  if (estado.enviado) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-brand-50 px-4 py-3.5">
          <HugeiconsIcon
            icon={MailboxIcon}
            className="mt-0.5 size-5 shrink-0 text-brand-800"
            strokeWidth={1.75}
          />
          <p className="text-sm leading-relaxed text-brand-900">
            Si ese correo tiene una cuenta, te enviamos un enlace para cambiar
            tu contraseña. Revisá la bandeja de spam.
          </p>
        </div>
        <a
          href="/ingresar"
          className="block text-center text-sm font-semibold text-brand-800 transition hover:text-brand-900 hover:underline"
        >
          Volver a iniciar sesión
        </a>
      </div>
    )
  }

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
          {pendiente ? 'Enviando…' : 'Enviar enlace'}
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
        ¿Recordaste la clave?{' '}
        <a
          href="/ingresar"
          className="font-bold text-brand-800 transition hover:text-brand-900 hover:underline"
        >
          Iniciar sesión
        </a>
      </p>
    </form>
  )
}
