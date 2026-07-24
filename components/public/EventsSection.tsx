'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Category = 'dia' | 'tarde' | 'noche'

const categoryBackgrounds: Record<Category, string> = {
  dia: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/image/DIA_mtta1g.png',
  tarde: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/image/TARDE_ps6xcn.png',
  noche: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/image/NOCHE_zfrmyh.png',
}

export function EventsSection({ attractions }: { attractions: any[] }) {
  const [activeTab, setActiveTab] = useState<Category>('dia')

  const filtered = attractions.filter((a) => a.category === activeTab)

  const counts = {
    dia: attractions.filter((a) => a.category === 'dia').length,
    tarde: attractions.filter((a) => a.category === 'tarde').length,
    noche: attractions.filter((a) => a.category === 'noche').length,
  }

  return (
    <section id="eventos" className="relative overflow-hidden py-16 sm:py-20 scroll-mt-28">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${categoryBackgrounds[activeTab]})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#080c0a]/72" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c0a] via-transparent to-[#080c0a]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c0a]/88 via-[#080c0a]/48 to-[#080c0a]/78" aria-hidden="true" />

      <div className="container-page relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <div>
            <div className="eyebrow mb-2">Eventos</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
              Nuestros eventos<br />y <span className="text-brand-green">experiencias</span>
            </h2>
          </div>
          <Link
            href="/destinos"
            className="text-sm text-brand-green hover:text-brand-green/80 inline-flex items-center gap-1.5 no-underline"
          >
            Ver todos los destinos <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tabs DÍA / TARDE / NOCHE */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          <TabButton label="Día" count={counts.dia} active={activeTab === 'dia'} onClick={() => setActiveTab('dia')} color="green" />
          <TabButton label="Tarde" count={counts.tarde} active={activeTab === 'tarde'} onClick={() => setActiveTab('tarde')} color="green" />
          <TabButton label="Noche" count={counts.noche} active={activeTab === 'noche'} onClick={() => setActiveTab('noche')} color="magenta" />
        </div>

        {/* Grid de atracciones */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/40 text-sm border border-dashed border-white/10 rounded-xl">
            Próximamente más experiencias en esta categoría
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <DestinationCard key={a.id} attraction={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TabButton({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  color: 'green' | 'magenta'
}) {
  const activeClass = color === 'magenta' ? 'bg-brand-magenta text-white' : 'bg-brand-green text-[#080c0a]'
  const countActiveClass = color === 'magenta' ? 'bg-black/15 text-white' : 'bg-black/15 text-[#080c0a]'

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
        active
          ? activeClass
          : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full ${
          active ? countActiveClass : 'bg-white/10 text-white/50'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function DestinationCard({ attraction: a }: { attraction: any }) {
  const badgeStyles: Record<string, string> = {
    exclusivo: 'bg-brand-magenta text-white',
    nuevo: 'bg-white/15 text-white border border-white/30',
    popular: 'bg-brand-green text-[#080c0a]',
  }

  const variant = a.category === 'noche' ? 'night' : a.category === 'tarde' ? 'sunset' : 'day'
  const fallbackGradient =
    variant === 'night'
      ? '#1a0820 0%, #2a1030 50%, #3a1840'
      : variant === 'sunset'
      ? '#2a1208 0%, #3a1810 50%, #4a2818'
      : '#041208 0%, #0a2a18 50%, #0d3a20'

  return (
    <Link
      href={`/destinos/${a.slug}`}
      className="relative rounded-xl overflow-hidden border border-white/10 h-64 sm:h-72 flex flex-col justify-start no-underline group hover:border-brand-green/40 transition-colors"
      style={{
        backgroundImage: a.main_image
          ? `linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 70%), url(${a.main_image})`
          : `linear-gradient(135deg, ${fallbackGradient} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 p-4 sm:p-5">
        {a.badge && (
          <span
            className={`inline-block text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded mb-2 ${badgeStyles[a.badge]}`}
          >
            {a.badge}
          </span>
        )}
        <div className="text-xl sm:text-2xl font-light leading-tight text-white">
          {a.title}
        </div>
        {a.subtitle && (
          <div className="text-xs sm:text-sm text-brand-green mt-1 font-medium">
            {a.subtitle}
          </div>
        )}
        <div className="text-xs text-white/60 mt-1 capitalize">
          {a.type.replace('_', ' ')}
        </div>
      </div>
    </Link>
  )
}
