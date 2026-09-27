'use client'

import { useActionState, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { LockKeyholeIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { actualizarClaveAction } from '@/app/actions'

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

function CampoClave({
  id,
  name,
  autoComplete,
}: {
  id: string
  name: string
  autoComplete: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        required
        minLength={8}
        className={`${input} pl-4 pr-11`}
        placeholder="••••••••"
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-brand-800"
      >
        <HugeiconsIcon
          icon={visible ? ViewIcon : ViewOffIcon}
          className="size-4"
          strokeWidth={2}
        />
      </button>
    </div>
  )
}

export default function ActualizarClaveForm() {
  const [estado, accion, pendiente] = useActionState(actualizarClaveAction, {})

  return (
    <form action={accion} className="space-y-4">
      <div>
        <label className={label} htmlFor="password">
          Nueva contraseña
        </label>
        <CampoClave id="password" name="password" autoComplete="new-password" />
        <p className="mt-1.5 text-xs text-slate-500">Mínimo 8 caracteres.</p>
      </div>

      <div>
        <label className={label} htmlFor="password2">
          Repite la contraseña
        </label>
        <CampoClave id="password2" name="password2" autoComplete="new-password" />
      </div>

      {estado.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          <HugeiconsIcon icon={LockKeyholeIcon} className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          {estado.error}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pendiente}
          className="w-full rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-800/25 transition duration-200 ease-out hover:bg-brand-900 disabled:opacity-60"
        >
          {pendiente ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </div>
    </form>
  )
}
