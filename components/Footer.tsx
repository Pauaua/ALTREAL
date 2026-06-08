import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Branding — logo grande */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ALT - Logo-02.png"
                alt="Asamblea Las Torres"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Organización Social, Cultural y Medio Ambiental autogestionada de Quilicura,
              Región Metropolitana, Chile.
            </p>
            <p className="mt-4 text-xs text-zinc-400 uppercase tracking-widest">
              Fundada 2019
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">
              Navegación
            </p>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/quienes-somos', label: 'Quiénes somos' },
                { href: '/proyectos', label: 'Proyectos' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* El espacio */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">
              El espacio
            </p>
            <ul className="space-y-3">
              {[
                'Forestación Miyawaki',
                'Murales comunitarios',
                'Talleres y encuentros',
                'Señalética en madera',
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-zinc-500">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-zinc-400 mb-1">Contacto</p>
              <a
                href="mailto:hola@asamblealastorres.cl"
                className="text-sm text-green-base hover:text-green-mid transition-colors"
              >
                hola@asamblealastorres.cl
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © 2025 Asamblea Las Torres · ALT · Quilicura
          </p>
        </div>
      </div>
    </footer>
  )
}
