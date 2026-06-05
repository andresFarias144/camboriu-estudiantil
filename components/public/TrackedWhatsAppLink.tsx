'use client'

import { type AnchorHTMLAttributes, type ReactNode } from 'react'
import { trackContact } from '../../lib/marketingEvents'

type TrackedWhatsAppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  source: string
  label?: string
  children: ReactNode
}

export function TrackedWhatsAppLink({
  href,
  source,
  label,
  children,
  onClick,
  ...props
}: TrackedWhatsAppLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        trackContact({
          source,
          contact_method: 'whatsapp',
          label,
        })
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
