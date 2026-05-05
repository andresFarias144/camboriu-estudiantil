import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'
import { WhatsAppFab } from '../../components/public/WhatsAppFab'
import { ContactForm } from '../../components/public/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactoPage() {
  return (
    <div style={{ background: '#080c0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PublicNavbar />

      <section style={{ padding: '60px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#3df070', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Contacto</div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 60px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.95, margin: 0 }}>
              Tu próxima<br />temporada<br />
              <span style={{ color: '#3df070' }}>empieza acá</span>
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginTop: '20px', lineHeight: 1.6, maxWidth: '480px' }}>
              Contanos sobre tu grupo y te armamos una propuesta personalizada en menos de 24 horas.
            </p>

            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ContactItem icon={<Phone size={18} />} label="Teléfono" value="+55 47 99281 6769" href="tel:+5547992816769" />
              <ContactItem icon={<Mail size={18} />} label="Email" value="info@camboriuestudiantil.com" href="mailto:info@camboriuestudiantil.com" />
              <ContactItem icon={<MapPin size={18} />} label="Ubicación" value="Balneário Camboriú, SC, Brasil" />
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(61,240,112,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3df070', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{value}</div>
      </div>
    </>
  )

  return href ? (
    <a href={href} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>{content}</a>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{content}</div>
  )
}
