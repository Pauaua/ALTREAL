import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Blob decorativo */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-green-base/15 blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-green-dark/20 blur-[80px] animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <p className="section-label mb-6">Quilicura · Chile · Desde 2019</p>
              <h1
                className="font-display font-bold leading-none tracking-tight mb-6"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
              >
                Territorio.{' '}
                <span className="text-green-light">Raíz.</span>{' '}
                Comunidad.
              </h1>
              <p className="text-off-white/60 text-lg leading-relaxed max-w-md mb-8">
                Asamblea territorial autogestiva que trabaja en reforestación con especies nativas,
                regeneración de suelo y recuperación de espacios urbanos abandonados en Quilicura.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/proyectos" className="btn-primary">
                  Ver proyectos
                </Link>
                <Link href="/quienes-somos" className="btn-outline">
                  Quiénes somos
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {[
                  { value: '25+', label: 'especies nativas' },
                  { value: '2020', label: 'desde cuando' },
                  { value: '100%', label: 'autogestión' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display font-bold text-2xl text-green-light">{stat.value}</p>
                    <p className="text-xs text-off-white/40 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo animado */}
            <div className="flex justify-center lg:justify-end">
              <div className="animate-float relative w-64 h-64 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-full bg-green-base/10 blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Asamblea Las Torres"
                    width={280}
                    height={280}
                    className="object-contain drop-shadow-2xl"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  {/* Fallback visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-8xl text-green-base/20 select-none pointer-events-none">
                      ALT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRES PILARES ── */}
      <section className="bg-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label justify-center mb-4">Lo que hacemos</p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight">
              Tres ejes de acción
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌳',
                title: 'Medioambiental',
                desc: 'Reforestación con especies nativas usando el método Miyawaki. Regeneración de suelo degradado y recuperación de espacios urbanos abandonados.',
              },
              {
                icon: '🤝',
                title: 'Social',
                desc: 'Organización vecinal horizontal y autogestionada. Trabajo colectivo, toma de decisiones en asamblea y construcción de comunidad desde el territorio.',
              },
              {
                icon: '🎨',
                title: 'Cultural',
                desc: 'Arte urbano y educación popular como herramientas de transformación. Murales, talleres y encuentros abiertos a la comunidad de Quilicura.',
              },
            ].map((pilar) => (
              <div key={pilar.title} className="card p-8">
                <div className="text-4xl mb-5">{pilar.icon}</div>
                <h3 className="font-display font-bold text-xl mb-3">{pilar.title}</h3>
                <p className="text-off-white/55 text-sm leading-relaxed">{pilar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section className="bg-black py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Texto */}
            <div>
              <p className="section-label mb-6">Historia</p>
              <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight mb-6">
                De la asamblea al bosque
              </h2>
              <div className="space-y-4 text-off-white/60 leading-relaxed">
                <p>
                  En 2019, vecinas y vecinos de Quilicura comenzaron a reunirse para enfrentar las problemáticas
                  de su territorio: escasez de áreas verdes, contaminación industrial, y el individualismo que
                  fractura el tejido social.
                </p>
                <p>
                  De esas conversaciones nació la Asamblea Las Torres, una organización horizontal que decidió
                  actuar concretamente: transformar un micro-basural en la calle Las Torres en un bosque nativo
                  usando el método Miyawaki.
                </p>
                <p>
                  Hoy, con 16 socias y socios activos, gestionamos un espacio vivo que combina biodiversidad,
                  arte comunitario y educación popular. Un ejemplo concreto de que otro Quilicura es posible.
                </p>
              </div>
            </div>

            {/* Línea de tiempo */}
            <div className="space-y-0">
              {[
                {
                  year: '2019',
                  title: 'Formación de la asamblea',
                  desc: 'Organización vecinal frente a la falta de áreas verdes, contaminación y fragmentación social en Quilicura.',
                },
                {
                  year: '2020',
                  title: 'Primer bosque nativo',
                  desc: 'Inicio del proyecto de forestación en calle Las Torres. Transformación de un micro-basural usando método Miyawaki.',
                },
                {
                  year: '2021',
                  title: 'Mural comunitario',
                  desc: 'Primer intervención artística en el espacio. Participación vecinal directa en el diseño y ejecución.',
                },
                {
                  year: '2024',
                  title: 'Fondos concursables',
                  desc: 'Adjudicación de financiamiento para el proyecto "Consolidación y fortalecimiento del espacio social, ambiental y educativo Las Torres".',
                },
              ].map((item, i, arr) => (
                <div key={item.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-dark border-2 border-green-base flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-light">{i + 1}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-0.5 h-full bg-green-dark/40 my-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-xs font-semibold text-green-light uppercase tracking-wider">
                      {item.year}
                    </span>
                    <h4 className="font-display font-bold text-lg mt-1 mb-1">{item.title}</h4>
                    <p className="text-off-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIFIESTO ── */}
      <section className="bg-green-dark py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label justify-center mb-8 text-green-light/70">Manifiesto</p>
          <blockquote
            className="font-display font-bold leading-tight tracking-tight text-off-white"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
          >
            "Forestar nativo no es solo plantar árboles. Es devolver vida al territorio,
            identidad a la comunidad."
          </blockquote>
          <p className="mt-8 text-off-white/50 text-sm uppercase tracking-widest">
            — Asamblea Las Torres, Quilicura
          </p>
        </div>
      </section>

      {/* ── PREVIEW PROYECTOS ── */}
      <section className="bg-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label justify-center mb-4">Espacio Las Torres</p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight">
              Lo que construimos juntos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '🌲',
                title: 'Forestación Miyawaki',
                desc: 'Bosque nativo de alta densidad con 25+ especies activas. Transformación de espacio degradado en ecosistema urbano.',
              },
              {
                icon: '🎨',
                title: 'Murales comunitarios',
                desc: 'Intervenciones artísticas con participación vecinal directa. Arte como herramienta de identidad territorial.',
              },
              {
                icon: '📚',
                title: 'Talleres y encuentros',
                desc: 'Educación popular sobre plantas nativas, compostaje, huertos medicinales y muralismo urbano.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-7">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-off-white/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/proyectos" className="btn-primary">
              Ver proyecto completo
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-green-base py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight mb-4">
            ¿Te suma este proyecto?
          </h2>
          <p className="text-off-white/75 text-lg mb-8 leading-relaxed">
            Hay muchas formas de colaborar: participando en jornadas, compartiendo saberes,
            o simplemente siendo parte de la comunidad.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-off-white text-green-dark font-bold rounded-full px-10 py-4 hover:bg-off-white/90 hover:-translate-y-1 transition-all"
          >
            Escribinos
          </Link>
        </div>
      </section>
    </>
  )
}
