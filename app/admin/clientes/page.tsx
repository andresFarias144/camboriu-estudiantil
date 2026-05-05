import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff, Star, ExternalLink } from 'lucide-react'
import { COUNTRY_LABELS, type Client, type ClientCountry } from '../../../lib/types'
import { DeleteClientButton } from '../../../components/admin/DeleteClientButton'

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('country', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error

  const groupedByCountry: Record<string, Client[]> = {}
  for (const client of (clients ?? [])) {
    if (!groupedByCountry[client.country]) groupedByCountry[client.country] = []
    groupedByCountry[client.country].push(client)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Clientes</h1>
          <p className="text-sm text-white/45 mt-1">
            {clients?.length ?? 0} agencias en {Object.keys(groupedByCountry).length} países
          </p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="btn-primary !text-sm self-start sm:self-auto"
        >
          <Plus size={16} /> Nueva agencia
        </Link>
      </div>

      {Object.entries(groupedByCountry).map(([country, items]) => (
        <CountrySection key={country} country={country as ClientCountry} items={items} />
      ))}

      {clients?.length === 0 && (
        <p className="text-sm text-white/30 p-10 text-center border border-dashed border-white/10 rounded-lg">
          Aún no hay agencias cargadas. Hacé click en "Nueva agencia" para empezar.
        </p>
      )}
    </div>
  )
}

function CountrySection({ country, items }: { country: ClientCountry; items: Client[] }) {
  const label = COUNTRY_LABELS[country]
  return (
    <div className="mb-9">
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="text-xl">{label.flag}</span>
        <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-white/50">
          {label.es}
        </h2>
        <span className="text-[11px] bg-white/8 px-2 py-0.5 rounded-full text-white/40">
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((c) => (
          <ClientRow key={c.id} client={c} />
        ))}
      </div>
    </div>
  )
}

function ClientRow({ client: c }: { client: Client }) {
  return (
    <div className="card-base p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-13 h-13 rounded-lg flex-shrink-0 bg-cover bg-center bg-no-repeat"
          style={{
            width: '52px',
            height: '52px',
            background: c.logo_url ? `#fff url(${c.logo_url}) center / contain no-repeat` : 'rgba(255,255,255,0.08)',
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium truncate">{c.name}</span>
            {c.is_featured && <Star size={12} className="text-brand-green fill-brand-green flex-shrink-0" />}
          </div>
          <div className="text-xs text-white/40 flex flex-wrap gap-1.5 items-center">
            {c.city && <span>{c.city}</span>}
            {c.since_year && <span>· Desde {c.since_year}</span>}
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="text-white/40 hover:text-white no-underline flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={11} /> Sitio
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          {c.is_active ? (
            <>
              <Eye size={13} className="text-brand-green" />
              <span className="text-brand-green">Activa</span>
            </>
          ) : (
            <>
              <EyeOff size={13} className="text-white/30" />
              <span className="text-white/30">Oculta</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/clientes/${c.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 no-underline transition-colors"
          >
            <Pencil size={12} /> Editar
          </Link>
          <DeleteClientButton id={c.id} name={c.name} />
        </div>
      </div>
    </div>
  )
}
