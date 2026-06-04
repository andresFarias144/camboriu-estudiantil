import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Open_Sans } from 'next/font/google'
import { ChatWidget } from '../components/public/ChatWidget'
import { GoogleAnalytics } from '../components/public/GoogleAnalytics'
import { MetaPixel } from '../components/public/MetaPixel'
import { PWARegister } from '../components/public/PWARegister'
import { TikTokPixel } from '../components/public/TikTokPixel'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Camboriú Estudiantil',
    template: '%s | Camboriú Estudiantil',
  },
  description:
    'Líderes en turismo estudiantil en Brasil. Operación profesional para agencias y grupos estudiantiles en Balneário Camboriú.',
  applicationName: 'Camboriú Estudiantil',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Camboriú',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#080c0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={openSans.variable}>
      <body className="font-sans">
        <GoogleAnalytics />
        <MetaPixel />
        <TikTokPixel />
        {children}
        <ChatWidget />
        <PWARegister />
      </body>
    </html>
  )
}
