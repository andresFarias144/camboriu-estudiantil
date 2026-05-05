'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 glass-dark border-b border-white/10">
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 text-white no-underline">
            <div className="text-lg md:text-xl font-extrabold tracking-wider">
              CAMBORI<span className="text-brand-green">U</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <small className="text-[9px] text-white/40 tracking-widest uppercase">Estudiantil</small>
              <span className="text-[10px] bg-brand-green text-[#080c0a] px-1.5 py-0.5 rounded font-extrabold tracking-wider mt-0.5">
                × GREENVALLEY
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex gap-8">
            <Link href="/destinos" className="text-sm text-white/60 hover:text-white transition-colors no-underline">Destinos</Link>
            <Link href="/clientes" className="text-sm text-white/60 hover:text-white transition-colors no-underline">Agencias</Link>
            <Link href="/contacto" className="text-sm text-white/60 hover:text-white transition-colors no-underline">Contacto</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block text-xs text-white/50 border border-white/10 px-2.5 py-1 rounded">
              <span className="text-brand-green font-semibold">ES</span> | PT
            </div>
            <Link href="/contacto" className="hidden md:inline-flex btn-primary !py-2 !px-4 !text-xs">
              Cotizar
            </Link>
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
            <Link
              href="/destinos"
              onClick={() => setMobileOpen(false)}
              className="text-base text-white/80 py-3 px-2 hover:bg-white/5 rounded-lg no-underline"
            >
              Destinos
            </Link>
            <Link
              href="/clientes"
              onClick={() => setMobileOpen(false)}
              className="text-base text-white/80 py-3 px-2 hover:bg-white/5 rounded-lg no-underline"
            >
              Agencias
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="text-base text-white/80 py-3 px-2 hover:bg-white/5 rounded-lg no-underline"
            >
              Contacto
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2"
            >
              Cotizar viaje
            </Link>
            <div className="text-xs text-white/40 text-center pt-3 mt-2 border-t border-white/10">
              <span className="text-brand-green font-semibold">ES</span> | PT
            </div>
          </div>
        </div>
      )}
    </>
  )
}
