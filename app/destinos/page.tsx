import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'
import { WhatsAppFab } from '../../components/public/WhatsAppFab'

export const revalidate = 60

export default async function DestinosPage() {
  const supabase = await createClient()

  const { data: attractions } = await supabase
    .from('attractions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const dia = (attractions || []).filter((a) => a.category === 'dia')
  const noche = (attractions || []).filter((a) => a.category === 'noche')

  return (
    <div style={{ background: '#080c0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PublicNavbar />

      <section style={{ padding: '60px 48px 30px' }}>
        <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Destinos</div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
          Todas las <span style={{ color: '#3df070' }}>experiencias</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginTop: '14px', maxWidth: '600px' }}>
          Descubrí todas las atracciones disponibles en Camboriú, desde los clubes nocturnos exclusivos hasta los parques temáticos más grandes de Latinoamérica.
        </p>
      </section>

      <section style={{ padding: '20px 48px 60px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#3df070' }} />
          Día <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>{dia.length}</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {dia.map((a) => (
            <AttractionCard key={a.id} attraction={a} />
          ))}
        </div>
      </section>

      <section style={{ padding: '20px 48px 80px', background: 'rgba(230,30,140,0.03)', borderTop: '0.5px solid rgba(230,30,140,0.12)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '40px 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'block', width: '32px', height: '1px', background: '#e61e8c' }} />
          Noche <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '2px 8px', borderRadius: '20px' }}>{noche.length}</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {noche.map((a) => (
            <AttractionCard key={a.id} attraction={a} variant="night" />
          ))}
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function AttractionCard({ attraction: a, variant }: { attraction: any; variant?: 'day' | 'night' }) {
  const badgeColors: Record<string, { bg: string; color: string }> = {
    exclusivo: { bg: '#e61e8c', color: '#fff' },
    nuevo: { bg: 'rgba(255,255,255,0.15)', color: '#fff' },
    popular: { bg: '#3df070', color: '#080c0a' },
  }

  return (
    <Link
      href={`/destinos/${a.slug}`}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '0.5px solid rgba(255,255,255,0.1)',
        height: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        textDecoration: 'none',
        backgroundImage: a.main_image
          ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%), url(${a.main_image})`
          : `linear-gradient(135deg, ${variant === 'night' ? '#1a0820 0%, #2a1030 50%, #3a1840' : '#041208 0%, #0a2a18 50%, #0d3a20'} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, padding: '18px' }}>
        {a.badge && (
          <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', marginBottom: '8px', background: badgeColors[a.badge]?.bg, color: badgeColors[a.badge]?.color }}>
            {a.badge}
          </span>
        )}
        <div style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1, color: '#fff' }}>{a.title}</div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{a.type.replace('_', ' ')}</div>
      </div>
    </Link>
  )
}
