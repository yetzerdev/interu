'use client'

import { useActionState } from 'react'
import { subirCarneAction } from '@/app/actions'

export default function SubirCarneForm() {
  const [estado, accion, pendiente] = useActionState(subirCarneAction, {})

  return (
    <form action={accion} className="space-y-3">
      <input
        type="file"
        name="carne"
        accept="image/*"
        required
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
      />
      {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}
      <button
        type="submit"
        disabled={pendiente}
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pendiente ? 'Enviando…' : 'Enviar carné'}
      </button>
      <p className="text-xs text-neutral-500">
        Tu foto se elimina al aprobarse. Solo queda una prueba cifrada.
      </p>
    </form>
  )
}
