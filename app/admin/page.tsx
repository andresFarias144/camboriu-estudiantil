import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { getAnalyticsOverview } from '../../lib/googleAnalytics'
import {
  MapPin,
  Users,
  MessageSquare,
  Plus,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Eye,
  MousePointerClick,
  Globe2,
} from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: attractionsCount },
    { count: clientsCount },
    { count: faqsCount },
    { count: requestsCount },
    { count: newRequestsCount },
    analytics,
  ] = await Promise.all([
    supabase.from('attractions').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }),
    supabase.from('contact_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    getAnalyticsOverview(),
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
        <StatCard
          icon={<HelpCircle size={18} />}
          label="Preguntas frecuentes"
          value={faqsCount ?? 0}
          href="/admin/faqs"
          color="green"
        />
      </div>

      <AnalyticsSection analytics={analytics} />

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

          <Link
            href="/admin/faqs/nueva"
            className="flex items-center gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-lg no-underline transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Plus size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Nueva pregunta</div>
              <div className="text-xs text-white/45">Cargar FAQ del home</div>
            </div>
            <ArrowRight size={14} className="text-white/30" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function AnalyticsSection({ analytics }: { analytics: Awaited<ReturnType<typeof getAnalyticsOverview>> }) {
  return (
    <section className="card-base p-5 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2 text-brand-green mb-1">
            <BarChart3 size={17} />
            <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase">
              Google Analytics
            </h2>
          </div>
          <p className="text-sm text-white/50">Actividad del sitio durante los últimos 30 días.</p>
        </div>
        {analytics.status === 'ready' && (
          <span className="w-fit text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded bg-brand-green/10 text-brand-green">
            Datos actualizados
          </span>
        )}
      </div>

      {analytics.status === 'missing_config' ? (
        <AnalyticsNotice
          title="Falta conectar la lectura de Analytics"
          description="El seguimiento ya está activo. Para mostrar los informes aquí, agregá el ID numérico de la propiedad y una cuenta de servicio de Google en las variables de Vercel."
        />
      ) : analytics.status === 'error' ? (
        <AnalyticsNotice
          title="No pudimos consultar Google Analytics"
          description="Revisá que la cuenta de servicio tenga permiso de lectura en la propiedad GA4 y que las tres variables estén correctamente configuradas."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <AnalyticsMetric icon={<Users size={17} />} label="Usuarios" value={analytics.activeUsers} />
            <AnalyticsMetric
              icon={<MousePointerClick size={17} />}
              label="Sesiones"
              value={analytics.sessions}
            />
            <AnalyticsMetric icon={<Eye size={17} />} label="Páginas vistas" value={analytics.pageViews} />
            <AnalyticsMetric
              icon={<MessageSquare size={17} />}
              label="Contactos"
              value={analytics.contacts}
              accent
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnalyticsList title="Páginas más vistas" rows={analytics.topPages} />
            <AnalyticsList title="Países con más usuarios" rows={analytics.topCountries} icon={<Globe2 size={15} />} />
          </div>
        </>
      )}
    </section>
  )
}

function AnalyticsNotice({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-brand-green/20 bg-brand-green/[0.05] p-4">
      <div className="text-sm font-medium text-white mb-1">{title}</div>
      <p className="text-xs sm:text-sm leading-relaxed text-white/50 max-w-3xl">{description}</p>
    </div>
  )
}

function AnalyticsMetric({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 min-w-0">
      <div className={`mb-3 ${accent ? 'text-brand-magenta' : 'text-brand-green'}`}>{icon}</div>
      <div className="text-2xl sm:text-3xl font-semibold">{value.toLocaleString('es-AR')}</div>
      <div className="text-xs text-white/45 mt-1">{label}</div>
    </div>
  )
}

function AnalyticsList({
  title,
  rows,
  icon,
}: {
  title: string
  rows: Array<{ label: string; value: number }>
  icon?: React.ReactNode
}) {
  const maximum = Math.max(...rows.map((row) => row.value), 1)

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <h3 className="flex items-center gap-2 text-xs font-semibold text-white/65 mb-4">
        {icon}
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-xs text-white/35">Todavía no hay datos suficientes.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between gap-4 text-xs mb-1.5">
                <span className="text-white/65 truncate" title={row.label}>{row.label}</span>
                <span className="font-medium text-white/80 tabular-nums">{row.value.toLocaleString('es-AR')}</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-green/70"
                  style={{ width: `${Math.max((row.value / maximum) * 100, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
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
