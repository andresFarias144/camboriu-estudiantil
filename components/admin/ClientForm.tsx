'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash2, Loader2 } from 'lucide-react'
import type { Client, ClientCountry } from '../../lib/types'

interface ClientFormProps {
  client?: Client
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = Boolean(client)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: client?.name ?? '',
    slug: client?.slug ?? '',
    country: client?.country ?? ('argentina' as ClientCountry),
    city: client?.city ?? '',
    website: client?.website ?? '',
    instagram: client?.instagram ?? '',
    facebook: client?.facebook ?? '',
    whatsapp: client?.whatsapp ?? '',
    since_year: client?.since_year ?? '',
    is_active: client?.is_active ?? true,
    is_featured: client?.is_featured ?? false,
    sort_order: client?.sort_order ?? 0,
  })

  const [logoUrl, setLogoUrl] = useState(client?.logo_url ?? '')

  function handleNameChange(value: string) {
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setForm((f) => ({ ...f, name: value, slug: isEdit ? f.slug : slug }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      since_year: form.since_year ? parseInt(String(form.since_year)) : null,
      sort_order: parseInt(String(form.sort_order)),
      logo_url: logoUrl || null,
    }

    const { error } = isEdit
      ? await supabase.from('clients').update(payload).eq('id', client!.id)
      : await supabase.from('clients').insert(payload)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/clientes')
      router.refresh()
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Nombre de la agencia</label>
              <input style={inputStyle} required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Travel Rock" />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input style={inputStyle} required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="travel-rock" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px' }}>
            <div>
              <label style={labelStyle}>País</label>
              <select style={inputStyle} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value as ClientCountry }))}>
                <option value="argentina">🇦🇷 Argentina</option>
                <option value="uruguay">🇺🇾 Uruguay</option>
                <option value="chile">🇨🇱 Chile</option>
                <option value="paraguay">🇵🇾 Paraguay</option>
                <option value="bolivia">🇧🇴 Bolivia</option>
                <option value="peru">🇵🇪 Perú</option>
                <option value="brasil">🇧🇷 Brasil</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ciudad</label>
              <input style={inputStyle} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Buenos Aires" />
            </div>
            <div>
              <label style={labelStyle}>Desde año</label>
              <input style={inputStyle} type="number" value={form.since_year} onChange={(e) => setForm((f) => ({ ...f, since_year: e.target.value }))} placeholder="2018" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Sitio web</label>
            <input style={inputStyle} type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://travelrock.com.ar" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input style={inputStyle} value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} placeholder="@travelrock" />
            </div>
            <div>
              <label style={labelStyle}>Facebook</label>
              <input style={inputStyle} value={form.facebook} onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))} placeholder="https://facebook.com/..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>WhatsApp (uso interno - no público)</label>
            <input style={inputStyle} value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="5491112345678" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Activa</label>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                {[true, false].map((v) => (
                  <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                    <input type="radio" checked={form.is_active === v} onChange={() => setForm((f) => ({ ...f, is_active: v }))} />
                    {v ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Destacada</label>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                {[true, false].map((v) => (
                  <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                    <input type="radio" checked={form.is_featured === v} onChange={() => setForm((f) => ({ ...f, is_featured: v }))} />
                    {v ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Orden</label>
              <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Logo de la agencia</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ folder: 'camboriu/clients', maxFiles: 1, resourceType: 'image' }}
            onSuccess={(result: any) => setLogoUrl(result.info.secure_url)}
          >
            {({ open }) => (
              <div>
                {logoUrl ? (
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '100%', height: '160px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                      <img src={logoUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <button type="button" onClick={() => setLogoUrl('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#fff' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => open()} style={{ height: '160px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                    <ImagePlus size={24} />
                    Subir logo
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>PNG con fondo transparente recomendado</span>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(230,30,60,0.1)', border: '0.5px solid rgba(230,30,60,0.3)', borderRadius: '8px', fontSize: '13px', color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button type="submit" disabled={loading} style={{ background: '#3df070', color: '#080c0a', padding: '12px 28px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
          {loading && <Loader2 size={14} />}
          {isEdit ? 'Guardar cambios' : 'Crear agencia'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', padding: '12px 20px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', fontSize: '14px', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
