import { createClient } from '../../lib/supabase/server'
import { COUNTRY_LABELS, type Client, type ClientCountry } from '../../lib/types'
import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'
import { WhatsAppFab } from '../../components/public/WhatsAppFab'
import { ExternalLink } from 'lucide-react'

export const revalidate = 60

export default async function ClientesPublicPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('is_active', true)
    .order('country', { ascending: true })
    .order('name', { ascending: true })

  const grouped: Record<string, Client[]> = {}
  for (const c of (clients ?? [])) {
    if (!grouped[c.country]) grouped[c.country] = []
    grouped[c.country].push(c)
  }

  const totalClients = clients?.length || 0
  const countriesCount = Object.keys(grouped).length

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      {/* Header */}
      <section className="container-page py-10 sm:py-14">
        <div className="eyebrow mb-2">Nuestras agencias</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          +{totalClients} agencias en <span className="text-brand-green">{countriesCount} países</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 mt-4 max-w-2xl">
          Las mejores agencias de turismo estudiantil de Latinoamérica confían en nosotros temporada tras temporada.
        </p>
      </section>

      {/* Country blocks */}
      <section className="container-page pb-16 sm:pb-20">
        {Object.entries(grouped).map(([country, items]) => (
          <CountryBlock key={country} country={country as ClientCountry} clients={items} />
        ))}

        {totalClients === 0 && (
          <div className="border border-dashed border-white/10 rounded-xl p-12 text-center text-white/30 text-sm">
            Aún no hay agencias cargadas.
          </div>
        )}
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function CountryBlock({ country, clients }: { country: ClientCountry; clients: Client[] }) {
  const label = COUNTRY_LABELS[country]
  return (
    <div className="mb-12 last:mb-0">
      {/* Header país */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl sm:text-3xl">{label.flag}</span>
        <h2 className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-white/70">
          {label.es}
        </h2>
        <span className="bg-white/8 text-white/50 text-[11px] px-2 py-0.5 rounded-full">
          {clients.length}
        </span>
      </div>

      {/* Grid de agencias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {clients.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
      </div>
    </div>
  )
}

function ClientCard({ client: c }: { client: Client }) {
  return (
    <div className="card-base p-4 flex flex-col gap-3 hover:border-brand-green/30 transition-colors">
      {/* Logo */}
      <div
        className="h-16 sm:h-20 rounded-md flex items-center justify-center p-2"
        style={{ background: c.logo_url ? '#fff' : 'rgba(255,255,255,0.04)' }}
      >
        {c.logo_url ? (
          <img src={c.logo_url} alt={c.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-[11px] text-white/40 text-center">{c.name}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="text-sm font-medium leading-snug">{c.name}</div>
        {c.city && <div className="text-[11px] text-white/40 mt-0.5">{c.city}</div>}
        {c.since_year && (
          <div className="text-[10px] text-brand-green mt-1.5 font-semibold">Desde {c.since_year}</div>
        )}
      </div>

      {/* Website */}
      {c.website && (
        <a
          href={c.website}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-white/50 hover:text-white no-underline flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={11} /> Sitio web
        </a>
      )}
    </div>
  )
}
