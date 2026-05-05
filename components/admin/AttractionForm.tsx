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
    subtitle: (attraction as any)?.subtitle ?? '',
    subtitle_pt: (attraction as any)?.subtitle_pt ?? '',
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Title bilingual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Título (ES) *</label>
              <input
                className="input-base"
                required
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Green Valley"
              />
            </div>
            <div>
              <label className="label-base">Título (PT)</label>
              <input
                className="input-base"
                value={form.title_pt}
                onChange={(e) => setForm((f) => ({ ...f, title_pt: e.target.value }))}
                placeholder="Green Valley"
              />
            </div>
          </div>

          {/* Subtitle bilingual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Subtítulo (ES)</label>
              <input
                className="input-base"
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Diversión, agua y naturaleza"
              />
            </div>
            <div>
              <label className="label-base">Subtítulo (PT)</label>
              <input
                className="input-base"
                value={form.subtitle_pt}
                onChange={(e) => setForm((f) => ({ ...f, subtitle_pt: e.target.value }))}
                placeholder="Diversão, água e natureza"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="label-base">Slug (URL)</label>
            <input
              className="input-base"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="green-valley"
            />
          </div>

          {/* Category / Type / Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label-base">Categoría</label>
              <select
                className="input-base"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as AttractionCategory }))}
              >
                <option value="dia">Día</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            <div>
              <label className="label-base">Tipo</label>
              <select
                className="input-base"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AttractionType }))}
              >
                <option value="paseo">Paseo</option>
                <option value="discoteca">Discoteca</option>
                <option value="parque_acuatico">Parque acuático</option>
                <option value="parque_tematico">Parque temático</option>
                <option value="playa">Playa VIP</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="label-base">Badge</label>
              <select
                className="input-base"
                value={form.badge}
                onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              >
                <option value="">Sin badge</option>
                <option value="exclusivo">Exclusivo</option>
                <option value="nuevo">Nuevo</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          {/* Description bilingual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Descripción (ES)</label>
              <textarea
                className="input-base resize-y min-h-[110px]"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-base">Descripción (PT)</label>
              <textarea
                className="input-base resize-y min-h-[110px]"
                value={form.description_pt}
                onChange={(e) => setForm((f) => ({ ...f, description_pt: e.target.value }))}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="label-base">Dirección</label>
            <input
              className="input-base"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>

          {/* Lat/lng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Latitud</label>
              <input
                className="input-base"
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                placeholder="-26.9919"
              />
            </div>
            <div>
              <label className="label-base">Longitud</label>
              <input
                className="input-base"
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                placeholder="-48.6345"
              />
            </div>
          </div>

          {/* CTA + WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Texto botón consulta</label>
              <input
                className="input-base"
                value={form.consultation_cta}
                onChange={(e) => setForm((f) => ({ ...f, consultation_cta: e.target.value }))}
              />
            </div>
            <div>
              <label className="label-base">Mensaje WhatsApp</label>
              <input
                className="input-base"
                value={form.whatsapp_msg}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp_msg: e.target.value }))}
                placeholder="Hola! Consulto por..."
              />
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="label-base">URL de video (YouTube/Vimeo)</label>
            <input
              className="input-base"
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Season + flags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="label-base">Temporadas</label>
              <input
                className="input-base"
                value={form.season}
                onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
                placeholder="2024, 2025"
              />
            </div>
            <div>
              <label className="label-base">Activa</label>
              <div className="flex gap-3 pt-2.5">
                {[true, false].map((v) => (
                  <label key={String(v)} className="flex items-center gap-1.5 text-sm cursor-pointer text-white/70">
                    <input
                      type="radio"
                      checked={form.is_active === v}
                      onChange={() => setForm((f) => ({ ...f, is_active: v }))}
                    />
                    {v ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label-base">Destacada</label>
              <div className="flex gap-3 pt-2.5">
                {[true, false].map((v) => (
                  <label key={String(v)} className="flex items-center gap-1.5 text-sm cursor-pointer text-white/70">
                    <input
                      type="radio"
                      checked={form.is_featured === v}
                      onChange={() => setForm((f) => ({ ...f, is_featured: v }))}
                    />
                    {v ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sort order */}
          <div className="max-w-[140px]">
            <label className="label-base">Orden</label>
            <input
              className="input-base"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        {/* Right column: images */}
        <div className="flex flex-col gap-5">
          {/* Main image */}
          <div>
            <label className="label-base">Imagen principal</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ folder: 'camboriu/attractions', maxFiles: 1, resourceType: 'image' }}
              onSuccess={(result: any) => setMainImage(result.info.secure_url)}
            >
              {({ open }) => (
                <div>
                  {mainImage ? (
                    <div className="relative">
                      <img src={mainImage} alt="" className="w-full h-44 object-cover rounded-lg block" />
                      <button
                        type="button"
                        onClick={() => setMainImage('')}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-md p-1.5 hover:bg-black/90"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full h-44 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 text-white/40 text-sm hover:border-white/40 hover:text-white/60 transition-colors"
                    >
                      <ImagePlus size={24} />
                      Subir imagen principal
                    </button>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* Gallery */}
          <div>
            <label className="label-base">Galería ({gallery.length})</label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                folder: 'camboriu/attractions',
                multiple: true,
                maxFiles: 50,
                sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
                resourceType: 'image',
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
                maxFileSize: 10000000,
              }}
              onSuccess={(result: any) => setGallery((g) => [...g, result.info.secure_url])}
            >
              {({ open }) => (
                <div>
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {gallery.map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="" className="w-full h-20 object-cover rounded-md block" />
                          <button
                            type="button"
                            onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded p-1 hover:bg-black/90"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full py-2.5 border border-dashed border-white/15 rounded-md text-white/40 text-xs hover:text-white/60 hover:border-white/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ImagePlus size={13} /> Agregar fotos
                  </button>
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* Map preview */}
          {form.lat && form.lng && (
            <div>
              <label className="label-base">Vista en mapa</label>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://waze.com/ul?ll=${form.lat},${form.lng}&navigate=yes`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2 text-center text-xs text-white/60 no-underline flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin size={12} /> Waze
                </a>
                <a
                  href={`https://maps.google.com/?q=${form.lat},${form.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-md py-2 text-center text-xs text-white/60 no-underline flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin size={12} /> Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? 'Guardar cambios' : 'Crear atracción'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
