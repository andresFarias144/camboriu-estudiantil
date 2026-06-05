import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { TrackedWhatsAppLink } from './TrackedWhatsAppLink'

export function AgenciesCTA() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
  const whatsappMsg = encodeURIComponent('Hola! Soy de una agencia y quiero conocer la propuesta de Camboriú Estudiantil.')

  return (
    <section className="relative overflow-hidden border-t border-white/10 py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_40%,rgba(61,240,112,0.12)_0%,transparent_52%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_20%,rgba(230,30,140,0.14)_0%,transparent_48%)]" aria-hidden="true" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 lg:gap-12 items-center">
          <div>
            <div className="eyebrow mb-3">Sumá tu agencia</div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight">
              Armemos juntos<br />
              tu próxima <span className="text-brand-green">temporada</span>
            </h2>
            <p className="text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl mt-5">
              Si trabajás con turismo estudiantil, te presentamos nuestras experiencias, cupos y operación receptiva en Balneário Camboriú.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <TrackedWhatsAppLink
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              source="agencies_cta"
              label="Hablar por WhatsApp"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-[#1ebe5b]"
            >
              <MessageCircle size={18} />
              Hablar por WhatsApp
            </TrackedWhatsAppLink>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white no-underline transition-colors hover:bg-white/10"
            >
              Enviar consulta <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
