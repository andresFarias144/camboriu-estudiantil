import Link from 'next/link'
import { createClient } from '../lib/supabase/server'
import { PublicNavbar } from '../components/public/PublicNavbar'
import { PublicFooter } from '../components/public/PublicFooter'
import { WhatsAppFab } from '../components/public/WhatsAppFab'
import { EventsSection } from '../components/public/EventsSection'
import { ArrowRight, Star, Shield, Headphones, Sparkles } from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: allAttractions }, { data: clients }] = await Promise.all([
    supabase.from('attractions').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('clients').select('*').eq('is_active', true).order('country').order('name'),
  ])

  const attractions = allAttractions || []
  const totalClients = clients?.length || 0
  const countriesCount = new Set((clients || []).map((c) => c.country)).size

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      <section className="relative min-h-[80vh] sm:min-h-[88vh] flex items-center hero-glow overflow-hidden">
        <div className="container-page py-16 sm:py-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-brand-green tracking-widest uppercase font-medium mb-5">
              <span className="block w-2 h-2 bg-brand-green rounded-full animate-pulse" />
              Temporada 2025 · Balneário Camboriú, Brasil
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight mb-5">
              El viaje<br />
              que <span className="text-brand-green">marca</span><br />
              <span className="text-brand-magenta">una generación</span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              Experiencias únicas en Brasil con operación profesional para agencias y grupos estudiantiles. Más de 30 años siendo líderes del turismo receptivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/destinos" className="btn-primary">
                Ver destinos <ArrowRight size={16} />
              </Link>
              <Link href="/contacto" className="btn-secondary">
                Solicitar propuesta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-white/10">
        <StatBar num="+30" label="Años de experiencia" />
        <StatBar num="100k" label="Estudiantes viajados" />
        <StatBar num={`${countriesCount || 5}`} label="Países atendidos" />
        <StatBar num="24/7" label="Soporte en viaje" />
      </div>

      <EventsSection attractions={attractions} />

      <section className="container-page py-16 sm:py-20">
        <div className="eyebrow mb-2">Por qué elegirnos</div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-8">
          El aliado estratégico<br />de tu <span className="text-brand-green">temporada</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WhyCard icon={<Shield size={20} className="text-brand-green" />} title="Operación local en Brasil" desc="Equipo propio en Camboriú. Coordinación antes, durante y después del viaje." />
          <WhyCard icon={<Headphones size={20} className="text-brand-green" />} title="Soporte 24/7" desc="Acompañamiento real y permanente. Siempre disponibles cuando lo necesitás." />
          <WhyCard icon={<Sparkles size={20} className="text-brand-green" />} title="Plataforma de gestión" desc="Tecnología propia para gestionar cupos, itinerarios y reservas en tiempo real." />
          <WhyCard icon={<Star size={20} className="text-brand-green" />} title="Exclusividades únicas" desc="Acceso exclusivo a Green Valley, Eclipse, Maria's y las mejores atracciones." />
        </div>
      </section>

      {totalClients > 0 && (
        <section className="container-page py-12 sm:py-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="eyebrow justify-center mb-2 inline-flex">Nuestras agencias</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-2">
              +{totalClients} agencias en <span className="text-brand-green">{countriesCount} países</span>
            </h2>
            <p className="text-sm sm:text-base text-white/50 mb-8">
              Las mejores agencias de turismo estudiantil confían en nosotros temporada tras temporada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {(clients || []).slice(0, 16).map((c) => (
              <div key={c.id} className="w-24 h-14 sm:w-28 sm:h-16 rounded-lg border border-white/10 flex items-center justify-center p-2" style={{ background: c.logo_url ? '#fff' : 'rgba(255,255,255,0.04)' }}>
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-white/40 text-center">{c.name}</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/clientes" className="text-sm text-brand-green inline-flex items-center gap-1.5 no-underline">
              Ver todas las agencias <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      <section className="container-page py-20 sm:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(61,240,112,0.08) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight tracking-tight mb-4">
            Tu próxima temporada<br />
            <span className="text-brand-green">empieza hoy</span>
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-8">
            Solicitá tu propuesta personalizada y llevá a tus grupos a vivir la mejor experiencia en Balneário Camboriú.
          </p>
          <Link href="/contacto" className="btn-primary !py-4 !px-8 !text-base">
            Solicitar propuesta
          </Link>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppFab />
    </div>
  )
}

function StatBar({ num, label }: { num: string; label: string }) {
  return (
    <div className="px-4 py-5 sm:px-8 sm:py-6 border-r border-white/10 last:border-r-0 even:border-r-0 md:even:border-r md:last:border-r-0 text-center">
      <div className="text-2xl sm:text-4xl font-extrabold text-brand-green leading-none">{num}</div>
      <div className="text-[11px] sm:text-xs text-white/50 mt-1">{label}</div>
    </div>
  )
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card-base p-5 sm:p-6 hover:border-brand-green/30 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-brand-green/10 mb-3 flex items-center justify-center">{icon}</div>
      <div className="text-base font-medium mb-1.5">{title}</div>
      <div className="text-sm text-white/50 leading-relaxed">{desc}</div>
    </div>
  )
}