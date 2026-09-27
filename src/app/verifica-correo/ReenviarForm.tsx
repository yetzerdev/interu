'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { MailboxIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { reenviarConfirmacionAction } from '@/app/actions'

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

export default function ReenviarForm() {
  const [estado, accion, pendiente] = useActionState(reenviarConfirmacionAction, {})

  if (estado.enviado) {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-brand-50 px-4 py-3.5">
        <HugeiconsIcon
          icon={MailboxIcon}
          className="mt-0.5 size-5 shrink-0 text-brand-800"
          strokeWidth={1.75}
        />
        <p className="text-sm leading-relaxed text-brand-900">
          Listo. Si ese correo tiene una cuenta sin confirmar, le mandamos un
          enlace nuevo. Revisá también la carpeta de spam.
        </p>
      </div>
    )
  }

  return (
    <form action={accion} className="space-y-3">
      <label className={label} htmlFor="reemail">
        ¿No te llegó? Reenvíalo
      </label>
      <input
        id="reemail"
        name="email"
        type="email"
        required
        className={`${input} px-4`}
        placeholder="tu.correo@ejemplo.com"
        autoComplete="email"
      />
      {estado.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {estado.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pendiente}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white disabled:opacity-60"
      >
        {pendiente ? 'Enviando…' : 'Reenviar correo de confirmación'}
        {!pendiente && (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        )}
      </button>
      <p className="text-center text-xs text-slate-500">
        ¿Ya lo confirmaste?{' '}
        <Link href="/ingresar" className="font-bold text-brand-800 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  )
}
