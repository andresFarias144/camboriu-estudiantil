'use client'

type EventParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    fbq?: (command: string, eventName: string, params?: EventParams) => void
    gtag?: (command: string, eventName: string, params?: EventParams) => void
    ttq?: {
      track?: (eventName: string, params?: EventParams) => void
    }
  }
}

const gaEventNames: Record<string, string> = {
  ViewContent: 'view_content',
  Lead: 'lead',
  Contact: 'contact',
}

const tiktokEventNames: Record<string, string> = {
  ViewContent: 'ViewContent',
  Lead: 'SubmitForm',
  Contact: 'Contact',
}

export function trackMarketingEvent(eventName: 'ViewContent' | 'Lead' | 'Contact', params: EventParams = {}) {
  if (typeof window === 'undefined') return

  window.fbq?.('track', eventName, params)
  window.gtag?.('event', gaEventNames[eventName] || eventName, params)
  window.ttq?.track?.(tiktokEventNames[eventName] || eventName, params)
}

export function trackViewContent(params: EventParams = {}) {
  trackMarketingEvent('ViewContent', params)
}

export function trackLead(params: EventParams = {}) {
  trackMarketingEvent('Lead', params)
}

export function trackContact(params: EventParams = {}) {
  trackMarketingEvent('Contact', params)
}
