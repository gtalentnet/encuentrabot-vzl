'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/',         label: 'Inicio' },
  { href: '/personas', label: 'Personas' },
  { href: '/acopio',   label: 'Centros de Acopio' },
  { href: '/alertas',  label: 'Alertas' },
  { href: '/reportar', label: 'Reportar' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('sticky top-0 z-40 bg-white border-b border-black/10 header-glass', scrolled && 'scrolled')}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center min-h-0">
          <Image
            src="/logo.png"
            alt="Levanta Venezuela"
            width={180}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-0',
                link.label === 'Reportar'
                  ? 'bg-[#FF6600] text-white hover:bg-orange-700 pulse-orange'
                  : 'text-black/70 hover:text-black hover:bg-black/5 nav-link'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-black/5 min-h-0 min-w-[44px] justify-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-black/10 bg-white animate-fade-in">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Menú móvil">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  link.label === 'Reportar'
                    ? 'bg-[#FF6600] text-white text-center'
                    : 'text-black hover:bg-black/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
