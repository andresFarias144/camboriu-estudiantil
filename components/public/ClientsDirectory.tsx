'use client'

import { useMemo, useState } from 'react'
import { COUNTRY_LABELS, type Client, type ClientCountry } from '../../lib/types'

const countryOrder: ClientCountry[] = ['argentina', 'uruguay', 'chile', 'paraguay', 'bolivia', 'peru', 'brasil']

export function ClientsDirectory({ clients }: { clients: Client[] }) {
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

  if (clients.length === 0) {
    return (
      <div className="border border-dashed border-white/10 rounded-xl p-12 text-center text-white/30 text-sm">
        Aún no hay agencias cargadas.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
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

      <div className="grid grid-cols-[repeat(auto-fit,92px)] justify-start gap-2.5 sm:grid-cols-[repeat(auto-fit,118px)] lg:grid-cols-[repeat(auto-fit,150px)]">
        {activeClients.map((client) => (
          <ClientLogoCard key={client.id} client={client} />
        ))}
      </div>
    </div>
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
      <span className="text-base leading-none">{label.flag}</span>
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
          <img
            src={client.logo_url}
            alt={client.name}
            width={150}
            height={150}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <span className="text-xs text-white/55 text-center leading-snug">{client.name}</span>
      )}
    </div>
  )

  if (!href) return card

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
