'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash2, MapPin, Loader2 } from 'lucide-react'
import type { Attraction, AttractionCategory, AttractionType } from '../../lib/types'

interface AttractionFormProps {
  attraction?: Attraction
}

export function AttractionForm({ attraction }: AttractionFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = Boolean(attraction)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: attraction?.title ?? '',
    title_pt: attraction?.title_pt ?? '',
    subtitle: attraction?.subtitle ?? '',
    subtitle_pt: attraction?.subtitle_pt ?? '',
    slug: attraction?.slug ?? '',
    category: attraction?.category ?? ('dia' as AttractionCategory),
    type: attraction?.type ?? ('paseo' as AttractionType),
    badge: attraction?.badge ?? '',
    description: attraction?.description ?? '',
    description_pt: attraction?.description_pt ?? '',
    address: attraction?.address ?? '',
    lat: attraction?.lat ?? '',
    lng: attraction?.lng ?? '',
    consultation_cta: attraction?.consultation_cta ?? 'Consultar disponibilidad',
    whatsapp_msg: attraction?.whatsapp_msg ?? '',
    video_url: attraction?.video_url ?? '',
    season: attraction?.season?.join(', ') ?? '',
    is_active: attraction?.is_active ?? true,
    is_featured: attraction?.is_featured ?? false,
    sort_order: attraction?.sort_order ?? 0,
  })

  const [mainImage, setMainImage] = useState(attraction?.main_image ?? '')
  const [gallery, setGallery] = useState<string[]>(attraction?.gallery ?? [])

  function handleTitleChange(value: string) {
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setForm((f) => ({ ...f, title: value, slug: isEdit ? f.slug : slug }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      badge: form.badge || null,
      lat: form.lat ? parseFloat(String(form.lat)) : null,
      lng: form.lng ? parseFloat(String(form.lng)) : null,
      sort_order: parseInt(String(form.sort_order)),
      season: form.season.split(',').map((s) => s.trim()).filter(Boolean),
      main_image: mainImage || null,
      gallery,
    }

    const { error } = isEdit
      ? await supabase.from('attractions').update(payload).eq('id', attraction!.id)
      : await supabase.from('attractions').insert(payload)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/atracciones')
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Título (ES)</label>
              <input style={inputStyle} required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Green Valley" />
            </div>
            <div>
              <label style={labelStyle}>Título (PT)</label>
              <input style={inputStyle} value={form.title_pt} onChange={(e) => setForm((f) => ({ ...f, title_pt: e.target.value }))} placeholder="Green Valley" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Subtítulo (ES)</label>
              <input style={inputStyle} value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Diversión, agua y naturaleza" />
            </div>
            <div>
              <label style={labelStyle}>Subtítulo (PT)</label>
              <input style={inputStyle} value={form.subtitle_pt} onChange={(e) => setForm((f) => ({ ...f, subtitle_pt: e.target.value }))} placeholder="Diversão, água e natureza" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input style={inputStyle} required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="green-valley" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={inputStyle} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as AttractionCategory }))}>
                <option value="dia">Día</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select style={inputStyle} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AttractionType }))}>
                <option value="paseo">Paseo</option>
                <option value="discoteca">Discoteca</option>
                <option value="parque_acuatico">Parque acuático</option>
                <option value="parque_tematico">Parque temático</option>
                <option value="playa">Playa VIP</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select style={inputStyle} value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}>
                <option value="">Sin badge</option>
                <option value="exclusivo">Exclusivo</option>
                <option value="nuevo">Nuevo</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Descripción (ES)</label>
              <textarea style={{ ...inputStyle, height: '110px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Descripción (PT)</label>
              <textarea style={{ ...inputStyle, height: '110px', resize: 'vertical' }} value={form.description_pt} onChange={(e) => setForm((f) => ({ ...f, description_pt: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Dirección</label>
            <input style={inputStyle} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Latitud</label>
              <input style={inputStyle} type="number" step="any" value={form.lat} onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))} placeholder="-26.9919" />
            </div>
            <div>
              <label style={labelStyle}>Longitud</label>
              <input style={inputStyle} type="number" step="any" value={form.lng} onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))} placeholder="-48.6345" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Texto botón consulta</label>
              <input style={inputStyle} value={form.consultation_cta} onChange={(e) => setForm((f) => ({ ...f, consultation_cta: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Mensaje WhatsApp</label>
              <input style={inputStyle} value={form.whatsapp_msg} onChange={(e) => setForm((f) => ({ ...f, whatsapp_msg: e.target.value }))} placeholder="Hola! Consulto por..." />
            </div>
          </div>

          <div>
            <label style={labelStyle}>URL de video (YouTube/Vimeo)</label>
            <input style={inputStyle} value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Temporadas (separadas por coma)</label>
              <input style={inputStyle} value={form.season} onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))} placeholder="2024, 2025" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
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
              <div style={{ flex: 1 }}>
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
            </div>
            <div>
              <label style={labelStyle}>Orden</label>
              <input style={inputStyle} type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Imagen principal</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ folder: 'camboriu/attractions', maxFiles: 1, resourceType: 'image' }}
              onSuccess={(result: any) => setMainImage(result.info.secure_url)}
            >
              {({ open }) => (
                <div>
                  {mainImage ? (
                    <div style={{ position: 'relative' }}>
                      <img src={mainImage} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
                      <button type="button" onClick={() => setMainImage('')} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#fff' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => open()} style={{ height: '180px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      <ImagePlus size={24} />
                      Subir imagen principal
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          <div>
            <label style={labelStyle}>Galería ({gallery.length})</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
options={{ 
  folder: 'camboriu/attractions', 
  multiple: true, 
  maxFiles: 50,
  sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
  resourceType: 'image',
  clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  maxFileSize: 10000000
}}              onSuccess={(result: any) => setGallery((g) => [...g, result.info.secure_url])}
            >
              {({ open }) => (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    {gallery.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
                        <button type="button" onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '4px 6px', cursor: 'pointer', color: '#fff' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => open()} style={{ width: '100%', padding: '8px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <ImagePlus size={13} /> Agregar fotos
                  </button>
                </div>
              )}
            </CldUploadWidget>
          </div>

          {form.lat && form.lng && (
            <div>
              <label style={labelStyle}>Vista en mapa</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`https://waze.com/ul?ll=${form.lat},${form.lng}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <MapPin size={12} /> Waze
                </a>
                <a href={`https://maps.google.com/?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <MapPin size={12} /> Google Maps
                </a>
              </div>
            </div>
          )}
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
          {isEdit ? 'Guardar cambios' : 'Crear atracción'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', padding: '12px 20px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', fontSize: '14px', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
