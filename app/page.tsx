import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { COUNTRY_LABELS } from '../lib/types'
import { PublicNavbar } from '../components/public/PublicNavbar'
import { PublicFooter } from '../components/public/PublicFooter'
import { WhatsAppFab } from '../components/public/WhatsAppFab'
import { ArrowRight, Star, Shield, Headphones, Sparkles } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: dayAttractions }, { data: nightAttractions }, { data: clients }] = await Promise.all([
    supabase.from('attractions').select('*').eq('category', 'dia').eq('is_active', true).order('sort_order').limit(6),
    supabase.from('attractions').select('*').eq('category', 'noche').eq('is_active', true).order('sort_order').limit(3),
    supabase.from('clients').select('*').eq('is_active', true).order('country').order('name'),
  ])

  const featuredDay = (dayAttractions || []).slice(0, 6)
  const featuredNight = (nightAttractions || []).slice(0, 3)
  const totalClients = clients?.length || 0
  const countriesCount = new Set((clients || []).map((c) => c.country)).size

  return (
    <div style={{ background: '#080c0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PublicNavbar />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', padding: '80px 48px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(61,240,112,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(230,30,140,0.10) 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, rgba(61,240,112,0.06) 0%, transparent 50%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#3df070', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '20px' }}>
            <div style={{ width: '7px', height: '7px', background: '#3df070', borderRadius: '50%' }} />
            Temporada 2025 · Balneário Camboriú, Brasil
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 7vw, 92px)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.01em', textTransform: 'uppercase', marginBottom: '22px', margin: 0 }}>
            El viaje<br />
            que <span style={{ color: '#3df070' }}>marca</span><br />
            <span style={{ color: '#e61e8c' }}>una generación</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: '22px', marginBottom: '36px', maxWidth: '500px' }}>
            Experiencias únicas en Brasil con operación profesional para agencias y grupos estudiantiles. Más de 30 años siendo líderes del turismo receptivo.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/destinos" style={{ background: '#3df070', color: '#080c0a', fontSize: '15px', fontWeight: 700, padding: '15px 30px', borderRadius: '9px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Ver destinos <ArrowRight size={16} />
            </Link>
            <Link href="/contacto" style={{ background: 'transparent', color: '#fff', fontSize: '15px', fontWeight: 500, padding: '15px 30px', borderRadius: '9px', border: '0.5px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
              Solicitar propuesta
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '0.5px solid rgba(255,255,255,0.1)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}>
        <StatBar num="+30" label="Años de experiencia" />
        <StatBar num="100k" label="Estudiantes viajados" />
        <StatBar num={`${countriesCount}`} label="Países atendidos" />
        <StatBar num="24/7" label="Soporte en viaje" />
      </div>

      {/* DESTINOS DÍA */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'block', width: '24px', height: '1px', background: '#3df070' }} />
              Destinos imperdibles
            </div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              Lo que te espera<br />en <span style={{ color: '#3df070' }}>Camboriú</span>
            </h2>
          </div>
          <Link href="/destinos" style={{ fontSize: '13px', color: '#3df070', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Ver todos los destinos <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {featuredDay.map((a) => (
            <DestinationCard key={a.id} attraction={a} />
          ))}
        </div>
      </section>

      {/* NOCHES */}
      {featuredNight.length > 0 && (
        <section style={{ padding: '80px 48px', background: 'rgba(230,30,140,0.03)', borderTop: '0.5px solid rgba(230,30,140,0.12)', borderBottom: '0.5px solid rgba(230,30,140,0.12)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '11px', color: '#e61e8c', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Las mejores noches</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 32px' }}>
            Greenvalley · <span style={{ color: '#e61e8c' }}>5 clubes,</span><br />una experiencia
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {featuredNight.map((a) => (
              <DestinationCard key={a.id} attraction={a} variant="night" />
            ))}
          </div>
        </section>
      )}

      {/* WHY US */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Por qué elegirnos</div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 36px' }}>
          El aliado estratégico<br />de tu <span style={{ color: '#3df070' }}>temporada</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          <WhyCard icon={<Shield size={20} color="#3df070" />} title="Operación local en Brasil" desc="Equipo propio en Camboriú. Coordinación antes, durante y después del viaje." />
          <WhyCard icon={<Headphones size={20} color="#3df070" />} title="Soporte 24/7" desc="Acompañamiento real y permanente. Siempre disponibles cuando lo necesitás." />
          <WhyCard icon={<Sparkles size={20} color="#3df070" />} title="Plataforma de gestión" desc="Tecnología propia para gestionar cupos, itinerarios y reservas en tiempo real." />
          <WhyCard icon={<Star size={20} color="#3df070" />} title="Exclusividades únicas" desc="Acceso exclusivo a Green Valley, Eclipse, Maria's y las mejores atracciones." />
        </div>
      </section>

      {/* CLIENTES */}
      {totalClients > 0 && (
        <section style={{ padding: '60px 48px', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>Nuestras agencias</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 8px' }}>
            +{totalClients} agencias en <span style={{ color: '#3df070' }}>{countriesCount} países</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px' }}>
            Las mejores agencias de turismo estudiantil confían en nosotros temporada tras temporada.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
            {(clients || []).slice(0, 16).map((c) => (
              <div key={c.id} style={{ width: '110px', height: '60px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.1)', background: c.logo_url ? '#fff' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '0 6px' }}>{c.name}</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/clientes" style={{ fontSize: '13px', color: '#3df070', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Ver todas las agencias <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '100px 48px' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(61,240,112,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.92 }}>
            Tu próxima temporada<br />
            <span style={{ color: '#3df070' }}>empieza hoy</span>
          </div>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: '18px auto 32px', maxWidth: '520px' }}>
            Solicitá tu propuesta personalizada y llevá a tus grupos a vivir la mejor experiencia en Balneário Camboriú.
          </p>
          <Link href="/contacto" style={{ display: 'inline-block', background: '#3df070', color: '#080c0a', fontSize: '15px', fontWeight: 700, padding: '16px 40px', borderRadius: '9px', textDecoration: 'none' }}>
            Solicitar propuesta
          </Link>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function StatBar({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ padding: '24px 32px', borderRight: '0.5px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
      <div style={{ fontSize: '36px', fontWeight: 800, color: '#3df070', lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(61,240,112,0.1)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{desc}</div>
    </div>
  )
}

function DestinationCard({ attraction: a, variant }: { attraction: any; variant?: 'day' | 'night' }) {
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
        height: '260px',
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
