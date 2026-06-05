'use client'

import { useEffect } from 'react'
import { trackViewContent } from '../../lib/marketingEvents'

export function ViewContentTracker({
  contentName,
  contentCategory,
  contentType,
}: {
  contentName: string
  contentCategory?: string | null
  contentType?: string | null
}) {
  useEffect(() => {
    trackViewContent({
      content_name: contentName,
      content_category: contentCategory,
      content_type: contentType || 'attraction',
    })
  }, [contentName, contentCategory, contentType])

  return null
}
