'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Rol } from '@prisma/client'

const MENU: Record<Rol, { href: string; label: string; icono: string }[]> = {
  ADMIN: [
    { href: '/dashboard', label: 'Inicio', icono: '🏡' },
    { href: '/dashboard/usuarios', label: 'Usuarios', icono: '👥' },
    { href: '/dashboard/proyectos', label: 'Proyectos', icono: '🌳' },
    { href: '/dashboard/blog', label: 'Blog', icono: '✍️' },
    { href: '/dashboard/noticias', label: 'Noticias', icono: '📰' },
    { href: '/dashboard/calendario', label: 'Calendario', icono: '📅' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes', icono: '📨' },
  ],
  ALTEA: [
    { href: '/dashboard', label: 'Inicio', icono: '🏡' },
    { href: '/dashboard/proyectos', label: 'Proyectos', icono: '🌳' },
    { href: '/dashboard/blog', label: 'Blog', icono: '✍️' },
    { href: '/dashboard/noticias', label: 'Noticias', icono: '📰' },
    { href: '/dashboard/calendario', label: 'Calendario', icono: '📅' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes', icono: '📨' },
  ],
  ALT: [
    { href: '/dashboard', label: 'Inicio', icono: '🏡' },
    { href: '/dashboard/proyectos', label: 'Proyectos', icono: '🌳' },
    { href: '/dashboard/calendario', label: 'Calendario', icono: '📅' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes', icono: '📨' },
  ],
}

const EMOJI_ROL: Record<Rol, string> = {
  ADMIN: '👑',
  ALTEA: '🌟',
  ALT: '🌱',
}

export const AVATAR_ACTUALIZADO_EVENT = 'avatar-actualizado'

export default function Sidebar({ rol, nombre }: { rol: Rol; nombre: string }) {
  const pathname = usePathname()
  const items = MENU[rol]
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    function cargarAvatar() {
      fetch('/api/usuarios/me')
        .then((r) => r.json())
        .then((data) => setAvatarUrl(data?.avatarUrl ?? null))
    }
    cargarAvatar()
    window.addEventListener(AVATAR_ACTUALIZADO_EVENT, cargarAvatar)
    return () => window.removeEventListener(AVATAR_ACTUALIZADO_EVENT, cargarAvatar)
  }, [])

  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-black/10 min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-black/10">
        <p className="font-display text-lg font-semibold text-green-dark mb-4 flex items-center gap-1.5">
          Panel ALT <span className="animate-balancear inline-block">🌱</span>
        </p>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-dark/20 shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-dark/15 to-green-mid/15 text-green-dark font-semibold flex items-center justify-center border-2 border-green-dark/10">
              {iniciales}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate">{nombre}</p>
            <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-semibold uppercase tracking-wide bg-green-dark/10 text-green-dark px-2 py-0.5 rounded-full">
              {EMOJI_ROL[rol]} {rol}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const activo = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activo
                  ? 'bg-green-dark/10 text-green-dark translate-x-0.5'
                  : 'text-zinc-700 hover:bg-black/5 hover:translate-x-0.5'
              }`}
            >
              <span
                className={`text-base transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-6 ${
                  activo ? 'scale-110' : ''
                }`}
              >
                {item.icono}
              </span>
              {item.label}
              {activo && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-dark animate-brillo" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-black/10">
        <button
          onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
          className="group w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
        >
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">👋</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
