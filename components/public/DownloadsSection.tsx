import Link from 'next/link'
import { ArrowRight, BadgeCheck, Star, Video } from 'lucide-react'

const downloads = [
  {
    eyebrow: 'Identidad visual',
    title: 'Logos',
    description: 'Pack completo de logos en alta resolución para uso comercial, prensa y comunicación institucional.',
    icon: BadgeCheck,
    href: 'https://drive.google.com/drive/u/0/folders/11StgAv-zqOfOY0wRzDN9aiKnFSJFLakN',
  },
  {
    eyebrow: 'Audiovisual',
    title: 'Videos promocionales',
    description: 'Reels, spots y videos de alta calidad para compartir en redes sociales, presentaciones y campañas.',
    icon: Video,
    href: 'https://drive.google.com/drive/folders/17L7-Eo9b4QYrVDUeRsLObCwzFwIXnQAd',
  },
  {
    eyebrow: 'Evento especial',
    title: 'Quinceañeras',
    description: 'Material exclusivo para fiestas de quinceañeras.',
    icon: Star,
    href: 'https://drive.google.com/drive/folders/1iYYWWZDPbiziLwVycxlr3Qf1Hlb10JAx',
  },
]

export function DownloadsSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_16%_22%,rgba(230,30,140,0.18)_0%,rgba(230,30,140,0.08)_28%,transparent_58%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c0a] via-[#150711] to-[#080c0a]" aria-hidden="true" />

      <div className="container-page relative z-10">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex rounded-full bg-brand-magenta px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white mb-4">
            Descargas
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase leading-none tracking-normal mb-5">
            Material<br />
            <span className="text-brand-magenta">descargable</span>
          </h2>
          <p className="text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl">
            Accedé a recursos gráficos, audiovisuales y piezas de difusión para campañas, presentaciones y comunicación de agencias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {downloads.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8 min-h-[260px] flex flex-col"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(230,30,140,0.14)_0%,transparent_48%)]" aria-hidden="true" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-brand-magenta/25 bg-brand-magenta/20 text-brand-magenta">
                    <Icon size={22} />
                  </div>

                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-magenta mb-2">
                    {item.eyebrow}
                  </div>
                  <h3 className="text-2xl font-extrabold uppercase leading-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-7">
                    {item.description}
                  </p>

                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-brand-magenta px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white no-underline transition-colors hover:bg-brand-magenta/85"
                  >
                    Abrir en Drive <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
