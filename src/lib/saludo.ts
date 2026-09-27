// Honduras es UTC-6 todo el ano: el pais no aplica horario de verano, asi que
// el offset es fijo y no hay que consultar si hubo dia de cambio.
const OFFSET_HONDURAS = -6

export type Saludo = 'Buenos días' | 'Buenas tardes' | 'Buenas noches'

/**
 * Saludo segun la hora de Honduras, no la del visitante. Un portal Hondureno
 * con la hora local mostraria "Buenas noches" a un estudiante en Tegucigalpa
 * entrando a las 3 de la tarde porque su reloj esta corrido.
 *
 * Cortes: 05:00-11:59 manana, 12:00-18:59 tarde, 19:00-04:59 noche.
 */
export function saludoHonduras(fecha: Date): Saludo {
  const hora = (fecha.getUTCHours() + OFFSET_HONDURAS + 24) % 24
  if (hora >= 5 && hora < 12) return 'Buenos días'
  if (hora >= 12 && hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}
