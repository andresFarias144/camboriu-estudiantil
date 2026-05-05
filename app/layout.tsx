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
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: '#080c0a' }}>
        {children}
      </body>
    </html>
  )
}