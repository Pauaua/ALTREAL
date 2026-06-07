'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/proyectos', label: 'Proyectos' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-black/70">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <Image
              src="/logo.png"
              alt="ALT Logo"
              width={32}
              height={32}
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          <span className="font-display font-700 text-sm tracking-tight">
            Asamblea{' '}
            <span className="text-green-light">Las Torres</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm font-medium transition-colors hover:text-off-white ${
                pathname === link.href
                  ? 'text-off-white active'
                  : 'text-off-white/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn-primary text-sm py-2 px-5">
            Contacto
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span
            className={`block w-6 h-0.5 bg-off-white transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-off-white transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-off-white transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-display text-3xl font-bold transition-colors ${
                pathname === link.href ? 'text-green-light' : 'text-off-white/80 hover:text-off-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-lg"
          >
            Contacto
          </Link>
        </div>
      )}
    </header>
  )
}
