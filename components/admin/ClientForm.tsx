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

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Nombre de la agencia *</label>
              <input
                className="input-base"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Travel Rock"
              />
            </div>
            <div>
              <label className="label-base">Slug (URL) *</label>
              <input
                className="input-base"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="travel-rock"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label-base">País</label>
              <select
                className="input-base"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value as ClientCountry }))}
              >
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
              <label className="label-base">Ciudad</label>
              <input
                className="input-base"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Buenos Aires"
              />
            </div>
            <div>
              <label className="label-base">Desde año</label>
              <input
                className="input-base"
                type="number"
                value={form.since_year}
                onChange={(e) => setForm((f) => ({ ...f, since_year: e.target.value }))}
                placeholder="2018"
              />
            </div>
          </div>

          <div>
            <label className="label-base">Sitio web</label>
            <input
              className="input-base"
              type="url"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="https://travelrock.com.ar"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Instagram</label>
              <input
                className="input-base"
                value={form.instagram}
                onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                placeholder="@travelrock"
              />
            </div>
            <div>
              <label className="label-base">Facebook</label>
              <input
                className="input-base"
                value={form.facebook}
                onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))}
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div>
            <label className="label-base">WhatsApp (uso interno - no público)</label>
            <input
              className="input-base"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              placeholder="5491112345678"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
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
            <div>
              <label className="label-base">Orden</label>
              <input
                className="input-base"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>

        {/* Logo upload */}
        <div>
          <label className="label-base">Logo de la agencia</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ folder: 'camboriu/clients', maxFiles: 1, resourceType: 'image' }}
            onSuccess={(result: any) => setLogoUrl(result.info.secure_url)}
          >
            {({ open }) => (
              <div>
                {logoUrl ? (
                  <div className="relative">
                    <div className="w-full h-40 bg-white rounded-lg flex items-center justify-center p-5">
                      <img src={logoUrl} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-md p-1.5 hover:bg-black/90"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="w-full h-40 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-2 text-white/40 text-sm hover:border-white/40 hover:text-white/60 transition-colors"
                  >
                    <ImagePlus size={24} />
                    Subir logo
                    <span className="text-[11px] opacity-70">PNG con fondo transparente</span>
                  </button>
                )}
              </div>
            )}
          </CldUploadWidget>
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
          {isEdit ? 'Guardar cambios' : 'Crear agencia'}
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
