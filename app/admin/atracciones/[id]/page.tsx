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
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>
          Editar atracción
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
          {attraction.title}
        </p>
      </div>
      <AttractionForm attraction={attraction} />
    </div>
  )
}
