import { createClient } from '../../../lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff, Star } from 'lucide-react'
import type { Attraction } from '../../../lib/types'
import { DeleteAttractionButton } from '../../../components/admin/DeleteAttractionButton'

export default async function AtraccionesPage() {
  const supabase = await createClient()

  const { data: attractions, error } = await supabase
    .from('attractions')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error

  const dia = attractions?.filter((a) => a.category === 'dia') ?? []
  const noche = attractions?.filter((a) => a.category === 'noche') ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-7">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Atracciones</h1>
          <p className="text-sm text-white/45 mt-1">
            {attractions?.length ?? 0} atracciones cargadas
          </p>
        </div>
        <Link
          href="/admin/atracciones/nueva"
          className="btn-primary !text-sm self-start sm:self-auto"
        >
          <Plus size={16} /> Nueva atracción
        </Link>
      </div>

      <Section title="Día" count={dia.length} items={dia} />
      <Section title="Noche" count={noche.length} items={noche} />
    </div>
  )
}

function Section({ title, count, items }: { title: string; count: number; items: Attraction[] }) {
  return (
    <div className="mb-9">
      <div className="flex items-center gap-2.5 mb-3.5">
        <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-white/50">{title}</h2>
        <span className="text-[11px] bg-white/8 px-2 py-0.5 rounded-full text-white/40">{count}</span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((attraction) => (
          <AttractionRow key={attraction.id} attraction={attraction} />
        ))}
        {items.length === 0 && (
          <p className="text-sm text-white/30 p-5 text-center border border-dashed border-white/10 rounded-lg">
            No hay atracciones en esta categoría
          </p>
        )}
      </div>
    </div>
  )
}

function AttractionRow({ attraction: a }: { attraction: Attraction }) {
  const badgeStyles: Record<string, string> = {
    exclusivo: 'bg-brand-magenta/15 text-brand-magenta border border-brand-magenta/30',
    nuevo: 'bg-white/10 text-white/80 border border-white/20',
    popular: 'bg-brand-green/15 text-brand-green border border-brand-green/30',
  }

  return (
    <div className="card-base p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Top row: image + info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-lg flex-shrink-0 bg-white/8 bg-cover bg-center"
          style={{
            width: '52px',
            height: '52px',
            backgroundImage: a.main_image ? `url(${a.main_image})` : undefined,
          }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-medium truncate">{a.title}</span>
            {a.badge && (
              <span className={`text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${badgeStyles[a.badge]}`}>
                {a.badge}
              </span>
            )}
            {a.is_featured && <Star size={12} className="text-brand-green fill-brand-green flex-shrink-0" />}
          </div>
          <div className="text-xs text-white/40 capitalize">
            {a.type.replace('_', ' ')} · Orden: {a.sort_order}
          </div>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs">
          {a.is_active ? (
            <>
              <Eye size={13} className="text-brand-green" />
              <span className="text-brand-green">Activa</span>
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
            href={`/admin/atracciones/${a.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 no-underline transition-colors"
          >
            <Pencil size={12} /> Editar
          </Link>
          <DeleteAttractionButton id={a.id} title={a.title} />
        </div>
      </div>
    </div>
  )
}
