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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Atracciones</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
            {attractions?.length ?? 0} atracciones cargadas
          </p>
        </div>
        <Link
          href="/admin/atracciones/nueva"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#3df070',
            color: '#080c0a',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}
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
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {title}
        </h2>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', padding: '1px 8px', borderRadius: '20px', color: 'rgba(255,255,255,0.4)' }}>
          {count}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((attraction) => (
          <AttractionRow key={attraction.id} attraction={attraction} />
        ))}
        {items.length === 0 && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', padding: '20px', textAlign: 'center', border: '0.5px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            No hay atracciones en esta categoría
          </p>
        )}
      </div>
    </div>
  )
}

function AttractionRow({ attraction: a }: { attraction: Attraction }) {
  const badgeColors: Record<string, string> = {
    exclusivo: '#e61e8c',
    nuevo: 'rgba(255,255,255,0.3)',
    popular: '#3df070',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '8px',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.08)',
          backgroundImage: a.main_image ? `url(${a.main_image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{a.title}</span>
          {a.badge && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '3px',
                background: badgeColors[a.badge] + '22',
                color: badgeColors[a.badge],
                border: `0.5px solid ${badgeColors[a.badge]}44`,
              }}
            >
              {a.badge}
            </span>
          )}
          {a.is_featured && <Star size={12} color="#3df070" fill="#3df070" />}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
          {a.type.replace('_', ' ')} · Orden: {a.sort_order}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        {a.is_active ? (
          <>
            <Eye size={13} color="#3df070" />
            <span style={{ color: '#3df070' }}>Activa</span>
          </>
        ) : (
          <>
            <EyeOff size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Oculta</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Link
          href={`/admin/atracciones/${a.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            background: 'rgba(255,255,255,0.06)',
            border: '0.5px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)',
            textDecoration: 'none',
          }}
        >
          <Pencil size={13} /> Editar
        </Link>
        <DeleteAttractionButton id={a.id} title={a.title} />
      </div>
    </div>
  )
}
