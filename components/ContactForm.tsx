'use client'

import { useState, FormEvent } from 'react'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const motivoOptions = [
  'Quiero participar en una jornada',
  'Quiero sumarme a la organización',
  'Tengo un proyecto similar',
  'Quiero donar herramientas o plantas',
  'Consulta general',
  'Otro',
]

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    motivo: '',
    mensaje: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Ocurrió un error inesperado.')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ nombre: '', email: '', motivo: '', mensaje: '' })
    } catch {
      setErrorMessage('No se pudo conectar con el servidor. Intenta nuevamente.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-dark/30 border border-green-base/40 rounded-xl p-10 text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h3 className="font-display font-bold text-2xl mb-3">
          ¡Mensaje recibido!
        </h3>
        <p className="text-off-white/70 mb-2">
          Tu mensaje llegó a{' '}
          <span className="text-green-light">hola@asamblealastorres.cl</span>
        </p>
        <p className="text-off-white/50 text-sm mb-6">
          Te responderemos a la brevedad posible.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-outline text-sm py-2 px-6"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nombre" className="block text-sm text-off-white/60 mb-2">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            className="input-field"
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-off-white/60 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="correo@ejemplo.cl"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="motivo" className="block text-sm text-off-white/60 mb-2">
          Motivo del contacto
        </label>
        <select
          id="motivo"
          name="motivo"
          required
          value={form.motivo}
          onChange={handleChange}
          className="input-field"
          disabled={status === 'loading'}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {motivoOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm text-off-white/60 mb-2">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          placeholder="Cuéntanos qué tienes en mente..."
          value={form.mensaje}
          onChange={handleChange}
          className="input-field resize-none"
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`btn-primary w-full text-center justify-center ${
          status === 'loading' ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  )
}
