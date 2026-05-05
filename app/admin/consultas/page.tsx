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
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Consultas</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
          {requests?.length ?? 0} consultas recibidas desde el sitio
        </p>
      </div>

      {!requests || requests.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', border: '0.5px dashed rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
          Aún no hay consultas. Cuando alguien complete el formulario del sitio, va a aparecer acá.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {requests.map((r) => (
            <ConsultaCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsultaCard({ request: r }: { request: ContactRequest }) {
  const statusColors = {
    new: { bg: 'rgba(61,240,112,0.1)', color: '#3df070', label: 'Nueva' },
    contacted: { bg: 'rgba(255,180,0,0.1)', color: '#ffb400', label: 'Contactado' },
    closed: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', label: 'Cerrada' },
  }
  const status = statusColors[r.status]
  const date = new Date(r.created_at).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>{r.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            {r.email} {r.agency && `· ${r.agency}`} {r.country && `· ${r.country}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '4px', background: status.bg, color: status.color, fontWeight: 600 }}>
            {status.label}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{date}</span>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
        {r.interest && <span><strong style={{ color: 'rgba(255,255,255,0.5)' }}>Interés:</strong> {r.interest}</span>}
        {r.passengers && <span> · <strong style={{ color: 'rgba(255,255,255,0.5)' }}>Pasajeros:</strong> {r.passengers}</span>}
        {r.message && <p style={{ marginTop: '8px' }}>{r.message}</p>}
      </div>
    </div>
  )
}
