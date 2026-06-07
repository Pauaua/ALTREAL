import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Proyectos — Asamblea Las Torres',
  description:
    'Espacio Las Torres #53: bosque nativo con método Miyawaki en Av. Las Torres, Quilicura. 25+ especies, murales y talleres comunitarios.',
}

const especiesPorEstrato = [
  {
    estrato: 'Dominante',
    especies: ['Bollén', 'Peumo', 'Quillay', 'Algarrobo', 'Maitén', 'Tara', 'Mayú'],
  },
  {
    estrato: 'Arbustivo',
    especies: ['Boldo', 'Huingán', 'Molle', 'Chagualillo', 'Colliguay', 'Litre'],
  },
  {
    estrato: 'Suelo',
    especies: ['Tralhuén', 'Belloto del Norte', 'Belloto del Sur'],
  },
  {
    estrato: 'Palmera',
    especies: ['Palma chilena'],
  },
  {
    estrato: 'Pasto nativo',
    especies: ['Tiqui Tiqui'],
  },
  {
    estrato: 'Incorporaciones 2024',
    especies: [
      'Quebracho (Senna candolleana)',
      'Corcolén (Azara serrata)',
      'Chagual (Puya chilensis)',
      'Romerillo (Baccharis linearis)',
      'Maqui (Aristotelia chilensis)',
    ],
  },
]

const pasosMiyawaki = [
  {
    n: 1,
    title: 'Diagnóstico del suelo',
    desc: 'Evaluación del estado inicial del terreno. En este caso: alta degradación, relleno con escombros y basura acumulada.',
  },
  {
    n: 2,
    title: 'Enmienda y regeneración',
    desc: 'Incorporación de materia orgánica y compost para restablecer la vida microbiana del suelo y mejorar su estructura.',
  },
  {
    n: 3,
    title: 'Selección de especies nativas',
    desc: 'Identificación de plantas propias del ecosistema local por estrato ecológico: dominante, arbustivo, suelo y pasto.',
  },
  {
    n: 4,
    title: 'Plantación densa y estratificada',
    desc: 'Alta densidad de plantación que genera competencia positiva entre especies. Esto acelera el crecimiento y la resiliencia.',
  },
  {
    n: 5,
    title: 'Riego y acompañamiento inicial',
    desc: 'Cuidado intensivo en los primeros años hasta que el bosque alcanza autosustentabilidad. Sin fertilizantes químicos.',
  },
]

