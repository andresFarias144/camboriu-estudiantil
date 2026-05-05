'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { LayoutDashboard, MapPin, Users, LogOut, ChevronRight, MessageSquare } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/atracciones', label: 'Atracciones', icon: MapPin },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/consultas', label: 'Consultas', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Si estamos en login, no mostrar el layout con sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(255,255,255,0.03)', borderRight: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
            CAMBORIU <span style={{ color: '#3df070' }}>ADMIN</span>
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Panel de administración</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '2px', textDecoration: 'none', background: active ? 'rgba(61,240,112,0.1)' : 'transparent', color: active ? '#3df070' : 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: active ? 500 : 400 }}>
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}