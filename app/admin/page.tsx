import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { MapPin, Users, MessageSquare, Plus, ArrowRight } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: attractionsCount }, { count: clientsCount }, { count: requestsCount }, { count: newRequestsCount }] = await Promise.all([
    supabase.from('attractions').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/45 mt-1">
          Bienvenido al panel de administración de Camboriu Estudiantil.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard
          icon={<MapPin size={18} />}
          label="Atracciones"
          value={attractionsCount ?? 0}
          href="/admin/atracciones"
          color="green"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Agencias"
          value={clientsCount ?? 0}
          href="/admin/clientes"
          color="green"
        />
        <StatCard
          icon={<MessageSquare size={18} />}
          label="Consultas"
          value={requestsCount ?? 0}
          badge={newRequestsCount && newRequestsCount > 0 ? `${newRequestsCount} nuevas` : undefined}
          href="/admin/consultas"
          color="magenta"
        />
      </div>

      {/* Quick actions */}
      <div className="card-base p-5 sm:p-6">
        <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/50 mb-4">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/atracciones/nueva"
            className="flex items-center gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-lg no-underline transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Plus size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nueva atracción</div>
              <div className="text-xs text-white/45">Cargar destino día o noche</div>
            </div>
            <ArrowRight size={14} className="text-white/30" />
          </Link>

          <Link
            href="/admin/clientes/nuevo"
            className="flex items-center gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-lg no-underline transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Plus size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nueva agencia</div>
              <div className="text-xs text-white/45">Cargar cliente</div>
            </div>
            <ArrowRight size={14} className="text-white/30" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  href,
  badge,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  href: string
  badge?: string
  color: 'green' | 'magenta'
}) {
  const colorClasses = {
    green: 'bg-brand-green/10 text-brand-green',
    magenta: 'bg-brand-magenta/10 text-brand-magenta',
  }

  return (
    <Link
      href={href}
      className="card-base p-5 hover:border-white/20 transition-colors no-underline group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-brand-magenta/15 text-brand-magenta">
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </Link>
  )
}
