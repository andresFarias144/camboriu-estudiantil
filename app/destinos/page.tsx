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
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      {/* Header */}
      <section className="container-page py-10 sm:py-14">
        <div className="eyebrow mb-2">Destinos</div>
        <h1 className="h-display">
          Todas las <span className="text-brand-green">experiencias</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 mt-4 max-w-2xl">
          Descubrí todas las atracciones disponibles en Camboriú, desde los clubes nocturnos exclusivos hasta los parques temáticos más grandes de Latinoamérica.
        </p>
      </section>

      {/* DÍA */}
      <section className="container-page pb-12 sm:pb-16">
        <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-white/50 mb-5 flex items-center gap-2.5">
          <span className="block w-8 h-px bg-brand-green" />
          Día
          <span className="bg-white/8 text-white/50 text-[11px] px-2 py-0.5 rounded-full">{dia.length}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dia.map((a) => (
            <AttractionCard key={a.id} attraction={a} />
          ))}
        </div>
      </section>

      {/* NOCHE */}
      <section className="bg-brand-magenta/[0.03] border-t border-brand-magenta/[0.12] py-12 sm:py-16">
        <div className="container-page">
          <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-white/50 mb-5 flex items-center gap-2.5">
            <span className="block w-8 h-px bg-brand-magenta" />
            Noche
            <span className="bg-white/8 text-white/50 text-[11px] px-2 py-0.5 rounded-full">{noche.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {noche.map((a) => (
              <AttractionCard key={a.id} attraction={a} variant="night" />
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function AttractionCard({ attraction: a, variant }: { attraction: any; variant?: 'day' | 'night' }) {
  const badgeStyles: Record<string, string> = {
    exclusivo: 'bg-brand-magenta text-white',
    nuevo: 'bg-white/15 text-white border border-white/30',
    popular: 'bg-brand-green text-[#080c0a]',
  }

  return (
    <Link
      href={`/destinos/${a.slug}`}
      className="relative rounded-xl overflow-hidden border border-white/10 h-72 sm:h-80 flex flex-col justify-end no-underline group hover:border-brand-green/40 transition-colors"
      style={{
        backgroundImage: a.main_image
          ? `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%), url(${a.main_image})`
          : `linear-gradient(135deg, ${variant === 'night' ? '#1a0820 0%, #2a1030 50%, #3a1840' : '#041208 0%, #0a2a18 50%, #0d3a20'} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 p-4 sm:p-5">
        {a.badge && (
          <span className={`inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded mb-2 ${badgeStyles[a.badge]}`}>
            {a.badge}
          </span>
        )}
        <div className="h-card text-white">{a.title}</div>
        {a.subtitle && (
          <div className="text-xs sm:text-sm text-brand-green mt-1.5 font-medium">{a.subtitle}</div>
        )}
        <div className="text-xs text-white/60 mt-1 capitalize">{a.type.replace('_', ' ')}</div>
      </div>
    </Link>
  )
}
