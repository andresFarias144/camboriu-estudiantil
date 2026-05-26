import { MessageCircle } from 'lucide-react'

export function FinalCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
  const whatsappMsg = encodeURIComponent('Hola! Consulto sobre Camboriu Estudiantil.')

  return (
    <section id="contacto" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(230,30,140,0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container-page relative z-10 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6">
          ¿Listo para vivir<br />
          <span className="text-brand-magenta">la experiencia?</span>
        </h2>

        <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10">
          Si sos una agencia o querés armar el viaje de tus egresados, escribinos.
        </p>

        <div className="flex justify-center">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe5b] text-white font-bold rounded-full px-7 py-3.5 text-sm transition-colors no-underline"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
