import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { listarColaPendiente } from '@/lib/dal/verificaciones'
import { aprobarAction, rechazarAction } from '@/app/actions'

export const metadata = { title: 'Admin — InterU' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/ingresar')

  const { data: perfil } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()
  if (perfil?.role !== 'admin') redirect('/')

  const cola = await listarColaPendiente()

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Verificaciones pendientes</h1>
          <p className="text-sm text-neutral-600">
            Al aprobar, la imagen del carné se elimina automáticamente.
          </p>
        </header>

        {cola.length === 0 ? (
          <p className="rounded-lg border p-6 text-sm text-neutral-600">
            No hay solicitudes pendientes.
          </p>
        ) : (
          <ul className="space-y-3">
            {cola.map((req) => (
              <li
                key={req.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {req.method === 'email_institucional'
                      ? 'Correo institucional'
                      : 'Carné / matrícula'}
                  </p>
                  <p className="text-neutral-500">
                    {new Date(req.created_at).toLocaleString('es-HN')} ·{' '}
                    {req.evidence_path ? 'con evidencia' : 'sin evidencia'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={aprobarAction.bind(null, req.id)}>
                    <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                      Aprobar
                    </button>
                  </form>
                  <form action={rechazarAction.bind(null, req.id)}>
                    <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-700">
                      Rechazar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
