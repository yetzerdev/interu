'use client'

import { useActionState } from 'react'
import { iniciarSesionAction } from '@/app/actions'

const inputCls =
  'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-600'

export default function IngresarForm() {
  const [estado, accion, pendiente] = useActionState(iniciarSesionAction, {})

  return (
    <form action={accion} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required className={inputCls} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required className={inputCls} />
      </div>
      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}
      <button
        type="submit"
        disabled={pendiente}
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pendiente ? 'Entrando…' : 'Ingresar'}
      </button>
    </form>
  )
}
