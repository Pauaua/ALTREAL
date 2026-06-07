import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto — Asamblea Las Torres',
  description:
    'Escribinos para participar en jornadas, sumarte a la organización, donar herramientas o simplemente hacer una consulta.',
}

const formasColaborar = [
  'Participar en jornadas de reforestación',
  'Sumarte como socia o socio a la organización',
  'Donar herramientas o plantas nativas',
  'Compartir saberes e intercambiar conocimientos',
  'Replicar el modelo en otro barrio o comunidad',
  'Divulgar y apoyar el proyecto desde donde estés',
]

export default function Contacto() {
  return (
    <>
      {/* ── HEADER ── */}
      <section className="bg-black pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="section-label mb-6">Ponerse en contacto</p>
          <h1
            className="font-display font-bold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
          >
            Hablemos.{' '}
            <span className="text-green-light">Estamos aquí.</span>
          </h1>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-black pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Info de contacto */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-4">
                  Correo
                </p>
                <a
                  href="mailto:hola@asamblealastorres.cl"
                  className="text-green-light font-semibold hover:text-green-mid transition-colors"
                >
                  hola@asamblealastorres.cl
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-4">
                  Ubicación del espacio
                </p>
                <p className="text-off-white/70 leading-relaxed">
                  Av. Las Torres esq. Fontana Rosa<br />
                  Quilicura, Región Metropolitana<br />
                  Chile
                </p>
              </div>

              <div className="card p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-off-white/40 mb-4">
                  Formas de colaborar
                </p>
                <ul className="space-y-3">
                  {formasColaborar.map((forma) => (
                    <li key={forma} className="flex items-start gap-3">
                      <span className="text-green-base mt-0.5 flex-shrink-0">✦</span>
                      <span className="text-off-white/65 text-sm">{forma}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-l-2 border-green-base pl-5">
                <p className="text-off-white/55 text-sm leading-relaxed italic">
                  "El proyecto es de todas y todos. Tu participación, grande o pequeña,
                  hace la diferencia."
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
                <h2 className="font-display font-bold text-2xl mb-2">Envianos un mensaje</h2>
                <p className="text-off-white/45 text-sm mb-8">
                  Completá el formulario y te respondemos a la brevedad.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO ADICIONAL ── */}
      <section className="bg-zinc-900 py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: '🌳',
                title: 'Jornadas abiertas',
                desc: 'Organizamos actividades periódicas en el espacio. Son abiertas y no requieren experiencia previa.',
              },
              {
                icon: '📍',
                title: 'Quilicura',
                desc: 'El espacio físico está en Av. Las Torres esq. Fontana Rosa. La asamblea se reúne regularmente.',
              },
              {
                icon: '🌱',
                title: 'Sin burocracia',
                desc: 'Somos una organización horizontal. No hay requisitos ni trámites para sumarse.',
              },
            ].map((item) => (
              <div key={item.title} className="py-4">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-off-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
