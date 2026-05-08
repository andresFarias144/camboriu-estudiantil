import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'
import { WhatsAppFab } from '../../components/public/WhatsAppFab'
import { ContactForm } from '../../components/public/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      <section className="container-page py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Texto */}
          <div>
            <div className="eyebrow mb-2">Contacto</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
              Tu próxima<br />temporada<br />
              <span className="text-brand-green">empieza acá</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 mt-5 leading-relaxed max-w-md">
              Contanos sobre tu grupo y te armamos una propuesta personalizada en menos de 24 horas.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <ContactItem
                icon={<Phone size={18} />}
                label="Teléfono"
                value="+55 47 99281 6769"
                href="tel:+5547992816769"
              />
              <ContactItem
                icon={<Mail size={18} />}
                label="Email"
                value="info@camboriuestudiantil.com"
                href="mailto:info@camboriuestudiantil.com"
              />
              <ContactItem
                icon={<MapPin size={18} />}
                label="Ubicación"
                value="Balneário Camboriú, SC, Brasil"
              />
            </div>
          </div>

          {/* Formulario */}
          <ContactForm />
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <>
      <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-white/40 tracking-wider uppercase mb-0.5">{label}</div>
        <div className="text-sm sm:text-base text-white break-all">{value}</div>
      </div>
    </>
  )

  return href ? (
    <a
      href={href}
      className="flex items-center gap-3 no-underline text-inherit hover:opacity-80 transition-opacity"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3">{content}</div>
  )
}
