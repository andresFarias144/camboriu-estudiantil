import './globals.css'
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Camboriu Estudiantil',
  description: 'Líderes en turismo estudiantil en Brasil. Operación profesional para agencias y grupos estudiantiles en Balneário Camboriú.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={openSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}