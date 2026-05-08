import { createClient } from '../../../lib/supabase/server'
import { PublicNavbar } from '../../../components/public/PublicNavbar'
import { PublicFooter } from '../../../components/public/PublicFooter'
import { WhatsAppFab } from '../../../components/public/WhatsAppFab'
import { Gallery } from '../../../components/public/Gallery'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'

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

  // Auto-convert YouTube/Vimeo URL to embed
  let embedUrl = a.video_url
  if (a.video_url) {
    const ytMatch = a.video_url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
    const vimeoMatch = a.video_url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

 {/* HERO */}
<section
  className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end pt-20 pb-8 sm:pt-24 sm:pb-10"
  style={{
    backgroundImage: a.main_image
      ? `linear-gradient(to right, rgba(8,12,10,0.85) 0%, rgba(8,12,10,0.4) 35%, transparent 60%), url(${a.main_image})`
      : 'linear-gradient(135deg, #041208 0%, #0a2a18 50%, #0d3a20 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="container-page">
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-3">
        <Link
          href="/destinos"
          className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white no-underline transition-colors"
        >
          <ArrowLeft size={14} /> Volver a destinos
        </Link>

        {a.badge && (
          <span
            className={`inline-block text-[11px] font-bold tracking-wider uppercase px-2 py-1 rounded ${
              a.badge === 'exclusivo'
                ? 'bg-brand-magenta text-white'
                : a.badge === 'popular'
                ? 'bg-brand-green text-[#080c0a]'
                : 'bg-white text-[#080c0a]'
            }`}
          >
            {a.badge}
          </span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mt-2">
        {a.title}
      </h1>

      {a.subtitle && (
        <p className="text-base sm:text-lg text-brand-green mt-2">
          {a.subtitle}
        </p>
      )}

      <p className="text-xs sm:text-sm text-white/70 uppercase tracking-widest mt-3">
        {a.category === 'noche' ? 'Noche' : 'Día'} · <span className="capitalize">{a.type.replace('_', ' ')}</span>
      </p>
    </div>
  </div>
</section>

      {/* CONTENT */}
      <section className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8 lg:gap-12 items-start">
          {/* Main content */}
          <div>
            {a.description && (
              <p className="text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-wrap">
                {a.description}
              </p>
            )}

            {embedUrl && (
              <div className="mt-8 rounded-xl overflow-hidden aspect-video">
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {a.gallery && a.gallery.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase text-brand-green mb-4">
                  Galería
                </h2>
                <Gallery images={a.gallery} alt={a.title} />
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="card-base p-5 sm:p-6 lg:sticky lg:top-24">
            <h3 className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/50 mb-4">
              Información
            </h3>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full !py-3.5 mb-3"
            >
              {a.consultation_cta || 'Consultar disponibilidad'}
            </a>

            {a.address && (
              <div className="py-5 border-t border-white/10">
                <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-brand-green mb-3.5">
                  Ubicación
                </div>

                {/* Card visual de ubicación */}
                <div className="bg-brand-green/[0.05] border border-brand-green/20 rounded-xl px-5 py-6 text-center mb-3">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-green/[0.12] flex items-center justify-center">
                    <MapPin size={24} className="text-brand-green" fill="#3df070" strokeWidth={1.5} />
                  </div>
                  <div className="text-sm text-white/85 leading-relaxed">{a.address}</div>
                </div>

                {a.lat && a.lng && (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://waze.com/ul?ll=${a.lat},${a.lng}&navigate=yes`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2.5 px-3 text-center text-xs font-medium text-white/80 no-underline flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation size={13} /> Waze
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${a.lat},${a.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2.5 px-3 text-center text-xs font-medium text-white/80 no-underline flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation size={13} /> Maps
                    </a>
                  </div>
                )}
              </div>
            )}

            {a.season && a.season.length > 0 && (
              <div className="py-5 border-t border-white/10">
                <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-white/40 mb-1.5">
                  Temporadas
                </div>
                <div className="text-sm text-white/70">{a.season.join(', ')}</div>
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
