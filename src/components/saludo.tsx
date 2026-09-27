import Image from 'next/image'
import { saludoHonduras } from '@/lib/saludo'

/**
 * Saludo del home. El nombre real va en las tres franjas; el gif acompaña la
 * manana y la tarde, y de noche el home se queda en calma.
 */
export default function Saludo({ nombre }: { nombre: string | null }) {
  const saludo = saludoHonduras(new Date())
  const conGif = saludo !== 'Buenas noches'

  return (
    <div className="greeting flex items-center gap-4 sm:gap-6">
      {/* leading-[1.05] y no leading-none: la "g" de "días" tiene descendente
          y con line-height 1 se recorta. pb-1 le da aire. */}
      <h1 className="pb-1 text-4xl leading-[1.05] font-extrabold tracking-tighter text-balance text-ink sm:text-5xl lg:text-6xl">
        {saludo}
        {nombre ? `, ${nombre}` : ''}
      </h1>

      {conGif && (
        <Image
          src="/diagif.gif"
          alt=""
          width={140}
          height={120}
          className="size-14 shrink-0 object-contain sm:size-20 lg:size-24"
        />
      )}
    </div>
  )
}
