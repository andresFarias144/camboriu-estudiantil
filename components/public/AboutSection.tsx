export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="relative py-20 sm:py-28 overflow-hidden scroll-mt-28"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(8,12,10,0.85) 0%, rgba(8,12,10,0.6) 50%, rgba(8,12,10,0.4) 100%), url(https://res.cloudinary.com/dea2a4o1z/image/upload/v1779502205/nosotros_eesclu.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay adicional para mejor contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080c0a]/95 via-[#080c0a]/50 to-transparent" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-10 lg:gap-16 items-center">
          {/* Texto a la izquierda */}
          <div>
            <div className="eyebrow mb-4">Nosotros</div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-6">
              Más de 30 años creando<br />
              <span className="text-brand-magenta">experiencias inolvidables</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
              <p>
                En Camboriú Estudiantil, nos especializamos en organizar giras de estudios y viajes de egresados para estudiantes de toda Latinoamérica. Nuestro equipo de profesionales con años de experiencia se dedica a crear itinerarios personalizados que combinan educación, aventura y diversión.
              </p>
              <p>
                Trabajamos con las mejores agencias de viajes de cada país para garantizar la seguridad, calidad y satisfacción de todos nuestros participantes. Desde campamentos en la naturaleza hasta fiestas épicas, tenemos el viaje perfecto para cada grupo.
              </p>
            </div>

            {/* Tarjeta del fundador */}
            <div className="mt-8 inline-block bg-[#080c0a]/80 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-base font-semibold text-white">Claudio González Kenner</div>
              <div className="text-xs text-brand-magenta font-medium mt-0.5">Fundador</div>
            </div>
          </div>

          {/* Stats a la derecha */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <StatBlock big="+30.000" small="Estudiantes felices por temporada" highlight />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatBlock big="30+" small="Años de experiencia" />
              <StatBlock big="50+" small="Agencias asociadas" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBlock({
  big,
  small,
  highlight = false,
}: {
  big: string
  small: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-7 ${
        highlight
          ? 'bg-brand-magenta text-white'
          : 'bg-[#080c0a]/70 backdrop-blur-sm border border-white/10 text-white'
      }`}
    >
      <div
        className={`text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-2 ${
          highlight ? 'text-white' : 'text-brand-green'
        }`}
      >
        {big}
      </div>
      <div
        className={`text-[10px] sm:text-xs uppercase tracking-widest font-medium ${
          highlight ? 'opacity-90' : 'text-white/60'
        }`}
      >
        {small}
      </div>
    </div>
  )
}
