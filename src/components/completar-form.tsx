'use client'

import { useActionState, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { completarPerfilAction } from '@/app/actions'

type Univ = { id: string; name: string; code: string }
type Campus = { id: string; university_id: string; name: string }

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

function Chevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </div>
  )
}

export default function CompletarForm({
  universities,
  campuses,
}: {
  universities: Univ[]
  campuses: Campus[]
}) {
  const [estado, accion, pendiente] = useActionState(completarPerfilAction, {})
  const [universidad, setUniversidad] = useState('')

  const campusDeUniversidad = campuses.filter((c) => c.university_id === universidad)

  return (
    <form action={accion} className="space-y-4">
      <div>
        <label className={label} htmlFor="legalName">
          Nombre
        </label>
        <input
          id="legalName"
          name="legalName"
          required
          autoFocus
          className={`${input} px-4`}
          placeholder="Nombre y apellidos"
          autoComplete="name"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Se queda privado. El resto de la comunidad ve un seudónimo.
        </p>
      </div>

      <div>
        <label className={label} htmlFor="universityId">
          Universidad
        </label>
        <div className="relative">
          <select
            id="universityId"
            name="universityId"
            required
            value={universidad}
            onChange={(e) => setUniversidad(e.target.value)}
            className={`${input} cursor-pointer appearance-none bg-white px-4 pr-10`}
          >
            <option value="">Selecciona tu institución</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.code} — {u.name}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="campusId">
          Campus
        </label>
        <div className="relative">
          <select
            id="campusId"
            name="campusId"
            required
            disabled={!universidad}
            className={`${input} cursor-pointer appearance-none bg-white px-4 pr-10 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">
              {universidad ? 'Selecciona tu campus' : 'Elige una universidad primero'}
            </option>
            {campusDeUniversidad.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
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
          {pendiente ? 'Guardando…' : 'Completar perfil'}
          {!pendiente && (
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          )}
        </button>
      </div>
    </form>
  )
}
