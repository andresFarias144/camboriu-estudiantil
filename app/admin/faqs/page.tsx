import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import { DeleteFAQButton } from '../../../components/admin/DeleteFAQButton'
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react'
import type { FAQ } from '../../../lib/types'

export const revalidate = 0

export default async function AdminFAQsPage() {
  const supabase = await createClient()

  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Preguntas frecuentes</h1>
          <p className="text-sm text-white/45 mt-1">
            {faqs?.length ?? 0} preguntas cargadas para la sección FAQ.
          </p>
        </div>
        <Link href="/admin/faqs/nueva" className="btn-primary !text-sm self-start sm:self-auto">
          <Plus size={16} /> Nueva pregunta
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 p-4 text-sm text-white/75">
          No se pudo leer la tabla <span className="font-semibold text-white">faqs</span>. Si todavía no la creaste,
          ejecutá el SQL incluido en <span className="font-semibold text-white">supabase/faqs.sql</span>.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {(faqs ?? []).map((faq) => (
          <FAQRow key={faq.id} faq={faq} />
        ))}
      </div>

      {!error && faqs?.length === 0 && (
        <p className="text-sm text-white/30 p-10 text-center border border-dashed border-white/10 rounded-lg">
          Aún no hay preguntas cargadas. Hacé click en "Nueva pregunta" para empezar.
        </p>
      )}
    </div>
  )
}

function FAQRow({ faq }: { faq: FAQ }) {
  return (
    <div className="card-base p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{faq.question}</span>
          <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-white/45">
            Orden {faq.sort_order}
          </span>
        </div>
        <p className="line-clamp-2 text-xs text-white/45 leading-relaxed">
          {faq.answer}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          {faq.is_active ? (
            <>
              <Eye size={13} className="text-brand-green" />
              <span className="text-brand-green">Visible</span>
            </>
          ) : (
            <>
              <EyeOff size={13} className="text-white/30" />
              <span className="text-white/30">Oculta</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/faqs/${faq.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 no-underline transition-colors"
          >
            <Pencil size={12} /> Editar
          </Link>
          <DeleteFAQButton id={faq.id} question={faq.question} />
        </div>
      </div>
    </div>
  )
}
