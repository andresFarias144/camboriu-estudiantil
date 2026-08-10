'use client'

import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { useNearViewport } from './useNearViewport'

const partners = [
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/cascata-pool_en1n26.mp4',
    label: 'Cascata',
    title: 'Cascata Carolina',
    link: 'https://cascatacarolina.com.br/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/quintal47_xcugcs.mp4',
    label: 'Espacio & Bar',
    title: 'Quintal 47',
    link: 'https://www.instagram.com/quintal47bc',
    linkLabel: 'Ver en Instagram',
  },
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/greenvalley_uorklx.mp4',
    label: 'Club',
    title: 'Greenvalley',
    link: 'https://www.greenvalleybr.com/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/music-park_gmy0nf.mp4',
    label: 'Música & Shows',
    title: 'Music Park',
    link: 'https://www.instagram.com/musicparkbc/',
    linkLabel: 'Ver en Instagram',
  },
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/camp_h6t8fh.mp4',
    label: 'Aventura',
    title: 'Parque Acuático',
    link: 'https://www.parqueaquaticozacarias.com.br/',
    linkLabel: 'Visitar sitio',
  },
  {
    src: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/video/portunhol_vxkese.mp4',
    label: 'Quinta · Comida',
    title: 'Portunhol',
    link: '',
    linkLabel: '',
  },
  {
    image: 'https://pub-6c7f68bfb5034991a40b2ca5bd600cf1.r2.dev/cloudinary/image/camboriu/attractions/r5pkz1k0pjdxgxavavty.png',
    label: 'Experiencia',
    title: 'Ice Bar Experience',
    link: '/destinos/ice-bar-experience-camboriu',
    linkLabel: 'Ver atracción',
  },
]

interface Partner {
  src?: string
  image?: string
  label: string
  title: string
  link: string
  linkLabel: string
}

export function PartnersSection() {
  return (
    <section id="partners" className="py-16 sm:py-20 overflow-hidden scroll-mt-28">
      <div className="container-page mb-8 sm:mb-12 text-center">
        <div className="eyebrow inline-flex justify-center mb-3">Aliados</div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          Nuestros <span className="text-brand-magenta">aliados estratégicos</span>
        </h2>
        <p className="text-sm sm:text-base text-white/50 mt-4">
          Marcas y experiencias asociadas que potencian cada programa en Camboriú.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 px-2 sm:px-4">
        {partners.map((p, i) => (
          <PartnerCard key={i} partner={p} />
        ))}
      </div>
    </section>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldLoadMedia = useNearViewport(cardRef, '500px')
  const cardInner = (
    <div ref={cardRef} className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer">
      {partner.src ? (
        shouldLoadMedia ? (
          <video
            src={partner.src}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" aria-hidden="true" />
        )
      ) : (
        <img
          src={partner.image}
          alt=""
          width={420}
          height={746}
          className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
        />
      )}

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
