import { createClient } from '../../lib/supabase/server'
import { PublicNavbar } from '../../components/public/PublicNavbar'
import { PublicFooter } from '../../components/public/PublicFooter'
import { ClientsDirectory } from '../../components/public/ClientsDirectory'

export const revalidate = 60

export default async function ClientesPublicPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('is_active', true)
    .order('country', { ascending: true })
    .order('name', { ascending: true })

  const totalClients = clients?.length || 0
  const countriesCount = new Set((clients || []).map((client) => client.country)).size

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      {/* Header */}
      <section className="container-page py-10 sm:py-14">
        <div className="eyebrow mb-2">Nuestras agencias</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight">
          +{totalClients} agencias en <span className="text-brand-green">{countriesCount} países</span>
        </h1>
        <p className="text-base sm:text-lg text-white/50 mt-4 max-w-2xl">
          Las mejores agencias de turismo estudiantil de Latinoamérica confían en nosotros temporada tras temporada.
        </p>
      </section>

      {/* Country blocks */}
      <section className="container-page pb-16 sm:pb-20">
        <ClientsDirectory clients={clients || []} />
      </section>

      <PublicFooter />
    </div>
  )
}
