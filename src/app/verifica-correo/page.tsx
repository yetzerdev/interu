import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/sesion'
import AuthShell from '@/components/auth-shell'
import ReenviarForm from './ReenviarForm'

export const metadata = { title: 'Confirma tu correo — InterU Honduras' }

export default async function VerificaCorreoPage() {
  // Si ya confirmo, no tiene sentido quedarse aqui.
  const sesion = await getCurrentUser()
  if (sesion)
    redirect(
      !sesion.tienePerfil
        ? '/completar'
        : sesion.esAdmin
          ? '/admin'
          : '/esperando',
    )

  return (
    <AuthShell
      titulo="Revisá tu correo"
      subtitulo="Te mandamos un enlace para confirmar que el correo es tuyo."
      panel={{
        badge: 'Un paso más',
        titulo: 'Confirmá y entrás.',
        texto: 'Necesitamos confirmar el correo para que nadie se registre con la dirección de otra persona. El enlace también sirve para volver más adelante.',
      }}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
          <p className="text-sm leading-relaxed text-slate-600">
            Abrí el correo que registraste y hacé clic en el enlace de
            confirmación. Te trae de vuelta acá y completás tu perfil.
          </p>
        </div>

        <ReenviarForm />
      </div>
    </AuthShell>
  )
}
