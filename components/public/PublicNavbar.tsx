'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,12,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em' }}>
            CAMBORI<span style={{ color: '#3df070' }}>U</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <small style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Estudiantil</small>
            <span style={{ fontSize: '10px', background: '#3df070', color: '#080c0a', padding: '2px 7px', borderRadius: '3px', fontWeight: 800, letterSpacing: '0.05em', marginTop: '2px', display: 'inline-block' }}>× GREENVALLEY</span>
          </div>
        </Link>

        <div className="desktop-nav" style={{ display: 'flex', gap: '28px' }}>
          <Link href="/destinos" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Destinos</Link>
          <Link href="/clientes" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Agencias</Link>
          <Link href="/contacto" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Contacto</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '5px' }}>
            <span style={{ color: '#3df070', fontWeight: 600 }}>ES</span> | PT
          </div>
          <Link href="/contacto" style={{ background: '#3df070', color: '#080c0a', fontSize: '13px', fontWeight: 700, padding: '10px 22px', borderRadius: '7px', textDecoration: 'none' }}>
            Cotizar viaje
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-toggle"
            style={{ display: 'none', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ background: '#080c0a', borderBottom: '0.5px solid rgba(255,255,255,0.1)', padding: '16px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/destinos" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 0' }}>Destinos</Link>
            <Link href="/clientes" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 0' }}>Agencias</Link>
            <Link href="/contacto" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '8px 0' }}>Contacto</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  )
}
