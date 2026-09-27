import LegalPage, { Seccion, Pendiente } from '@/components/legal-page'

export const metadata = {
  title: 'Términos de servicio — InterU Honduras',
  description: 'Las reglas de uso de la comunidad estudiantil de InterU Honduras.',
}

export default function TerminosPage() {
  return (
    <LegalPage
      titulo="Términos de servicio"
      actualizado="27 de septiembre de 2026"
      resumen="Estas reglas explican qué ofrece InterU, qué se espera de ti si te registrás, y qué pasa si alguien las incumple. Al crear una cuenta las aceptás. Son un borrador redactado para el lanzamiento y necesitan revisión de un abogado abrigado en Honduras antes de publicarse como versión definitiva."
    >
      <Seccion titulo="1. Quién ofrece el servicio">
        <p>
          InterU Honduras es operado por <Pendiente>NOMBRE O RAZÓN SOCIAL</Pendiente>, con
          domicilio en <Pendiente>DOMICILIO, HONDURAS</Pendiente>. Escribinos a{' '}
          <a href="mailto:hola@interu.kibo.company">hola@interu.kibo.company</a>.
        </p>
      </Seccion>

      <Seccion titulo="2. Qué es InterU">
        <p>
          InterU es una red comunitaria para estudiantes universitarios hondureños. Sirve
          para compartir apuntes, discutir ideas y conocer gente de tu misma facultad. Tu
          cuenta es gratuita y el servicio se ofrece «tal cual», sin garantía de que esté
          disponible todo el tiempo ni de que una función concreta permanezca sin cambios.
        </p>
      </Seccion>

      <Seccion titulo="3. Tu cuenta">
        <ul>
          <li>
            Podés crear una cuenta con cualquier correo válido, institucional o no. Solo se
            admiten mayores de 18 años.
          </li>
          <li>
            Sos la única persona responsable de tu contraseña. Avisanos de inmediato si
            creés que alguien más accedió a tu cuenta.
          </li>
          <li>
            No podés crear cuentas múltiples para votar, para conseguir ventajas o para
            evadir una sanción.
          </li>
          <li>
            No podés usar el seudónimo de otra persona, ni presentar tu cuenta como de
            alguien que no sos.
          </li>
          <li>Podés pedir la eliminación de tu cuenta cuando quieras.</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. Identidad: lo que el mundo ve y lo que no">
        <p>
          Al completar el perfil generás un <strong>seudónimo</strong> que es tu identidad
          pública. Tu nombre real, tu correo y tu documento quedan en una base separada a la
          que la aplicación no tiene acceso, y no se publican nunca.
        </p>
        <p>
          Al navegar, <strong>la otra persona ve un seudónimo, no una persona</strong>.
          InterU no es un espacio para identificar a terceros. No publiques datos personales
          de otras personas —nombres completos, documentos, teléfonos, direcciones— sin su
          permiso, y no uses la plataforma para acosar, presionar ni exponer a nadie.
        </p>
      </Seccion>

      <Seccion titulo="5. Uso permitido">
        <p>Está permitido compartir apuntes, preguntar, responder y conversar. No está permitido:</p>
        <ul>
          <li>Insultar, amenazar, perseguir o incitar al odio por raza, género, origen, religión, orientación sexual o cualquier otra característica.</li>
          <li>Acosar a otra persona, publicar fotos o datos suyos sin su consentimiento, ni presionarla para que se borre.</li>
          <li>Publicar contenido ilegal, violento, sexual o que promueva el odio.</li>
          <li>Enviar spam o intentar estafar a otras personas.</li>
          <li>Suplantar a otra persona o a una institución.</li>
          <li>Copiar el contenido de forma masiva y automática, ni usar robots para raspar la plataforma.</li>
          <li>Usar la plataforma para copiar o distribuir trabajos que no te pertenecen, o para que alguien lo haga por ti.</li>
          <li>Intentar acceder a cuentas ajenas, ni a las bases de datos que guardan las identidades reales.</li>
        </ul>
      </Seccion>

      <Seccion titulo="6. Tu contenido">
        <p>
          Lo que publicás sigue siendo tuyo. Al publicarlo nos das una licencia sencilla,
          no exclusiva y sin ánimo de lucro, para mostrarlo dentro de InterU: en el perfil de
          quien lo escribió, en búsquedas o en extractos destacados. Esa licencia termina
          cuando borrás el contenido.
        </p>
        <p>
          Si publicás material que no es tuyo, nos estás garantindo que tenés derecho a
          hacerlo. Si un tercero reclama un contenido, podemos retirarlo.
        </p>
      </Seccion>

      <Seccion titulo="7. Moderación">
        <p>
          Podemos editar, ocultar o borrar cualquier publicación y suspender o cerrar cuentas
          que incumplan estas reglas. Las suspensiones se aplican también a reincidentes y a
          cuentas creadas para evadir una sanción previa.
        </p>
        <p>
          Si considerás que una decisión fue injusta, escribinos y lo revisamos. No fijamos
          un plazo porque no queremos que la revisión se vuelva rutinaria.
        </p>
      </Seccion>

      <Seccion titulo="8. Responsabilidad">
        <p>
          InterU pone el mejor esfuerzo para que el servicio funcione, pero no respondemos
          por lucro cesante, ni por la pérdida de datos, ni por el contenido publicado por
          terceros. Tu responsabilidad máxima frente a nosotros queda limitada{' '}
          <Pendiente>MONTO O LÍMITE A DEFINIR</Pendiente>.
        </p>
        <p>
          Nada en estos términos excluye la responsabilidad que no puede excluirse por ley.
        </p>
      </Seccion>

      <Seccion titulo="9. Cambios">
        <p>
          Podemos modificar estos términos. Si el cambio afecta tus derechos de forma
          relevante, te lo avisamos por correo con quince días de anticipación. Si seguís
          usando InterU después, aceptás la versión nueva.
        </p>
      </Seccion>

      <Seccion titulo="10. Ley aplicable">
        <p>
          Estos términos se rigen por la ley de la República de Honduras. Las controversias
          se someten a los tribunales competentes de{' '}
          <Pendiente>CIUDAD</Pendiente>, Honduras, renunciando las partes a invocar otro
          fuero.
        </p>
      </Seccion>
    </LegalPage>
  )
}
