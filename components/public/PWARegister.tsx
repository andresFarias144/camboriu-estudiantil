'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const isSupportedOrigin =
      window.location.protocol === 'https:' || window.location.hostname === 'localhost'

    if (!isSupportedOrigin) return

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // La PWA sigue funcionando aunque el registro falle.
    })
  }, [])

  return null
}
