import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { obtenerEstadoUsuario } from '@/lib/dal/verificaciones'
import { getCurrentUser } from '@/lib/dal/sesion'
import { cerrarSesionAction } from '@/app/actions'
import SubirCarneForm from './SubirCarneForm'

export const metadata = { title: 'Verificación — InterU' }

export default async function EsperandoPage() {
  const sesion = await getCurrentUser()
  if (!sesion) redirect('/')
  if (!sesion.tienePerfil) redirect('/completar')

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/ingresar')

  const estado = await obtenerEstadoUsuario(data.user.id)

  return (
    <main className="flex-1 flex items-start justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-6">
        <form action={cerrarSesionAction} className="text-right">
          <button className="text-sm text-neutral-500 underline" type="submit">
            Cerrar sesión
          </button>
        </form>

        {estado.status === 'aprobado' && estado.alias ? (
          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 space-y-3">
            <h1 className="text-xl font-bold text-emerald-900">¡Verificado!</h1>
            <p className="text-sm text-emerald-800">
              Este es tu seudónimo público. Tu identidad real nunca se muestra.
            </p>
            <p className="rounded-lg bg-white px-4 py-3 text-center text-lg font-semibold text-emerald-700">
              @{estado.alias}
            </p>
            <p className="text-xs text-emerald-700">
              El feed público llega en la Fase 2. Por ahora ya puedes usar tu
              seudónimo.
            </p>
          </section>
        ) : estado.status === 'rechazado' ? (
          <section className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-2">
            <h1 className="text-xl font-bold text-red-900">Solicitud rechazada</h1>
            <p className="text-sm text-red-800">
              Tu evidencia no pudo validarse. La imagen se eliminó. Puedes
              registrarte de nuevo con un correo institucional.
            </p>
          </section>
        ) : (
          <section className="rounded-xl border p-6 space-y-4">
            <h1 className="text-xl font-bold">Estamos verificando tu carné…</h1>
            <p className="text-sm text-neutral-600">
              {estado.hasEvidence
                ? 'Recibimos tu foto. Un administrador la revisará pronto.'
                : 'Sube la foto de tu carné o matrícula para verificar que eres universitario.'}
            </p>
            {!estado.hasEvidence && <SubirCarneForm />}
          </section>
        )}
      </div>
    </main>
  )
}