export default function Proyectos() {
  return (
    <>
      {/* ── HERO OSCURO ── */}
      <section className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        {/* Texto decorativo */}
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-bold text-white/3 select-none pointer-events-none leading-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 22rem)' }}
          aria-hidden="true"
        >
          #53
        </span>

        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="section-label mb-6">Proyecto principal</p>
          <h1
            className="font-display font-bold leading-none tracking-tight mb-2"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)' }}
          >
            Espacio Las Torres{' '}
            <span className="text-green-light">#53</span>
          </h1>
          <p className="text-off-white/55 text-xl mb-10 max-w-xl leading-relaxed">
            Bosque nativo urbano en el corazón de Quilicura. Transformación de un espacio degradado
            en un ecosistema vivo para el barrio.
          </p>

          {/* Metadatos */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Inicio', value: '2020' },
              { label: 'Ubicación', value: 'Av. Las Torres, Quilicura' },
              { label: 'Método', value: 'Miyawaki' },
              { label: 'Estado', value: 'En curso' },
            ].map((m) => (
              <div key={m.label} className="border border-white/10 rounded-lg px-4 py-3">
                <p className="text-xs text-off-white/40 uppercase tracking-wider">{m.label}</p>
                <p className="font-semibold text-sm mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS IMPACTO ── */}
      <section className="bg-black py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '25+', label: 'Especies nativas' },
              { value: '5', label: 'Años de trabajo' },
              { value: '3', label: 'Villas beneficiadas' },
              { value: '10x', label: 'Más rápido que método convencional' },
            ].map((s) => (
              <div key={s.label} className="text-center py-6">
                <p className="font-display font-bold text-green-light" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                  {s.value}
                </p>
                <p className="text-off-white/45 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL + SIDEBAR ── */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-14">
              {/* El problema */}
              <div>
                <p className="section-label mb-5">El contexto</p>
                <h2 className="font-display font-bold text-3xl tracking-tight mb-5">
                  Quilicura y la crisis ambiental urbana
                </h2>
                <div className="space-y-4 text-off-white/60 leading-relaxed">
                  <p>
                    Quilicura es una de las comunas con mayor densidad industrial de la Región
                    Metropolitana. Esta concentración tiene un impacto directo y cotidiano en
                    la calidad del aire, el agua y la salud de sus habitantes.
                  </p>
                  <p>
                    La escasez de áreas verdes es un problema de salud pública concreto: la falta
                    de cobertura vegetal genera islas de calor, empeorar la calidad del aire y
                    elimina espacios de encuentro comunitario. La calle Las Torres tenía un
                    micro-basural donde hoy hay un bosque.
                  </p>
                  <p>
                    El método Miyawaki, desarrollado por el botánico japonés Akira Miyawaki
                    (1928–2021), permite crear bosques nativos de alta densidad y diversidad
                    biológica en espacios reducidos, hasta 10 veces más rápido que los métodos
                    convencionales.
                  </p>
                </div>
              </div>

              {/* Método Miyawaki */}
              <div>
                <p className="section-label mb-5">La metodología</p>
                <h2 className="font-display font-bold text-3xl tracking-tight mb-2">
                  Método Miyawaki
                </h2>
                <p className="text-off-white/55 mb-8">
                  Genera bosques hasta 10 veces más rápidos, 30 veces más densos y 100 veces
                  más biodiversos que plantaciones convencionales. Sin fertilizantes ni abonos
                  químicos. Autosustentable a mediano plazo.
                </p>
                <div className="space-y-4">
                  {pasosMiyawaki.map((paso) => (
                    <div key={paso.n} className="flex gap-5 items-start">
                      <div className="w-9 h-9 rounded-full bg-green-dark border border-green-base flex-shrink-0 flex items-center justify-center">
                        <span className="font-display font-bold text-sm text-green-light">
                          {paso.n}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold mb-1">{paso.title}</h4>
                        <p className="text-off-white/55 text-sm leading-relaxed">{paso.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar sticky con especies */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="card p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-5">
                  Especies presentes
                </p>
                <div className="space-y-5">
                  {especiesPorEstrato.map((grupo) => (
                    <div key={grupo.estrato}>
                      <p className="text-xs text-green-light font-semibold uppercase tracking-wider mb-2">
                        {grupo.estrato}
                      </p>
                      <ul className="space-y-1">
                        {grupo.especies.map((esp) => (
                          <li key={esp} className="text-sm text-off-white/60 flex items-start gap-2">
                            <span className="text-green-base mt-0.5">·</span>
                            {esp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── ACTIVIDADES ── */}
      <section className="bg-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="section-label mb-4">Más que un bosque</p>
            <h2 className="font-display font-bold text-4xl tracking-tight">
              Actividades del espacio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Murales urbanos',
                desc: 'Restauración del mural original de 2021 y creación de nuevas intervenciones con participación vecinal directa en diseño y ejecución.',
              },
              {
                icon: '📚',
                title: 'Talleres comunitarios',
                desc: 'Educación popular sobre fertilización y cuidado de plantas nativas, plantas comestibles, huertos medicinales y muralismo urbano.',
              },
              {
                icon: '🪵',
                title: 'Señalética en madera',
                desc: 'Placas grabadas a mano para cada especie del bosque con nombre científico, características y usos tradicionales.',
              },
            ].map((act) => (
              <div key={act.title} className="card p-7">
                <div className="text-3xl mb-4">{act.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{act.title}</h3>
                <p className="text-off-white/55 text-sm leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTRAS INICIATIVAS ── */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <p className="section-label mb-4">Más allá del espacio</p>
            <h2 className="font-display font-bold text-3xl tracking-tight">
              Otras iniciativas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="text-3xl mb-4">🕸️</div>
              <h3 className="font-display font-bold text-xl mb-2">Red territorial</h3>
              <p className="text-off-white/55 leading-relaxed">
                Articulación con organizaciones vecinales, colectivos y agrupaciones de
                Quilicura y otras comunas. Compartimos metodologías y apoyamos iniciativas
                similares en otros territorios.
              </p>
            </div>
            <div className="card p-8">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-display font-bold text-xl mb-2">Apoyo a proyectos similares</h3>
              <p className="text-off-white/55 leading-relaxed">
                Acompañamos a grupos que quieren replicar el modelo Miyawaki en sus barrios.
                Compartimos experiencia, errores y aprendizajes sin costo y con mucho gusto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-green-dark py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl tracking-tight mb-4">
            ¿Querés sumarte a una jornada?
          </h2>
          <p className="text-off-white/70 text-lg mb-8">
            Organizamos jornadas de plantación, talleres y encuentros abiertos.
            Escribinos para saber cuándo es la próxima actividad.
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
