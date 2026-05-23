'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'

type Category = 'todos' | 'dia' | 'tarde' | 'noche'

export default function DestinosPage() {
  const [attractions, setAttractions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Category>('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('attractions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setAttractions(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = activeTab === 'todos'
    ? attractions
    : attractions.filter((a) => a.category === activeTab)

  const counts = {
    todos: attractions.length,
    dia: attractions.filter((a) => a.category === 'dia').length,
    tarde: attractions.filter((a) => a.category === 'tarde').length,
    noche: attractions.filter((a) => a.category === 'noche').length,
  }

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      {/* Header */}
      <section className="container-page py-10 sm:py-14">
        <div className="eyebrow mb-2">Destinos</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Todas las <span className="text-brand-green">experiencias</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 mt-4 max-w-2xl">
          Descubrí todas las atracciones disponibles en Camboriú, desde los clubes nocturnos exclusivos hasta los parques temáticos más grandes de Latinoamérica.
        </p>
      </section>

      {/* Tabs */}
      <section className="container-page pb-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <TabButton label="Todos" count={counts.todos} active={activeTab === 'todos'} onClick={() => setActiveTab('todos')} />
          <TabButton label="Día" count={counts.dia} active={activeTab === 'dia'} onClick={() => setActiveTab('dia')} />
          <TabButton label="Tarde" count={counts.tarde} active={activeTab === 'tarde'} onClick={() => setActiveTab('tarde')} />
          <TabButton label="Noche" count={counts.noche} active={activeTab === 'noche'} onClick={() => setActiveTab('noche')} />
        </div>
      </section>

      {/* Grid de atracciones */}
      <section className="container-page pb-16 sm:pb-20">
        {loading ? (
          <div className="text-center py-20 text-white/40 text-sm">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40 text-sm border border-dashed border-white/10 rounded-xl">
            No hay atracciones en esta categoría aún
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <AttractionCard key={a.id} attraction={a} />
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  )
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-brand-green text-[#080c0a]'
          : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full ${
          active ? 'bg-black/15 text-[#080c0a]' : 'bg-white/10 text-white/50'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function AttractionCard({ attraction: a }: { attraction: any }) {
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
      className="relative rounded-xl overflow-hidden border border-white/10 h-72 sm:h-80 flex flex-col justify-start no-underline group hover:border-brand-green/40 transition-colors"
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
