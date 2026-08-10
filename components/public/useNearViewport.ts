'use client'

import { RefObject, useEffect, useState } from 'react'

export function useNearViewport<T extends Element>(
  ref: RefObject<T>,
  rootMargin = '600px'
) {
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, rootMargin])

  return isNearViewport
}
