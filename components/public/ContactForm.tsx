'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    agency: '',
    country: '',
    interest: '',
    passengers: '',
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('contact_requests').insert({
      ...form,
      passengers: form.passengers ? parseInt(form.passengers) : null,
      source: 'website',
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setForm({ name: '', email: '', agency: '', country: '', interest: '', passengers: '', message: '' })
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  if (success) {
    return (
      <div style={{ background: 'rgba(61,240,112,0.08)', border: '0.5px solid rgba(61,240,112,0.3)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="#3df070" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3df070', marginBottom: '8px' }}>¡Consulta enviada!</h3>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
          Recibimos tu consulta. Te respondemos en menos de 24 horas.
        </p>
        <button onClick={() => setSuccess(false)} style={{ marginTop: '20px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '28px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input style={inputStyle} required placeholder="Nombre y apellido *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <input style={inputStyle} required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <input style={inputStyle} placeholder="Agencia / Colegio" value={form.agency} onChange={(e) => setForm((f) => ({ ...f, agency: e.target.value }))} />
        <select style={inputStyle} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}>
          <option value="">País...</option>
          <option value="Argentina">🇦🇷 Argentina</option>
          <option value="Uruguay">🇺🇾 Uruguay</option>
          <option value="Chile">🇨🇱 Chile</option>
          <option value="Paraguay">🇵🇾 Paraguay</option>
          <option value="Bolivia">🇧🇴 Bolivia</option>
          <option value="Perú">🇵🇪 Perú</option>
        </select>
        <input style={inputStyle} placeholder="Destino o atracción de interés" value={form.interest} onChange={(e) => setForm((f) => ({ ...f, interest: e.target.value }))} />
        <input style={inputStyle} type="number" placeholder="Cantidad de pasajeros" value={form.passengers} onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))} />
        <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} placeholder="Mensaje (opcional)" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(230,30,60,0.1)', border: '0.5px solid rgba(230,30,60,0.3)', borderRadius: '7px', fontSize: '13px', color: '#ff8080' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ background: '#3df070', color: '#080c0a', padding: '14px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
          {loading && <Loader2 size={14} />}
          Enviar consulta
        </button>

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '4px' }}>
          Te respondemos en menos de 24 horas.
        </p>
      </div>
    </form>
  )
}
