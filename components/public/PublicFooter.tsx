import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', padding: '48px 48px 28px', background: '#080c0a' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '32px', marginBottom: '32px', maxWidth: '1280px', margin: '0 auto 32px' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>
            CAMBORI<span style={{ color: '#3df070' }}>U</span>{' '}
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>ESTUDIANTIL</span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '10px', lineHeight: 1.6 }}>
            Líderes en turismo estudiantil en Brasil. Experiencias únicas, operación profesional y respaldo garantizado.
          </p>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px', color: '#fff' }}>Destinos</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}><Link href="/destinos" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Día</Link></li>
            <li style={{ marginBottom: '8px' }}><Link href="/destinos" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Noche</Link></li>
            <li style={{ marginBottom: '8px' }}><Link href="/clientes" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Agencias</Link></li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px', color: '#fff' }}>Empresa</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}><Link href="/contacto" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Contacto</Link></li>
            <li style={{ marginBottom: '8px' }}><a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Sobre nosotros</a></li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px', color: '#fff' }}>Contacto</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>+55 47 99281 6769</li>
            <li style={{ marginBottom: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>info@camboriuestudiantil.com</li>
            <li style={{ marginBottom: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Balneário Camboriú, SC, Brasil</li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '20px', maxWidth: '1280px', margin: '0 auto', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        © {new Date().getFullYear()} Camboriu Estudiantil by Greenvalley. Todos los derechos reservados.
      </div>
    </footer>
  )
}
