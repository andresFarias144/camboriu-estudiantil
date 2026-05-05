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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Clientes</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            {clients?.length ?? 0} agencias en {Object.keys(groupedByCountry).length} países
          </p>
        </div>
        <Link href="/admin/clientes/nuevo" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3df070', color: '#080c0a', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          <Plus size={16} /> Nueva agencia
        </Link>
      </div>

      {Object.entries(groupedByCountry).map(([country, items]) => (
        <CountrySection key={country} country={country as ClientCountry} items={items} />
      ))}

      {clients?.length === 0 && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', padding: '40px', textAlign: 'center', border: '0.5px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          Aún no hay agencias cargadas. Hacé click en "Nueva agencia" para empezar.
        </p>
      )}
    </div>
  )
}

function CountrySection({ country, items }: { country: ClientCountry; items: Client[] }) {
  const label = COUNTRY_LABELS[country]
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '20px' }}>{label.flag}</span>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {label.es}
        </h2>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '1px 8px', borderRadius: '20px', color: 'rgba(255,255,255,0.4)' }}>
          {items.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((c) => (
          <ClientRow key={c.id} client={c} />
        ))}
      </div>
    </div>
  )
}

function ClientRow({ client: c }: { client: Client }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 16px' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '8px',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.08)',
          backgroundImage: c.logo_url ? `url(${c.logo_url})` : undefined,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{c.name}</span>
          {c.is_featured && <Star size={12} color="#3df070" fill="#3df070" />}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {c.city && <span>{c.city}</span>}
          {c.since_year && <span>· Desde {c.since_year}</span>}
          {c.website && (
            <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ExternalLink size={11} /> Sitio
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        {c.is_active ? (
          <>
            <Eye size={13} color="#3df070" />
            <span style={{ color: '#3df070' }}>Activa</span>
          </>
        ) : (
          <>
            <EyeOff size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Oculta</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href={`/admin/clientes/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
          <Pencil size={13} /> Editar
        </Link>
        <DeleteClientButton id={c.id} name={c.name} />
      </div>
    </div>
  )
}
