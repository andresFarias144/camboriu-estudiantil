'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COUNTRY_LABELS, type Client, type ClientCountry } from '../../lib/types'

const countryOrder: ClientCountry[] = ['argentina', 'uruguay', 'chile', 'paraguay', 'bolivia', 'peru', 'brasil']
const backgroundVideo = 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502204/background_lwsrar.mp4'

// Reemplazar estos valores por URLs de Cloudinary cuando estén disponibles.
const countryFlagImages: Partial<Record<ClientCountry, string>> = {}

export function ClientsTabsSection({ clients }: { clients: Client[] }) {
  const grouped = useMemo(() => {
    const byCountry: Partial<Record<ClientCountry, Client[]>> = {}

    for (const client of clients) {
      if (!byCountry[client.country]) byCountry[client.country] = []
      byCountry[client.country]?.push(client)
    }

    return byCountry
  }, [clients])

  const countries = countryOrder.filter((country) => (grouped[country]?.length || 0) > 0)
  const [activeCountry, setActiveCountry] = useState<ClientCountry>(countries[0] || 'argentina')
  const activeClients = grouped[activeCountry] || []
  const countriesCount = countries.length

  if (clients.length === 0) return null

  return (
    <section className="relative overflow-hidden border-t border-white/10 py-16 sm:py-20">
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-72"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#080c0a]/54" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,12,10,0.78)_0%,rgba(8,12,10,0.60)_34%,rgba(8,12,10,0.24)_62%,transparent_82%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c0a]/94 via-[#080c0a]/28 to-[#080c0a]/90" aria-hidden="true" />

      <div className="container-page relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="eyebrow justify-center mb-2 inline-flex">Nuestras agencias</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-2">
            +{clients.length} agencias en <span className="text-brand-green">{countriesCount} países</span>
          </h2>
          <p className="text-sm sm:text-base text-white/50 mb-8">
            Las mejores agencias de turismo estudiantil confían en nosotros temporada tras temporada.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {countries.map((country) => (
            <CountryTab
              key={country}
              country={country}
              count={grouped[country]?.length || 0}
              active={activeCountry === country}
              onClick={() => setActiveCountry(country)}
            />
          ))}
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,92px)] justify-center gap-2.5 sm:grid-cols-[repeat(auto-fit,118px)] lg:grid-cols-[repeat(auto-fit,150px)]">
          {activeClients.map((client) => (
            <ClientLogoCard key={client.id} client={client} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/clientes" className="text-sm text-brand-green inline-flex items-center gap-1.5 no-underline hover:text-brand-green/80">
            Ver todas las agencias <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CountryTab({
  country,
  count,
  active,
  onClick,
}: {
  country: ClientCountry
  count: number
  active: boolean
  onClick: () => void
}) {
  const label = COUNTRY_LABELS[country]
  const flagImage = countryFlagImages[country]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-brand-green bg-brand-green text-[#080c0a]'
          : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
      }`}
    >
      {flagImage ? (
        <img src={flagImage} alt="" className="h-5 w-5 rounded-full object-cover" />
      ) : (
        <span className="text-base leading-none">{label.flag}</span>
      )}
      {label.es}
      <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? 'bg-black/15 text-[#080c0a]' : 'bg-white/10 text-white/50'}`}>
        {count}
      </span>
    </button>
  )
}

function ClientLogoCard({ client }: { client: Client }) {
  const rawHref = client.website || client.instagram
  const href = rawHref
    ? rawHref.startsWith('http')
      ? rawHref
      : `https://${rawHref.replace(/^@/, 'instagram.com/')}`
    : null
  const card = (
    <div className="h-[92px] w-[92px] rounded-md border border-white/10 bg-white/[0.04] p-1.5 flex items-center justify-center transition-colors hover:border-brand-green/35 sm:h-[118px] sm:w-[118px] lg:h-[150px] lg:w-[150px]">
      {client.logo_url ? (
        <div className="h-full w-full rounded bg-white p-2.5 flex items-center justify-center">
          <img src={client.logo_url} alt={client.name} className="h-full w-full object-contain" />
        </div>
      ) : (
        <span className="text-xs text-white/55 text-center leading-snug">{client.name}</span>
      )}
    </div>
  )

  if (!href) {
    return card
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir sitio de ${client.name}`}
      className="no-underline transition-transform hover:scale-[1.03]"
    >
      {card}
    </a>
  )
}
