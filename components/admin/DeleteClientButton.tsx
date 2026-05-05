'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    const { error } = await supabase.from('clients').delete().eq('id', id)
    setLoading(false)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Eliminar
    </button>
  )
}
