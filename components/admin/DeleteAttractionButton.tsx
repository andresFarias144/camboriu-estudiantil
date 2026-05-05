'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export function DeleteAttractionButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    const { error } = await supabase.from('attractions').delete().eq('id', id)
    setLoading(false)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        background: 'rgba(230,30,60,0.08)',
        border: '0.5px solid rgba(230,30,60,0.25)',
        color: '#ff8080',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? <Loader2 size={13} /> : <Trash2 size={13} />}
      Eliminar
    </button>
  )
}
