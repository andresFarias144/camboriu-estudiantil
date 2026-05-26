'use client'

import { ExternalLink } from 'lucide-react'

const partners = [
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502141/cascata-pool_en1n26.mp4',
    label: 'Cascata',
    title: 'Cascata Carolina',
    link: 'https://cascatacarolina.com.br/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502139/quintal47_xcugcs.mp4',
    label: 'Espacio & Bar',
    title: 'Quintal 47',
    link: 'https://www.instagram.com/quintal47bc',
    linkLabel: 'Ver en Instagram',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502140/greenvalley_uorklx.mp4',
    label: 'Club',
    title: 'Greenvalley',
    link: 'https://www.greenvalleybr.com/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502137/music-park_gmy0nf.mp4',
    label: 'Música & Shows',
    title: 'Music Park',
    link: 'https://www.instagram.com/musicparkbc/',
    linkLabel: 'Ver en Instagram',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502138/camp_h6t8fh.mp4',
    label: 'Aventura',
    title: 'Parque Acuático',
    link: 'https://www.parqueaquaticozacarias.com.br/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779502140/portunhol_vxkese.mp4',
    label: 'Quinta · Comida',
    title: 'Portunhol',
    link: '',
    linkLabel: '',
  },
]

interface Partner {
  src: string
  label: string
  title: string
  link: string
  linkLabel: string
}

export function PartnersSection() {
  return (
    <section id="partners" className="py-16 sm:py-20 overflow-hidden scroll-mt-28">
      <div className="container-page mb-8 sm:mb-12 text-center">
        <div className="eyebrow inline-flex justify-center mb-3">Partners</div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Nuestros <span className="text-brand-magenta">destinos y aliados</span>
        </h2>
        <p className="text-sm sm:text-base text-white/50 mt-4">
          Tocá cada experiencia para descubrir más
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 px-2 sm:px-4">
        {partners.map((p, i) => (
          <PartnerCard key={i} partner={p} />
        ))}
      </div>
    </section>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  const cardInner = (
    <div className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
      <video
        src={partner.src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      <div className="absolute inset-0 bg-brand-magenta/0 group-hover:bg-brand-magenta/20 transition-colors duration-300" />

      <div className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">
          {partner.label}
        </div>
        <div className="text-sm sm:text-base font-semibold leading-tight text-white mb-2">
          {partner.title}
        </div>
        {partner.link && (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-white/70 group-hover:text-brand-green transition-colors">
            <span>{partner.linkLabel}</span>
            <ExternalLink size={10} />
          </div>
        )}
      </div>
    </div>
  )

  if (partner.link) {
    return (
      <a href={partner.link} target="_blank" rel="noreferrer" className="no-underline">
        {cardInner}
      </a>
    )
  }

  return <div>{cardInner}</div>
}
