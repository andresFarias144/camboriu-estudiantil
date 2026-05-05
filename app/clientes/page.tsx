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
    <div style={{ background: '#080c0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PublicNavbar />

      <section style={{ padding: '60px 48px 30px' }}>
        <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Nuestras agencias</div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
          +{totalClients} agencias en <span style={{ color: '#3df070' }}>{countriesCount} países</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginTop: '14px', maxWidth: '700px' }}>
          Las mejores agencias de turismo estudiantil de Latinoamérica confían en nosotros temporada tras temporada.
        </p>
      </section>

      <section style={{ padding: '20px 48px 80px' }}>
        {Object.entries(grouped).map(([country, items]) => (
          <CountryBlock key={country} country={country as ClientCountry} clients={items} />
        ))}
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function CountryBlock({ country, clients }: { country: ClientCountry; clients: Client[] }) {
  const label = COUNTRY_LABELS[country]
  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px' }}>{label.flag}</span>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          {label.es}
        </h2>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: '20px' }}>
          {clients.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {clients.map((c) => (
          <div key={c.id} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '70px', background: c.logo_url ? '#fff' : 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{c.name}</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.name}</div>
              {c.city && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{c.city}</div>}
              {c.since_year && <div style={{ fontSize: '10px', color: '#3df070', marginTop: '4px' }}>Desde {c.since_year}</div>}
            </div>
            {c.website && (
              <a href={c.website} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExternalLink size={11} /> Sitio web
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
