import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080c0a] mt-12">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-xl font-extrabold tracking-wider text-white">
              CAMBORI<span className="text-brand-green">U</span>{' '}
              <span className="text-sm text-white/40 font-normal">ESTUDIANTIL</span>
            </div>
            <p className="text-sm text-white/45 mt-3 leading-relaxed">
              Líderes en turismo estudiantil en Brasil. Experiencias únicas, operación profesional y respaldo garantizado.
            </p>
          </div>

          {/* Destinos */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase mb-3 text-white">Destinos</div>
            <ul className="space-y-2">
              <li><Link href="/destinos" className="text-sm text-white/50 hover:text-white transition-colors no-underline">Día</Link></li>
              <li><Link href="/destinos" className="text-sm text-white/50 hover:text-white transition-colors no-underline">Noche</Link></li>
              <li><Link href="/clientes" className="text-sm text-white/50 hover:text-white transition-colors no-underline">Agencias</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase mb-3 text-white">Empresa</div>
            <ul className="space-y-2">
              <li><Link href="/contacto" className="text-sm text-white/50 hover:text-white transition-colors no-underline">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase mb-3 text-white">Contacto</div>
            <ul className="space-y-2 text-sm text-white/50">
              <li>+55 47 99281 6769</li>
              <li className="break-all">info@camboriuestudiantil.com</li>
              <li>Balneário Camboriú, SC, Brasil</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-[11px] text-white/30 text-center">
          © {new Date().getFullYear()} Camboriu Estudiantil by Greenvalley. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
