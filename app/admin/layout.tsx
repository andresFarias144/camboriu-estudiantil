'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import {
  LayoutDashboard,
  MapPin,
  Users,
  LogOut,
  ChevronRight,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Login no usa el layout con sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#080c0a] text-white flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-white/10 sticky top-0 z-40 glass-dark">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-wider">
            CAMBORIU <span className="text-brand-green">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-icon"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 lg:w-56 z-50
          bg-white/[0.03] border-r border-white/10
          flex flex-col py-6 transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-5 pb-5 border-b border-white/10">
          <div className="text-base font-bold tracking-wider">
            CAMBORIU <span className="text-brand-green">ADMIN</span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">Panel de administración</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 no-underline text-sm transition-colors
                  ${
                    active
                      ? 'bg-brand-green/10 text-brand-green font-medium'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={12} />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 sm:p-7 lg:p-9 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
