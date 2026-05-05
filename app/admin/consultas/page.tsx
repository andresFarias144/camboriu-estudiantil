import { createClient } from '../../../lib/supabase/server'
import type { ContactRequest } from '../../../lib/types'

export default async function ConsultasPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-semibold">Consultas</h1>
        <p className="text-sm text-white/45 mt-1">
          {requests?.length ?? 0} consultas recibidas desde el sitio
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-lg text-white/30 text-sm">
          Aún no hay consultas. Cuando alguien complete el formulario del sitio, va a aparecer acá.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {requests.map((r) => (
            <ConsultaCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsultaCard({ request: r }: { request: ContactRequest }) {
  const statusStyles = {
    new: 'bg-brand-green/10 text-brand-green',
    contacted: 'bg-yellow-500/10 text-yellow-400',
    closed: 'bg-white/8 text-white/50',
  }
  const statusLabels = {
    new: 'Nueva',
    contacted: 'Contactado',
    closed: 'Cerrada',
  }

  const date = new Date(r.created_at).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="card-base p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium mb-0.5">{r.name}</div>
          <div className="text-xs text-white/50 break-words">
            {r.email} {r.agency && <>· {r.agency}</>} {r.country && <>· {r.country}</>}
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className={`text-[11px] px-2.5 py-1 rounded font-semibold ${statusStyles[r.status]}`}>
            {statusLabels[r.status]}
          </span>
          <span className="text-[11px] text-white/35">{date}</span>
        </div>
      </div>
      <div className="text-sm text-white/70 leading-relaxed">
        {r.interest && (
          <span>
            <strong className="text-white/50">Interés:</strong> {r.interest}
          </span>
        )}
        {r.passengers && (
          <span>
            {' · '}
            <strong className="text-white/50">Pasajeros:</strong> {r.passengers}
          </span>
        )}
        {r.message && <p className="mt-2">{r.message}</p>}
      </div>
    </div>
  )
}
