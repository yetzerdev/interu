'use client'

import { useActionState, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { registrarAction, oauthAction } from '@/app/actions'

const label = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'
const input =
  'w-full py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition'

export default function AccesoForm() {
  const [estado, accion, pendiente] = useActionState(registrarAction, {})
  const [, oauthAccion, oauthPendiente] = useActionState(oauthAction, {})
  const [verClave, setVerClave] = useState(false)

  return (
    <>
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
            <span className="text-xs text-slate-400">Mínimo 8 caracteres</span>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={verClave ? 'text' : 'password'}
              required
              minLength={8}
              className={`${input} pl-4 pr-11`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? 'Ocultar contraseña' : 'Ver contraseña'}
              aria-pressed={verClave}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-brand-800"
            >
              <HugeiconsIcon
                icon={verClave ? ViewIcon : ViewOffIcon}
                className="size-4"
                strokeWidth={2}
              />
            </button>
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
            {pendiente ? 'Creando tu cuenta…' : 'Continuar'}
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

      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs font-medium tracking-wide text-slate-400">
          o continúa con
        </span>
      </div>

      <form action={oauthAccion}>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            name="provider"
            value="google"
            disabled={oauthPendiente}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-white disabled:opacity-60"
          >
            <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
              <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" fill="#4285F4" />
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.25 21.36 7.33 24 12 24z" fill="#34A853" />
              <path d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.14z" fill="#FBBC05" />
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="submit"
            name="provider"
            value="azure"
            disabled={oauthPendiente}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-white disabled:opacity-60"
          >
            <svg className="size-4" viewBox="0 0 21 21" aria-hidden>
              <rect fill="#f25022" height="9" width="9" x="1" y="1" />
              <rect fill="#7fba00" height="9" width="9" x="11" y="1" />
              <rect fill="#00a4ef" height="9" width="9" x="1" y="11" />
              <rect fill="#ffb900" height="9" width="9" x="11" y="11" />
            </svg>
            <span>Microsoft 365</span>
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        ¿Ya tienes una cuenta?{' '}
        <a
          href="/ingresar"
          className="font-bold text-brand-800 transition hover:text-brand-900 hover:underline"
        >
          Iniciar sesión
        </a>
      </p>
    </>
  )
}
