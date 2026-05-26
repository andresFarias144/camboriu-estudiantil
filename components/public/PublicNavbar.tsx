'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const logoUrl = 'https://res.cloudinary.com/dea2a4o1z/image/upload/v1779534472/camboriu-gv_rrdiec.svg'
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  'Hola! Quiero hablar con Camboriú Estudiantil.'
)}`

const navItems = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#eventos', label: 'Atracciones' },
  { href: '/#partners', label: 'Partners' },
  { href: '/#agencias', label: 'Agencias' },
  { href: '/#descargas', label: 'Descargas' },
  { href: '/#contacto', label: 'Contacto' },
]

export function PublicNavbar({ overlay = false }: { overlay?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navClass = overlay
    ? 'absolute top-0 inset-x-0 z-50'
    : 'sticky top-0 z-50 glass-dark border-b border-white/10'

  return (
    <>
      <nav className={navClass}>
        {overlay && (
          <div
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080c0a]/95 via-[#080c0a]/72 via-[42%] to-transparent pointer-events-none"
            aria-hidden="true"
          />
        )}

        <div className="container-page relative z-10 flex items-center justify-between h-20 pt-2 md:h-24 md:pt-3">
          {/* Logo */}
          <Link href="/" className="flex items-center text-white no-underline">
            <img
              src={logoUrl}
              alt="Camboriú Estudiantil Greenvalley"
              className="h-12 w-auto sm:h-14 md:h-[5.5rem]"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs xl:text-sm text-white/75 hover:text-white transition-colors no-underline"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block text-xs text-white/50 border border-white/10 px-2.5 py-1 rounded">
              <span className="text-brand-green font-semibold">ES</span> | PT
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex btn-primary !py-2 !px-4 !text-xs"
            >
              Hablemos
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden btn-icon"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#080c0a] border-b border-white/10 animate-slide-up">
          <div className="container-page py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base text-white/80 py-3 px-2 hover:bg-white/5 rounded-lg no-underline"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2"
            >
              Hablemos
            </a>
            <div className="text-xs text-white/40 text-center pt-3 mt-2 border-t border-white/10">
              <span className="text-brand-green font-semibold">ES</span> | PT
            </div>
          </div>
        </div>
      )}
    </>
  )
}
