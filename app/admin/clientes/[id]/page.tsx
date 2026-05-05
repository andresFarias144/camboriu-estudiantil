import { createClient } from '../../../../lib/supabase/server'
import { ClientForm } from '../../../../components/admin/ClientForm'
import { notFound } from 'next/navigation'

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Editar agencia</h1>
        <p className="text-sm text-white/45 mt-1">{client.name}</p>
      </div>
      <ClientForm client={client} />
    </div>
  )
}
