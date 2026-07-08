'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/dashboard/DataTable'
import Modal from '@/components/dashboard/Modal'

type Publicacion = {
  id: string
  titulo: string
  contenido: string
  resumen: string | null
  imagenUrl: string | null
  estado: 'BORRADOR' | 'PUBLICADA'
  autor: { id: string; nombre: string }
  createdAt: string
}

const FORM_VACIO = {
  titulo: '',
  contenido: '',
  resumen: '',
  imagenUrl: '',
  estado: 'BORRADOR' as 'BORRADOR' | 'PUBLICADA',
}

export default function PublicacionesClient({
  tipo,
  titulo,
}: {
  tipo: 'BLOG' | 'NOTICIA'
  titulo: string
}) {
  const [items, setItems] = useState<Publicacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Publicacion | null>(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  async function cargar() {
    setCargando(true)
    const res = await fetch(`/api/publicaciones?tipo=${tipo}`)
    setItems(await res.json())
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [tipo])

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setError(null)
    setModalAbierto(true)
  }

  function abrirEditar(p: Publicacion) {
    setEditando(p)
    setForm({
      titulo: p.titulo,
      contenido: p.contenido,
      resumen: p.resumen ?? '',
      imagenUrl: p.imagenUrl ?? '',
      estado: p.estado,
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
      contenido: form.contenido,
      resumen: form.resumen || null,
      imagenUrl: form.imagenUrl || null,
      estado: form.estado,
      ...(editando ? {} : { tipo }),
    }

    const res = await fetch(editando ? `/api/publicaciones/${editando.id}` : '/api/publicaciones', {
      method: editando ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setGuardando(false)

    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar')
      return
    }

    setModalAbierto(false)
    cargar()
  }

  async function eliminar(p: Publicacion) {
    if (!confirm(`¿Eliminar "${p.titulo}"?`)) return
    await fetch(`/api/publicaciones/${p.id}`, { method: 'DELETE' })
    cargar()
  }

  async function subirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendoImagen(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('carpeta', 'publicaciones')

    const res = await fetch('/api/upload/imagen', { method: 'POST', body: formData })
    const data = await res.json()
    setSubiendoImagen(false)

    if (!res.ok) {
      setError(data.error ?? 'No se pudo subir la imagen')
      return
    }

    setForm((prev) => ({ ...prev, imagenUrl: data.url }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{titulo}</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestiona el contenido publicado en el sitio</p>
        </div>
        <button onClick={abrirCrear} className="btn-primary">
          + Crear {tipo === 'BLOG' ? 'entrada' : 'noticia'}
        </button>
      </div>

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : (
        <DataTable<Publicacion>
          filas={items}
          vacio="No hay publicaciones todavía."
          columnas={[
            { header: 'Título', render: (p) => p.titulo },
            { header: 'Autor', render: (p) => p.autor.nombre },
            {
              header: 'Estado',
              render: (p) => (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.estado === 'PUBLICADA' ? 'bg-green-dark/10 text-green-dark' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {p.estado === 'PUBLICADA' ? 'Publicada' : 'Borrador'}
                </span>
              ),
            },
            { header: 'Fecha', render: (p) => new Date(p.createdAt).toLocaleDateString('es-CL') },
          ]}
          acciones={(p) => (
            <div className="flex gap-3 justify-end">
              <button onClick={() => abrirEditar(p)} className="text-sm font-medium text-green-dark hover:underline">
                Editar
              </button>
              <button onClick={() => eliminar(p)} className="text-sm font-medium text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {modalAbierto && (
        <Modal
          titulo={editando ? 'Editar publicación' : `Crear ${tipo === 'BLOG' ? 'entrada de blog' : 'noticia'}`}
          onClose={() => setModalAbierto(false)}
        >
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

            <div className="space-y-1">
              <label className="text-sm font-medium">Resumen</label>
              <input
                className="input-field"
                value={form.resumen}
                onChange={(e) => setForm({ ...form, resumen: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Contenido *</label>
              <textarea
                required
                rows={5}
                className="input-field"
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Imagen</label>
              {form.imagenUrl && (
                <img src={form.imagenUrl} alt="" className="w-full h-32 object-cover rounded-lg border border-black/10 mb-2" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={subirImagen}
                className="input-field"
              />
              {subiendoImagen && <p className="text-xs text-zinc-500">Subiendo imagen...</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Estado</label>
              <select
                className="input-field"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as 'BORRADOR' | 'PUBLICADA' })}
              >
                <option value="BORRADOR">Borrador</option>
                <option value="PUBLICADA">Publicada</option>
              </select>
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
