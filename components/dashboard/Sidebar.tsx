'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { Rol } from '@prisma/client'

const MENU: Record<Rol, { href: string; label: string }[]> = {
  ADMIN: [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/usuarios', label: 'Usuarios' },
    { href: '/dashboard/proyectos', label: 'Proyectos' },
    { href: '/dashboard/blog', label: 'Blog' },
    { href: '/dashboard/noticias', label: 'Noticias' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes' },
  ],
  ALTEA: [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/proyectos', label: 'Proyectos' },
    { href: '/dashboard/blog', label: 'Blog' },
    { href: '/dashboard/noticias', label: 'Noticias' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes' },
  ],
  ALT: [
    { href: '/dashboard', label: 'Inicio' },
    { href: '/dashboard/proyectos', label: 'Proyectos' },
    { href: '/dashboard/solicitudes', label: 'Solicitudes' },
  ],
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
        <p className="font-display text-lg font-semibold text-green-dark mb-4">Panel ALT</p>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={nombre} className="w-12 h-12 rounded-full object-cover border border-black/10" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-dark/10 text-green-dark font-semibold flex items-center justify-center">
              {iniciales}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate">{nombre}</p>
            <span className="inline-block mt-0.5 text-[11px] font-semibold uppercase tracking-wide bg-green-dark/10 text-green-dark px-2 py-0.5 rounded-full">
              {rol}
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
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activo ? 'bg-green-dark/10 text-green-dark' : 'text-zinc-700 hover:bg-black/5'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-black/10">
        <button
          onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
