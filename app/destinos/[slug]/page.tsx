import { createClient } from '../../../lib/supabase/server'
import { PublicNavbar } from '../../../components/public/PublicNavbar'
import { PublicFooter } from '../../../components/public/PublicFooter'
import { WhatsAppFab } from '../../../components/public/WhatsAppFab'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'
import { Gallery } from '../../../components/public/Gallery'


export const revalidate = 60

export default async function AttractionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: a } = await supabase
    .from('attractions')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!a) notFound()

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
  const whatsappMsg = encodeURIComponent(a.whatsapp_msg || `Hola! Consulto por ${a.title}.`)

  return (
    <div style={{ background: '#080c0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PublicNavbar />

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '80px 48px 60px',
          backgroundImage: a.main_image
            ? `linear-gradient(to top, rgba(8,12,10,1) 0%, rgba(8,12,10,0.4) 50%, rgba(8,12,10,0.6) 100%), url(${a.main_image})`
            : 'linear-gradient(135deg, #041208 0%, #0a2a18 50%, #0d3a20 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <Link href="/destinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '20px' }}>
            <ArrowLeft size={14} /> Volver a destinos
          </Link>

          {a.badge && (
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '4px', marginBottom: '14px', background: a.badge === 'exclusivo' ? '#e61e8c' : a.badge === 'popular' ? '#3df070' : 'rgba(255,255,255,0.15)', color: a.badge === 'popular' ? '#080c0a' : '#fff' }}>
              {a.badge}
            </span>
          )}

          <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>{a.title}</h1>
          {a.subtitle && (
            <p style={{ fontSize: '20px', color: '#3df070', marginTop: '12px', maxWidth: '700px', lineHeight: 1.4 }}>
              {a.subtitle}
            </p>
          )}
          <p style={{ fontSize: '14px', color: '#3df070', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px' }}>
            {a.category === 'noche' ? 'Noche' : 'Día'} · {a.type.replace('_', ' ')}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding: '60px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '48px', alignItems: 'start' }}>
          <div>
            {a.description && (
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                {a.description}
              </p>
            )}

            {a.video_url && (
              <div style={{ marginTop: '32px', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
                <iframe
                  src={a.video_url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                />
              </div>
            )}

            {a.gallery && a.gallery.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3df070', marginBottom: '14px' }}>
                  Galería
                </h2>
                <Gallery images={a.gallery} alt={a.title} />
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Información</h3>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3df070', color: '#080c0a', fontSize: '14px', fontWeight: 700, padding: '14px', borderRadius: '8px', textDecoration: 'none', marginBottom: '12px' }}
            >
              {a.consultation_cta || 'Consultar disponibilidad'}
            </a>

            {a.address && (
              <div style={{ padding: '16px 0', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Ubicación</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{a.address}</span>
                </div>

                {a.lat && a.lng && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={`https://waze.com/ul?ll=${a.lat},${a.lng}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Navigation size={12} /> Waze
                    </a>
                    <a href={`https://maps.google.com/?q=${a.lat},${a.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Navigation size={12} /> Maps
                    </a>
                  </div>
                )}
              </div>
            )}

            {a.season && a.season.length > 0 && (
              <div style={{ padding: '16px 0', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Temporadas</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{a.season.join(', ')}</div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}
