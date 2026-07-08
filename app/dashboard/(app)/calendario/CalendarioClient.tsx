'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/dashboard/Modal'

type Rol = 'ADMIN' | 'ALTEA' | 'ALT'

type Evento = {
  id: string
  titulo: string
  descripcion: string | null
  fecha: string
  tipo: 'EVENTO' | 'INICIO_PROYECTO' | 'TERMINO_PROYECTO' | 'CUMPLEANOS' | 'OTRO'
  creador: { id: string; nombre: string }
}

const ETIQUETAS_TIPO: Record<Evento['tipo'], string> = {
  EVENTO: 'Evento',
  INICIO_PROYECTO: 'Inicio de proyecto',
  TERMINO_PROYECTO: 'Término de proyecto',
  CUMPLEANOS: 'Cumpleaños',
  OTRO: 'Otro',
}

const EMOJI_TIPO: Record<Evento['tipo'], string> = {
  EVENTO: '🌱',
  INICIO_PROYECTO: '🌳',
  TERMINO_PROYECTO: '🍂',
  CUMPLEANOS: '🎂',
  OTRO: '✨',
}

const COLOR_TIPO: Record<Evento['tipo'], string> = {
  EVENTO: 'bg-green-dark',
  INICIO_PROYECTO: 'bg-blue-500',
  TERMINO_PROYECTO: 'bg-zinc-400',
  CUMPLEANOS: 'bg-pink-500',
  OTRO: 'bg-amber-500',
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function claveFecha(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function faltanDias(fechaISO: string): string {
  const hoy = new Date()
  const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const fechaEvento = new Date(fechaISO)
  const eventoUTC = Date.UTC(fechaEvento.getUTCFullYear(), fechaEvento.getUTCMonth(), fechaEvento.getUTCDate())
  const dias = Math.round((eventoUTC - hoyUTC) / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Mañana'
  return `En ${dias} días`
}

const FORM_VACIO = {
  titulo: '',
  descripcion: '',
  fecha: '',
  tipo: 'EVENTO' as Evento['tipo'],
}

export default function CalendarioClient({ rol }: { rol: Rol }) {
  const puedeGestionar = rol === 'ADMIN' || rol === 'ALTEA'

  const hoy = new Date()
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1))
  const [eventos, setEventos] = useState<Evento[]>([])
  const [proximosEventos, setProximosEventos] = useState<Evento[]>([])
  const [cargando, setCargando] = useState(true)
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(claveFecha(hoy))
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Evento | null>(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  async function cargar() {
    setCargando(true)
    const desde = new Date(Date.UTC(mesActual.getFullYear(), mesActual.getMonth(), 1))
    const hasta = new Date(Date.UTC(mesActual.getFullYear(), mesActual.getMonth() + 1, 0, 23, 59, 59))
    const res = await fetch(`/api/eventos?desde=${desde.toISOString()}&hasta=${hasta.toISOString()}`)
    setEventos(await res.json())
    setCargando(false)
  }

  async function cargarProximos() {
    const desde = new Date(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()))
    const hasta = new Date(desde.getTime() + 30 * 24 * 60 * 60 * 1000)
    const res = await fetch(`/api/eventos?desde=${desde.toISOString()}&hasta=${hasta.toISOString()}`)
    setProximosEventos(await res.json())
  }

  useEffect(() => {
    cargar()
  }, [mesActual])

  useEffect(() => {
    cargarProximos()
  }, [])

  const eventosPorDia = useMemo(() => {
    const mapa: Record<string, Evento[]> = {}
    for (const ev of eventos) {
      const clave = ev.fecha.slice(0, 10)
      if (!mapa[clave]) mapa[clave] = []
      mapa[clave].push(ev)
    }
    return mapa
  }, [eventos])

  const celdas = useMemo(() => {
    const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
    const inicioSemana = (primerDia.getDay() + 6) % 7 // lunes=0
    const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate()

    const dias: (Date | null)[] = []
    for (let i = 0; i < inicioSemana; i++) dias.push(null)
    for (let d = 1; d <= diasEnMes; d++) dias.push(new Date(mesActual.getFullYear(), mesActual.getMonth(), d))
    while (dias.length % 7 !== 0) dias.push(null)
    return dias
  }, [mesActual])

  function abrirCrear(fecha?: string) {
    setEditando(null)
    setForm({ ...FORM_VACIO, fecha: fecha ?? diaSeleccionado })
    setError(null)
    setModalAbierto(true)
  }

  function abrirEditar(ev: Evento) {
    setEditando(ev)
    setForm({
      titulo: ev.titulo,
      descripcion: ev.descripcion ?? '',
      fecha: ev.fecha.slice(0, 10),
      tipo: ev.tipo,
    })
    setError(null)
    setModalAbierto(true)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      fecha: form.fecha,
      tipo: form.tipo,
    }

    const res = await fetch(editando ? `/api/eventos/${editando.id}` : '/api/eventos', {
      method: editando ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setGuardando(false)

    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar el evento')
      return
    }

    setModalAbierto(false)
    cargar()
    cargarProximos()
  }

  async function eliminar(ev: Evento) {
    if (!confirm(`¿Eliminar "${ev.titulo}"?`)) return
    await fetch(`/api/eventos/${ev.id}`, { method: 'DELETE' })
    cargar()
    cargarProximos()
  }

  const eventosDelDia = eventosPorDia[diaSeleccionado] ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            Calendario <span className="animate-balancear inline-block">📅</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {puedeGestionar
              ? 'Agenda eventos, inicios de proyecto y cumpleaños 🌱'
              : 'Eventos y fechas importantes de la organización'}
          </p>
        </div>
        {puedeGestionar && (
          <button onClick={() => abrirCrear()} className="btn-primary">
            + Crear evento
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card p-4 max-w-md">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1, 1))}
              className="text-xs font-medium text-zinc-500 hover:text-green-dark hover:-translate-x-0.5 transition-all px-2 py-1"
            >
              ← Anterior
            </button>
            <p className="font-display font-semibold text-sm">
              {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
            </p>
            <button
              onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1))}
              className="text-xs font-medium text-zinc-500 hover:text-green-dark hover:translate-x-0.5 transition-all px-2 py-1"
            >
              Siguiente →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-zinc-400 mb-1">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {celdas.map((dia, i) => {
              if (!dia) return <div key={i} />
              const clave = claveFecha(dia)
              const eventosDia = eventosPorDia[clave] ?? []
              const esHoy = clave === claveFecha(hoy)
              const seleccionado = clave === diaSeleccionado

              return (
                <button
                  key={clave}
                  onClick={() => setDiaSeleccionado(clave)}
                  onDoubleClick={() => puedeGestionar && abrirCrear(clave)}
                  className={`aspect-square rounded-md border text-left p-1 flex flex-col gap-0.5 transition-all hover:scale-[1.04] ${
                    seleccionado
                      ? 'border-green-dark bg-green-dark/5 shadow-sm'
                      : esHoy
                      ? 'border-green-dark/40'
                      : 'border-black/5 hover:border-black/15'
                  }`}
                >
                  <span className={`text-[11px] ${esHoy ? 'font-bold text-green-dark' : 'text-zinc-600'}`}>
                    {dia.getDate()}
                  </span>
                  <div className="flex flex-wrap gap-0.5">
                    {eventosDia.slice(0, 3).map((ev) => (
                      <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${COLOR_TIPO[ev.tipo]}`} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
          {cargando && <p className="text-xs text-zinc-400 mt-3">Cargando eventos... 🌱</p>}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold">
              {new Date(diaSeleccionado + 'T00:00:00').toLocaleDateString('es-CL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h2>

            {eventosDelDia.length === 0 ? (
              <p className="text-sm text-zinc-400">Sin eventos este día 🍃</p>
            ) : (
              <ul className="space-y-3">
                {eventosDelDia.map((ev) => (
                  <li
                    key={ev.id}
                    className="border border-black/10 rounded-lg p-3 transition-colors hover:border-green-dark/30 hover:bg-green-dark/[0.02]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{EMOJI_TIPO[ev.tipo]}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {ETIQUETAS_TIPO[ev.tipo]}
                      </span>
                    </div>
                    <p className="font-medium mt-1">{ev.titulo}</p>
                    {ev.descripcion && <p className="text-sm text-zinc-500 mt-0.5">{ev.descripcion}</p>}
                    <p className="text-xs text-zinc-400 mt-1">Agregado por {ev.creador.nombre}</p>
                    {puedeGestionar && (
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => abrirEditar(ev)}
                          className="text-xs font-medium text-green-dark hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(ev)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {puedeGestionar && (
              <button
                onClick={() => abrirCrear(diaSeleccionado)}
                className="btn-outline text-sm py-2 px-4 w-full text-center"
              >
                + Agregar evento este día
              </button>
            )}
          </div>

          <div className="card p-5 space-y-3">
            <h2 className="font-semibold flex items-center gap-1.5">
              Próximos 30 días <span className="animate-brillo inline-block">✨</span>
            </h2>

            {proximosEventos.length === 0 ? (
              <p className="text-sm text-zinc-400">Nada agendado por ahora 🌾</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {proximosEventos.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center gap-2.5 border border-black/5 rounded-lg px-3 py-2 hover:border-green-dark/20 hover:bg-green-dark/[0.02] transition-colors"
                  >
                    <span className="text-lg leading-none">{EMOJI_TIPO[ev.tipo]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{ev.titulo}</p>
                      <p className="text-xs text-zinc-400">
                        {new Date(ev.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-green-dark bg-green-dark/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {faltanDias(ev.fecha)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {modalAbierto && (
        <Modal titulo={editando ? '✏️ Editar evento' : '🌱 Crear evento'} onClose={() => setModalAbierto(false)}>
          <form onSubmit={guardar} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Título *</label>
              <input
                required
                className="input-field"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha *</label>
                <input
                  required
                  type="date"
                  className="input-field"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  className="input-field"
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as Evento['tipo'] })}
                >
                  {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
                    <option key={valor} value={valor}>
                      {EMOJI_TIPO[valor as Evento['tipo']]} {etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                rows={3}
                className="input-field"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>

            <button type="submit" disabled={guardando} className="btn-primary w-full text-center disabled:opacity-60">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
