import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Proyectos — Asamblea Las Torres',
  description:
    'Espacio comunitario y multicultural Las Torres #53 en Quilicura. Forestación nativa, huerta urbana, talleres y encuentros desde 2020.',
}

const especiesPorEstrato = [
  {
    estrato: 'Árboles nativos',
    especies: ['Quillay', 'Peumo', 'Algarrobo', 'Bollén', 'Maitén', 'Tara', 'Mayú', 'Espino'],
  },
  {
    estrato: 'Arbustos',
    especies: ['Boldo', 'Huingán', 'Molle', 'Chagualillo', 'Colliguay', 'Litre'],
  },
  {
    estrato: 'Estrato bajo',
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

const etapas = [
  {
    n: '01',
    estado: 'Completada',
    title: 'Limpieza, forestación y mantención',
    periodo: 'Octubre 2020 — actualidad',
    desc: 'Retiro de escombros y limpieza del terreno. Preparación de la tierra e inicio de la forestación con especies nativas. Jornadas de reforestación y mantención continua del espacio. Desde 2020 a la fecha se han forestado más de 25 especies nativas con presencia permanente en el lugar.',
  },
  {
    n: '02',
    estado: 'En desarrollo',
    title: 'Recurso hídrico y huerta urbana',
    periodo: 'Próxima etapa',
    desc: 'Instalación de un recurso hídrico constante que permita sustentar una huerta urbana comunitaria. Esta etapa incluirá talleres abiertos durante su construcción para educar sobre soberanía alimentaria y su puesta en práctica.',
  },
  {
    n: '03',
    estado: 'Proyectada',
    title: 'Infraestructura y talleres',
    periodo: 'Etapa futura',
    desc: 'Habilitación de un espacio cómodo y seguro para la implementación de talleres educativos abiertos a la comunidad. Enfocados en educación medioambiental, educación emocional, nivelación de contenidos y necesidades propias del territorio.',
  },
]

export default function Proyectos() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-bold text-white/5 select-none pointer-events-none leading-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 22rem)' }}
          aria-hidden="true"
        >
          #53
        </span>

        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="section-label mb-6" style={{ color: 'rgba(94,196,94,0.7)' }}>Proyecto principal</p>
          <h1
            className="font-display font-bold leading-none tracking-tight mb-4 text-white"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)' }}
          >
            Espacio Comunitario{' '}
            <span className="text-green-light">Las Torres #53</span>
          </h1>
          <p className="text-white/55 text-xl mb-10 max-w-2xl leading-relaxed">
            Un espacio que hace nacer un ecosistema nativo único en medio de la ciudad.
            Autogestionado desde el territorio, sostenido por trabajo comunitario, dedicado
            a la regeneración del suelo y al encuentro de quienes habitan Quilicura.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Fundación ALT', value: '2019' },
              { label: 'Inicio del espacio', value: 'Oct. 2020' },
              { label: 'Ubicación', value: 'Av. Las Torres, Quilicura' },
              { label: 'Estado', value: 'Activo' },
            ].map((m) => (
              <div key={m.label} className="border border-white/10 rounded-lg px-4 py-3">
                <p className="text-xs text-white/40 uppercase tracking-wider">{m.label}</p>
                <p className="font-semibold text-sm mt-0.5 text-white">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-16 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '25+', label: 'Especies nativas forestadas' },
              { value: '5+', label: 'Años de trabajo continuo' },
              { value: '3', label: 'Ejes del proyecto' },
              { value: '2019', label: 'Año de fundación' },
            ].map((s) => (
              <div key={s.label} className="text-center py-6">
                <p className="font-display font-bold text-green-base" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                  {s.value}
                </p>
                <p className="text-zinc-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ── */}
      <section className="bg-zinc-50 py-20 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="section-label mb-4">La razón de ser</p>
            <h2 className="font-display font-bold text-4xl tracking-tight text-zinc-900 max-w-2xl">
              Tres pilares que sostienen el proyecto
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌿',
                title: 'Medioambiente y calidad de vida',
                desc: 'Cuidar el ecosistema ya no es un capricho, es una necesidad. Contrarrestamos las islas de calor urbanas con núcleos de bosque nativo que favorecen la calidad del aire y la regulación de temperaturas en Quilicura.',
              },
              {
                icon: '🧠',
                title: 'Áreas verdes y salud mental',
                desc: 'Las áreas verdes son vitales para la salud mental. En Quilicura, zona industrial, estos espacios se ven cada vez más reducidos. Las Torres #53 es una respuesta concreta a esa escasez.',
              },
              {
                icon: '🤝',
                title: 'Educación y espacios comunitarios',
                desc: 'En una sociedad individualista, generar espacios de encuentro es urgente. Creamos instancias de aprendizaje colectivo que responden a las necesidades reales de las comunidades del territorio.',
              },
            ].map((p) => (
              <div key={p.title} className="card p-8">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-display font-bold text-lg mb-3 text-zinc-900">{p.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETAPAS + SIDEBAR ESPECIES ── */}
      <section className="bg-white py-20 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Etapas */}
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-8">
                <p className="section-label mb-4">Estructura del proyecto</p>
                <h2 className="font-display font-bold text-4xl tracking-tight text-zinc-900">
                  Tres etapas
                </h2>
                <p className="text-zinc-500 mt-3 leading-relaxed">
                  El espacio avanza por etapas concretas, desde la forestación inicial hasta
                  la proyección de una huerta urbana e infraestructura para talleres. La primera
                  etapa lleva activa de forma ininterrumpida desde octubre de 2020.
                </p>
              </div>

              <div className="space-y-5">
                {etapas.map((e) => (
                  <div key={e.n} className="card p-7">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="font-display font-bold text-4xl text-green-base/15 leading-none select-none">
                          {e.n}
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-lg text-zinc-900">{e.title}</h3>
                          <p className="text-xs text-zinc-400 mt-0.5">{e.periodo}</p>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                        e.estado === 'Completada'
                          ? 'bg-green-base/10 text-green-base'
                          : e.estado === 'En desarrollo'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {e.estado}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar especies */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="card p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">
                  Especies forestadas
                </p>
                <div className="space-y-5">
                  {especiesPorEstrato.map((grupo) => (
                    <div key={grupo.estrato}>
                      <p className="text-xs text-green-base font-semibold uppercase tracking-wider mb-2">
                        {grupo.estrato}
                      </p>
                      <ul className="space-y-1">
                        {grupo.especies.map((esp) => (
                          <li key={esp} className="text-sm text-zinc-500 flex items-start gap-2">
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
      <section className="bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="section-label mb-4">Más que un bosque</p>
            <h2 className="font-display font-bold text-4xl tracking-tight text-zinc-900">
              Actividades del espacio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Murales comunitarios',
                desc: 'Intervenciones artísticas con participación vecinal directa. El primer mural data de 2021 y el espacio sigue creciendo con nuevas creaciones colectivas.',
              },
              {
                icon: '📚',
                title: 'Talleres y encuentros',
                desc: 'Instancias abiertas de educación popular sobre plantas nativas, soberanía alimentaria, cuidado del entorno y otras necesidades que la comunidad levanta.',
              },
              {
                icon: '🪵',
                title: 'Señalética en madera',
                desc: 'Placas grabadas para cada especie del bosque. Una forma de educar mientras se camina, conectando a quienes visitan el espacio con la flora nativa.',
              },
            ].map((act) => (
              <div key={act.title} className="card p-7">
                <div className="text-3xl mb-4">{act.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2 text-zinc-900">{act.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRABAJO CONTINUO ── */}
      <section className="bg-white py-20 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-5">Desde 2020 sin parar</p>
              <h2 className="font-display font-bold text-4xl tracking-tight text-zinc-900 mb-5">
                Un proyecto en construcción permanente
              </h2>
              <div className="space-y-4 text-zinc-500 leading-relaxed">
                <p>
                  Las Torres #53 no es un proyecto de nadie en particular: es un espacio que
                  el territorio fue haciendo posible. La asamblea cumple un rol de gestión y
                  acompañamiento, pero lo que sostiene el espacio es el trabajo colectivo de
                  quienes lo habitan y lo cuidan.
                </p>
                <p>
                  El foco está puesto en la regeneración del suelo mediante la forestación con
                  especies nativas, contribuyendo a revertir el deterioro ambiental de una
                  zona con alta densidad industrial y escasas áreas verdes.
                </p>
                <p>
                  Desde octubre de 2020 a hoy, el espacio no ha dejado de crecer: nuevas especies,
                  nuevas intervenciones artísticas, nuevas instancias de encuentro abierto.
                  Es un organismo vivo, autogestionado, que se construye con cada jornada.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { year: '2020', hito: 'Limpieza y primera forestación' },
                { year: '2021', hito: 'Primer mural comunitario' },
                { year: '2022', hito: 'Reforestación y mantención' },
                { year: '2024', hito: 'Fondos concursables adjudicados' },
              ].map((h) => (
                <div key={h.year} className="card p-5">
                  <p className="font-display font-bold text-2xl text-green-base mb-1">{h.year}</p>
                  <p className="text-zinc-500 text-sm leading-snug">{h.hito}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-green-dark py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl tracking-tight mb-4 text-white">
            ¿Querés sumarte a una jornada?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Organizamos jornadas de plantación, talleres y encuentros abiertos.
            Contáctanos para saber cuándo es la próxima actividad.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-green-dark font-bold rounded-full px-10 py-4 hover:bg-white/90 hover:-translate-y-1 transition-all"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </>
  )
}
