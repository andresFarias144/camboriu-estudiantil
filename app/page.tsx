import { FinalCTA } from '../components/public/FinalCTA'
import { FAQSection } from '../components/public/FAQSection'
import { AboutSection } from '../components/public/AboutSection'
import { HeroVideoGrid } from '../components/public/HeroVideoGrid'
import { createClient } from '../lib/supabase/server'
import { PublicNavbar } from '../components/public/PublicNavbar'
import { PublicFooter } from '../components/public/PublicFooter'
import { EventsSection } from '../components/public/EventsSection'
import { PartnersSection } from '../components/public/PartnersSection'
import { ClientsTabsSection } from '../components/public/ClientsTabsSection'
import { DownloadsSection } from '../components/public/DownloadsSection'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: allAttractions }, { data: clients }] = await Promise.all([
    supabase.from('attractions').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('clients').select('*').eq('is_active', true).order('country').order('name'),
  ])

  const attractions = allAttractions || []

  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar overlay />

<HeroVideoGrid />
<AboutSection />

      <EventsSection attractions={attractions} />
      <PartnersSection />

      <ClientsTabsSection clients={clients || []} />
      <DownloadsSection />

<FAQSection />

      <FinalCTA />

      <PublicFooter />
    </div>
  )
}
