import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import { obtenerEstadoUsuario } from '@/lib/dal/verificaciones'
import { cerrarSesionAction } from '@/app/actions'
import AuthShell from '@/components/auth-shell'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'

export const metadata = { title: 'Tu seudónimo — InterU Honduras' }

export default async function EsperandoPage() {
  const sesion = await getCurrentUser()
  if (!sesion) redirect('/ingresar')
  if (!sesion.tienePerfil) redirect('/completar')

  const estado = await obtenerEstadoUsuario(sesion.userId)

  return (
    <AuthShell
      titulo="Listo"
      subtitulo="Tu perfil quedó creado. Este es el nombre con el que te ve el resto."
      panel={{
        badge: 'Cuenta activa',
        titulo: 'Ya sos parte de la comunidad.',
        texto: 'Tu identidad real nunca se muestra. Solo tu seudónimo, tu universidad y lo que publiques.',
      }}
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-emerald-800">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-5" strokeWidth={2} />
            <h2 className="text-sm font-bold uppercase tracking-wide">Tu seudónimo</h2>
          </div>
          <p className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-emerald-800">
            @{estado.alias}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
            Nadie puede ver tu nombre ni tu correo. Guardalo: es tu única
            identificación dentro de InterU.
          </p>
        </section>

        <p className="text-xs leading-relaxed text-slate-500">
          El feed público todavía no está activo. Cuando lo activemos vas a poder
          compartir apuntes y publicar con este seudónimo.
        </p>

        <form action={cerrarSesionAction}>
          <button
            type="submit"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
