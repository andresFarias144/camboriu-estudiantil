'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const supabase = createClient()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    agency: '',
    country: '',
    interest: '',
    passengers: '',
    message: '',
  })

  function buildWhatsappUrl(data: typeof form) {
    const lines = [
      'Hola! Envié una consulta desde la web de Camboriú Estudiantil.',
      '',
      `Nombre: ${data.name}`,
      `Email: ${data.email}`,
      data.agency ? `Agencia/Colegio: ${data.agency}` : null,
      data.country ? `País: ${data.country}` : null,
      data.interest ? `Interés: ${data.interest}` : null,
      data.passengers ? `Pasajeros: ${data.passengers}` : null,
      data.message ? `Mensaje: ${data.message}` : null,
    ].filter(Boolean)

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
  }

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
      setLastWhatsappUrl(buildWhatsappUrl(form))
      setSuccess(true)
      setForm({ name: '', email: '', agency: '', country: '', interest: '', passengers: '', message: '' })
    }
  }

  if (success) {
    return (
      <div className="bg-brand-green/[0.08] border border-brand-green/30 rounded-xl p-8 sm:p-10 text-center">
        <CheckCircle2 size={48} className="text-brand-green mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-brand-green mb-2">¡Consulta enviada!</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          Recibimos tu consulta. Te respondemos en menos de 24 horas.
        </p>
        {lastWhatsappUrl && (
          <a
            href={lastWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-5 !py-3 !px-5 !text-xs no-underline"
          >
            Enviar también por WhatsApp
          </a>
        )}
        <button
          onClick={() => {
            setSuccess(false)
            setLastWhatsappUrl(null)
          }}
          className="btn-secondary mt-3 !py-2.5 !px-5 !text-xs"
        >
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-6 sm:p-7">
      <div className="flex flex-col gap-3">
        <input
          className="input-base"
          required
          placeholder="Nombre y apellido *"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          className="input-base"
          required
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          className="input-base"
          placeholder="Agencia / Colegio"
          value={form.agency}
          onChange={(e) => setForm((f) => ({ ...f, agency: e.target.value }))}
        />
        <select
          className="input-base"
          value={form.country}
          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
        >
          <option value="">País...</option>
          <option value="Argentina">🇦🇷 Argentina</option>
          <option value="Uruguay">🇺🇾 Uruguay</option>
          <option value="Chile">🇨🇱 Chile</option>
          <option value="Paraguay">🇵🇾 Paraguay</option>
          <option value="Bolivia">🇧🇴 Bolivia</option>
          <option value="Perú">🇵🇪 Perú</option>
        </select>
        <input
          className="input-base"
          placeholder="Destino o atracción de interés"
          value={form.interest}
          onChange={(e) => setForm((f) => ({ ...f, interest: e.target.value }))}
        />
        <input
          className="input-base"
          type="number"
          placeholder="Cantidad de pasajeros"
          value={form.passengers}
          onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))}
        />
        <textarea
          className="input-base resize-y"
          rows={4}
          placeholder="Mensaje (opcional)"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-2 !py-3.5 disabled:opacity-70 disabled:cursor-not-allowed">
          {loading && <Loader2 size={14} className="animate-spin" />}
          Enviar consulta
        </button>

        <p className="text-[11px] text-white/35 text-center mt-1">
          Te respondemos en menos de 24 horas.
        </p>
      </div>
    </form>
  )
}
