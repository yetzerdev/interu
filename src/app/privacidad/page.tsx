import LegalPage, { Seccion, Pendiente } from '@/components/legal-page'

export const metadata = {
  title: 'Política de privacidad — InterU Honduras',
  description:
    'Qué datos recogemos, por qué, con quién los compartimos y cómo pedir su eliminación.',
}

export default function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Política de privacidad"
      actualizado="27 de septiembre de 2026"
      resumen="InterU está diseñado para que tu identidad real no sea pública. Tu nombre, tu correo y tu documento nunca aparecen en la plataforma: lo que ve el resto de la comunidad es un seudónimo que generamos en el servidor. Esta política explica exactamente qué guardamos, por qué, y cómo pedir que lo borremos."
    >
      <Seccion titulo="1. Responsable">
        <p>
          Este servicio es operado por <Pendiente>NOMBRE O RAZÓN SOCIAL</Pendiente>, con
          domicilio en <Pendiente>DOMICILIO, HONDURAS</Pendiente>. Para cualquier asunto
          relacionado con tus datos puedes escribir a{' '}
          <a href="mailto:privacidad@interu.kibo.company">privacidad@interu.kibo.company</a>.
        </p>
      </Seccion>

      <Seccion titulo="2. Qué recogemos">
        <p>Solo pedimos lo que el servicio necesita para funcionar:</p>
        <ul>
          <li>
            <strong>Correo electrónico.</strong> Es la única forma de iniciar sesión y de
            mandarte los enlaces para cambiar tu contraseña. Puedes registrarte con
            cualquier correo: no exigimos que sea institucional ni que pertenezca a una
            universidad.
          </li>
          <li>
            <strong>Contraseña.</strong> La guarda Supabase Auth en forma de hash. Nosotros
            nunca vemos ni almacenamos tu contraseña en texto plano, y no podemos
            recuperarla ni comunicártela: solo puedes cambiarla.
          </li>
          <li>
            <strong>Nombre.</strong> Lo usas únicamente para tu ficha privada. No se publica.
          </li>
          <li>
            <strong>Universidad y campus.</strong> Los eliges de un catálogo. Se usan para
            generar tu seudónimo y, más adelante, para mostrarte contenido de tu misma
            facultad. Seguardan porque son el único dato que alimenta ese filtro.
          </li>
          <li>
            <strong>Seudónimo (alias).</strong> Es tu identidad pública. El servidor lo
            genera a partir de tu campus y de un valor aleatorio, y no puedes elegirlo ni
            adivinar el de otra persona.
          </li>
          <li>
            <strong>Datos técnicos.</strong> Supabase y Vercel pueden registrar tu dirección
            IP y tu navegador para mantener la sesión iniciada, detectar intentos de abuso y
            diagnosticar fallos.
          </li>
        </ul>
        <p>
          <strong>No</strong> pedimos documento de identidad, ni selfie, ni foto de carné.
          Esos campos existieron en una versión anterior del producto y hoy el registro no
          los usa en ningún caso.
        </p>
      </Seccion>

      <Seccion titulo="3. Si entras con Google o Microsoft">
        <p>
          Si eliges esos botones, el proveedor te devuelve tu nombre y tu correo, y nosotros
          los guardamos igual que si los escribieras a mano. El proveedor se convierte en
          parte del flujo de registro, pero sigue siendo responsable de sus propios datos:
          puedes revisar su política de privacidad y revocar el acceso desde la configuración
          de tu cuenta de Google o Microsoft.
        </p>
      </Seccion>

      <Seccion titulo="4. Qué es público y qué no">
        <p>
          La separación es deliberada. Tu perfil público contiene únicamente tu seudónimo,
          tu universidad, tu campus y el contenido que publiques. Tu nombre, tu correo
          electrónico y tu documento de identidad viven en una base de datos separada a la
          que la aplicación web no tiene acceso: ni los administradores pueden consultarla
          desde el panel, y el sistema está configurado para que sea imposible leerla desde
          el navegador.
        </p>
        <p>
          Esto significa que <strong>no podemos buscar tu cuenta por tu nombre real</strong>,
          y que tampoco podemos entregarla a quien la reclame.
        </p>
      </Seccion>

      <Seccion titulo="5. Con quién compartimos tus datos">
        <p>
          Usamos proveedores externos, todos fuera de Honduras. Eso implica que tus datos
          salen del país, y lo decimos explícitamente:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — base de datos y autenticación. Luxemburgo y Estados
            Unidos.
          </li>
          <li>
            <strong>Vercel</strong> — alojamiento de la web y de los formularios.
          </li>
          <li>
            <strong>Resend</strong> — envío de los correos de recuperación de contraseña.
          </li>
          <li>
            <strong>Google o Microsoft</strong> — solo si usas esos accesos, y solo por lo
            que ya describimos.
          </li>
        </ul>
        <p>
          No vendemos, alquilamos ni cedemos tus datos con fines publicitarios, y no los
          usamos para entrenar modelos de inteligencia artificial. No compartimos datos
          individuales con universidades ni con empleadores.
        </p>
      </Seccion>

      <Seccion titulo="6. Cookies">
        <p>
          Usamos un único tipo de cookie: la que mantiene tu sesión iniciada. No hay
          publicidad, ni rastreo entre sitios, ni analítica de terceros. Si en el futuro
          incorporamos alguna herramienta de medición, lo anunciaremos aquí antes y te
          daremos una opción para rechazarla.
        </p>
      </Seccion>

      <Seccion titulo="7. Conservación">
        <p>
          Conservamos tu cuenta y su contenido mientras esté activa. Si solicitas la
          eliminación, borramos tu perfil, tu ficha privada y tus publicaciones en un plazo
          máximo de 30 días, salvo que debamos retener algo por una obligación legal concreta
          —por ejemplo, un registro de acceso previsto en la Ley de Transparencia y Acceso a
          la Información Pública, Decreto 170-2006—.
        </p>
      </Seccion>

      <Seccion titulo="8. Tus derechos">
        <p>
          La Constitución de la República de Honduras reconoce el derecho a la intimidad, al
          honor y a la propia imagen (artículos 24 y 76), la inviolabilidad y el secreto de
          las comunicaciones (artículo 100), y el hábeas data (artículo 182, numeral 2). La
          Ley de Transparencia y Acceso a la Información Pública regula la protección de los
          datos personales en sus artículos 23 a 26. Honduras todavía no cuenta con una ley
          integral de protección de datos personales: el proyecto del Instituto de Acceso a
          la Información Pública sigue en trámite. En ausencia de esa norma específica,
          aplicamos voluntariamente los principios de finalidad, proporcionalidad y
          seguridad que la Constitución exige.
        </p>
        <p>Con respecto a tus datos puedes:</p>
        <ul>
          <li>Saber qué datos tenemos y pedir una copia.</li>
          <li>Pedir que corrijamos un dato equivocado.</li>
          <li>
            Oponerte al uso de tus datos y solicitar su eliminación. Al eliminar la cuenta
            se borra también tu seudónimo, así que esa decisión no se puede deshacer.
          </li>
        </ul>
        <p>
          Escríbenos a{' '}
          <a href="mailto:privacidad@interu.kibo.company">privacidad@interu.kibo.company</a> con
          el asunto «Solicitud ARCO» y respondemos en un máximo de 15 días hábiles.
        </p>
      </Seccion>

      <Seccion titulo="9. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas: las contraseñas se guardan cifradas;
          los datos personales viven en un esquema de base de datos al que la aplicación web
          no tiene acceso; las reglas de permisos impiden que un cliente escriba en la base
          de datos o se atribuya permisos de administrador; y los buckets de archivos son
          privados. El acceso interno se hace con credenciales de servidor que nunca se
          exponen al navegador.
        </p>
        <p>
          Aun así, ningún sistema es infalible. Si sufrimos una brecha que afecte tus datos,
          lo comunicaremos sin demora y, cuando sea posible, con el detalle de qué se filtró
          y qué puedes hacer al respecto.
        </p>
      </Seccion>

      <Seccion titulo="10. Menores de edad">
        <p>
          InterU está dirigido a personas mayores de 18 años. Si tienes menos de 18 y usas
          el servicio, hazlo con el consentimiento de tu madre, tu padre o tu tutor y
          escríbenos: podemos darte de baja.
        </p>
      </Seccion>

      <Seccion titulo="11. Cambios en esta política">
        <p>
          Si el cambio es importante te lo avisamos por correo. La fecha de la parte
          superior de esta página siempre refleja la última versión.
        </p>
      </Seccion>
    </LegalPage>
  )
}
