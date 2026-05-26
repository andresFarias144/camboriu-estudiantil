'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const heroVideos = [
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779501984/cascata_azzvgj.mp4',
    label: 'Naturaleza',
    title: 'Cascatas',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779501972/artista_km3pai.mp4',
    label: 'Entretenimiento',
    title: 'Shows Artísticos',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779501977/campamento_lli3iw.mov',
    label: 'Aventura',
    title: 'Campamentos',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779501980/gv_lhjd7o.mov',
    label: 'Greenvalley',
    title: 'Club nº1 del mundo',
  },
  {
    src: 'https://res.cloudinary.com/dea2a4o1z/video/upload/v1779501979/espuma_bq9qnd.mov',
    label: 'Diversión',
    title: 'Fiestas',
  },
]

const heroBackground =
  'https://res.cloudinary.com/dea2a4o1z/image/upload/v1779502549/background_jt0bng.jpg'

function getOptimizedVideoUrl(src: string) {
  return src.replace('/video/upload/', '/video/upload/q_auto:eco,w_620,vc_auto/')
}

function getMobileVideoUrl(src: string) {
  return src.replace('/video/upload/', '/video/upload/q_auto:eco,w_360,vc_auto,so_0,du_6/')
}

function getVideoPosterUrl(src: string) {
  return src
    .replace('/video/upload/', '/video/upload/so_1,w_420,q_auto:eco,f_jpg/')
    .replace(/\.(mp4|mov)$/i, '.jpg')
}

export function HeroVideoGrid() {
  const [activeMobileVideo, setActiveMobileVideo] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveMobileVideo((current) => (current + 1) % heroVideos.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section id="inicio" className="relative overflow-hidden bg-[#080c0a] scroll-mt-28">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url(${heroBackground})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c0a]/80 via-[#080c0a]/34 via-[48%] to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-y-0 left-0 w-[58%] bg-[radial-gradient(ellipse_at_34%_52%,rgba(8,12,10,0.72)_0%,rgba(8,12,10,0.56)_34%,rgba(8,12,10,0.18)_62%,transparent_82%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080c0a]/42" aria-hidden="true" />
      <div className="absolute inset-0 hero-glow mix-blend-screen opacity-30" aria-hidden="true" />

      <div className="container-page pt-32 pb-12 sm:pt-36 sm:pb-20 md:pt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-8 lg:gap-12 items-center">
          {/* COLUMNA IZQUIERDA: Texto */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-brand-green tracking-widest uppercase font-medium mb-5 bg-brand-green/10 px-3 py-1.5 rounded-full">
              <span className="block w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              Camboriú Estudiantil
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight mb-5">
              Giras de <span className="text-brand-magenta">Estudios</span><br />
              & Viajes de <br />
              <span className="text-brand-magenta">Egresados</span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              Organizamos experiencias inolvidables para estudiantes de todo Mercosur.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/destinos" className="btn-primary !rounded-full">
                Ver eventos <ArrowRight size={16} />
              </Link>
              <Link href="/contacto" className="btn-secondary !rounded-full">
                Contactanos
              </Link>
            </div>

            {/* Stats inline */}
            <div className="flex gap-4 sm:gap-6">
              <div className="bg-brand-magenta text-white rounded-2xl px-5 sm:px-7 py-3 sm:py-4">
                <div className="text-2xl sm:text-3xl font-bold leading-none">30+</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider mt-1 opacity-90">Años</div>
              </div>
              <div className="bg-brand-magenta text-white rounded-2xl px-5 sm:px-7 py-3 sm:py-4">
                <div className="text-2xl sm:text-3xl font-bold leading-none">30K+</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider mt-1 opacity-90">Estudiantes</div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Grid de videos */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Video 1 - Cascatas (alto) */}
              <VideoCard video={heroVideos[0]} index={0} activeMobileVideo={activeMobileVideo} className="row-span-2" />

              {/* Video 2 - Shows */}
              <VideoCard video={heroVideos[1]} index={1} activeMobileVideo={activeMobileVideo} />

              {/* Video 3 - Greenvalley (alto) */}
              <VideoCard video={heroVideos[3]} index={3} activeMobileVideo={activeMobileVideo} className="row-span-2" />

              {/* Video 4 - Campamentos */}
              <VideoCard video={heroVideos[2]} index={2} activeMobileVideo={activeMobileVideo} />

              {/* Video 5 - Fiestas (ancho) */}
              <VideoCard video={heroVideos[4]} index={4} activeMobileVideo={activeMobileVideo} className="col-span-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VideoCard({
  video,
  index,
  activeMobileVideo,
  className = '',
}: {
  video: { src: string; label: string; title: string }
  index: number
  activeMobileVideo: number
  className?: string
}) {
  const poster = getVideoPosterUrl(video.src)
  const isActiveMobileVideo = activeMobileVideo === index

  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      {isActiveMobileVideo && (
        <video
          key={`mobile-${video.src}`}
          src={getMobileVideoUrl(video.src)}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
      )}
      <video
        src={getOptimizedVideoUrl(video.src)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Texto */}
      <div className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4 min-h-[180px] sm:min-h-[220px]">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/80 font-medium mb-1">
          {video.label}
        </div>
        <div className="text-sm sm:text-base font-semibold leading-tight text-white">
          {video.title}
        </div>
      </div>
    </div>
  )
}
