import { createClient } from '../../../../lib/supabase/server'
import { AttractionForm } from '../../../../components/admin/AttractionForm'
import { notFound } from 'next/navigation'

export default async function EditAttractionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: attraction, error } = await supabase
    .from('attractions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !attraction) {
    notFound()
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Editar atracción</h1>
        <p className="text-sm text-white/45 mt-1">{attraction.title}</p>
      </div>
      <AttractionForm attraction={attraction} />
    </div>
  )
}
