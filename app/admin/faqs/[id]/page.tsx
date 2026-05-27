import { notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { FAQForm } from '../../../../components/admin/FAQForm'

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: faq, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !faq) {
    notFound()
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Editar pregunta</h1>
        <p className="text-sm text-white/45 mt-1">{faq.question}</p>
      </div>
      <FAQForm faq={faq} />
    </div>
  )
}
