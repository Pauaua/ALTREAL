import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Branding */}
          <div>
            <p className="font-display font-bold text-lg mb-3">
              Asamblea <span className="text-green-light">Las Torres</span>
            </p>
            <p className="text-off-white/50 text-sm leading-relaxed max-w-xs">
              Organización Social, Cultural y Medio Ambiental autogestiva de Quilicura,
              Región Metropolitana, Chile.
            </p>
            <p className="mt-4 text-xs text-off-white/30 uppercase tracking-widest">
              Fundada 2019
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-5">
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
                    className="text-sm text-off-white/55 hover:text-off-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proyectos */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-5">
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
                  <span className="text-sm text-off-white/55">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-off-white/40 mb-1">Contacto</p>
              <a
                href="mailto:hola@asamblealastorres.cl"
                className="text-sm text-green-light hover:text-green-mid transition-colors"
              >
                hola@asamblealastorres.cl
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-off-white/30">
            © 2025 Asamblea Las Torres · ALT · Quilicura
          </p>
          <p className="text-xs text-off-white/20">
            100% autogestión · 16 socias y socios activos
          </p>
        </div>
      </div>
    </footer>
  )
}
