import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Quiénes somos — Asamblea Las Torres',
  description:
    'Conocé la historia, principios y estructura de la Asamblea Las Torres, organización territorial autogestiva de Quilicura.',
}

const principios = [
  {
    num: '01',
    title: 'Autonomía territorial',
    desc: 'Tomamos decisiones de forma horizontal, en asamblea, sin dependencia de estructuras externas. El territorio es nuestro espacio político.',
  },
  {
    num: '02',
    title: 'Biodiversidad nativa',
    desc: 'Apostamos por las especies propias del ecosistema local. Quillay, peumo, boldo y maitén son parte de nuestra identidad como de la flora chilena.',
  },
  {
    num: '03',
    title: 'Educación popular',
    desc: 'El conocimiento se construye colectivamente. Los talleres, encuentros y señalética buscan democratizar el saber sobre el territorio y la naturaleza.',
  },
  {
    num: '04',
    title: 'Cuidado del entorno',
    desc: 'El espacio es de todas y todos. Asumimos la responsabilidad colectiva de mantenerlo, mejorarlo y protegerlo para las generaciones que vienen.',
  },
  {
    num: '05',
    title: 'Encuentro comunitario',
    desc: 'El bosque es también un lugar de encuentro. Combatimos el individualismo y la fragmentación social generando espacios de participación abierta.',
  },
  {
    num: '06',
    title: 'Economía circular',
    desc: 'Trabajamos con lo que el territorio provee: compost, materia orgánica, mano de obra vecinal. Sin fertilizantes químicos, sin dependencia de mercados externos.',
  },
]

const estructura = [
  {
    icon: '🌿',
    title: 'Directiva',
    rol: 'Coordinación general',
    desc: 'Coordina las actividades generales de la asamblea, representa a la organización en instancias externas y facilita las decisiones colectivas.',
  },
  {
    icon: '🌳',
    title: 'Comisión ambiental',
    rol: 'Gestión del espacio verde',
    desc: 'Lidera las jornadas de reforestación, cuida las especies, planifica la expansión del bosque nativo y gestiona el compost.',
  },
  {
    icon: '🎨',
    title: 'Comisión cultural',
    rol: 'Arte y educación popular',
    desc: 'Organiza los murales, talleres y actividades educativas. Mantiene viva la dimensión cultural del espacio comunitario.',
  },
  {
    icon: '🤝',
    title: 'Asamblea general',
    rol: 'Máxima instancia de decisión',
    desc: 'Todas las socias y socios participan en la toma de decisiones de forma horizontal. La asamblea general es el corazón de la organización.',
  },
]

export default function QuienesSomos() {
  return (
    <>
      {/* ── HEADER ── */}
      <section className="bg-black pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="section-label mb-6">Quiénes somos</p>
          <h1
            className="font-display font-bold leading-none tracking-tight max-w-3xl"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
          >
            Una asamblea que actúa desde el territorio
          </h1>
        </div>
      </section>

      {/* ── HISTORIA + STATS ── */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Texto historia */}
            <div className="lg:col-span-2 space-y-5 text-off-white/65 leading-relaxed">
              <p>
                La Asamblea Las Torres nació en 2019 desde la organización vecinal de Quilicura,
                impulsada por la preocupación común frente a la falta de áreas verdes, los altos
                niveles de contaminación industrial y el creciente individualismo que erosionaba
                el tejido social del barrio.
              </p>
              <p>
                Desde el primer momento optamos por la autogestión: sin esperar ni depender de
                terceros para actuar. En 2020 iniciamos la transformación de un micro-basural
                en la calle Las Torres usando el método Miyawaki, generando el primer bosque
                nativo urbano de la zona.
              </p>
              <p>
                Hoy somos 16 socias y socios activos que mantenemos, ampliamos y animamos
                el espacio con jornadas de plantación, talleres de educación popular, murales
                comunitarios y actividades abiertas al barrio. El proyecto es vivo, en permanente
                construcción colectiva.
              </p>
              <p>
                En 2024 adjudicamos fondos concursables que nos permiten consolidar y fortalecer
                el espacio, incorporando nuevas especies, señalética en madera y actividades
                culturales de mayor alcance.
              </p>
            </div>

            {/* Card números */}
            <div className="card p-8 space-y-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-2">
                En números
              </p>
              {[
                { value: '16', label: 'socias y socios activos' },
                { value: '25+', label: 'especies nativas' },
                { value: '5', label: 'años de trabajo continuo' },
                { value: '100%', label: 'autogestión' },
              ].map((n) => (
                <div key={n.label} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                  <p className="font-display font-bold text-3xl text-green-light">{n.value}</p>
                  <p className="text-off-white/50 text-sm">{n.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRINCIPIOS ── */}
      <section className="bg-black py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="section-label mb-4">Cómo nos guiamos</p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight">
              Seis principios
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principios.map((p) => (
              <div key={p.num} className="card p-7">
                <p
                  className="font-display font-bold text-6xl text-green-base/20 leading-none mb-4 select-none"
                >
                  {p.num}
                </p>
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-off-white/55 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFIESTO ── */}
      <section className="bg-green-dark py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="section-label justify-center mb-8 text-green-light/70">Valores</p>
          <blockquote
            className="font-display font-bold leading-tight tracking-tight"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)' }}
          >
            "Creemos en el territorio como espacio político, en lo colectivo como herramienta,
            en la naturaleza como aliada."
          </blockquote>
          <p className="mt-8 text-off-white/50 text-sm uppercase tracking-widest">
            — Asamblea Las Torres
          </p>
        </div>
      </section>

      {/* ── ESTRUCTURA ── */}
      <section className="bg-zinc-900 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="section-label mb-4">Organización interna</p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight">
              Estructura organizacional
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {estructura.map((e) => (
              <div key={e.title} className="card p-7">
                <div className="text-3xl mb-4">{e.icon}</div>
                <h3 className="font-display font-bold text-lg mb-1">{e.title}</h3>
                <p className="text-xs text-green-light uppercase tracking-wider mb-3">{e.rol}</p>
                <p className="text-off-white/55 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-black py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-3xl lg:text-4xl tracking-tight mb-4">
            ¿Querés ser parte?
          </h2>
          <p className="text-off-white/55 mb-8">
            La asamblea está abierta. Escribinos y conversamos.
          </p>
          <Link href="/contacto" className="btn-primary">
            Contacto
          </Link>
        </div>
      </section>
    </>
  )
}
