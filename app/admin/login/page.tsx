'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Verificá el email y contraseña.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080c0a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.04em', color: '#fff', marginBottom: '4px' }}>
            CAMBORIU <span style={{ color: '#3df070' }}>ADMIN</span>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Ingresá con tu cuenta de administrador</div>
        </div>

        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Email</label>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '14px', padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Contraseña</label>
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '14px', padding: '10px 14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(230,30,60,0.1)', border: '0.5px solid rgba(230,30,60,0.3)', borderRadius: '7px', fontSize: '13px', color: '#ff8080' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ background: '#3df070', color: '#080c0a', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={14} />}
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}