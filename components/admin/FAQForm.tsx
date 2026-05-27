'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Loader2 } from 'lucide-react'
import type { FAQ } from '../../lib/types'

interface FAQFormProps {
  faq?: FAQ
}

export function FAQForm({ faq }: FAQFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = Boolean(faq)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    sort_order: faq?.sort_order ?? 0,
    is_active: faq?.is_active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      sort_order: parseInt(String(form.sort_order)) || 0,
    }

    const { error } = isEdit
      ? await supabase.from('faqs').update(payload).eq('id', faq!.id)
      : await supabase.from('faqs').insert(payload)

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/faqs')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="flex flex-col gap-5">
        <div>
          <label className="label-base">Pregunta *</label>
          <input
            className="input-base"
            required
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            placeholder="¿Qué medidas de seguridad toman?"
          />
        </div>

        <div>
          <label className="label-base">Respuesta *</label>
          <textarea
            className="input-base min-h-[260px] resize-y"
            required
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            placeholder="Escribí la respuesta completa..."
          />
          <p className="mt-1.5 text-[11px] text-white/35">
            Podés usar saltos de línea para separar párrafos o bloques de información.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label-base">Orden</label>
            <input
              className="input-base"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div>
            <label className="label-base">Visible en la web</label>
            <div className="flex gap-3 pt-2.5">
              {[true, false].map((value) => (
                <label key={String(value)} className="flex items-center gap-1.5 text-sm cursor-pointer text-white/70">
                  <input
                    type="radio"
                    checked={form.is_active === value}
                    onChange={() => setForm((f) => ({ ...f, is_active: value }))}
                  />
                  {value ? 'Sí' : 'No'}
                </label>
              ))}
            </div>
          </div>
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
          {isEdit ? 'Guardar cambios' : 'Crear pregunta'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}
