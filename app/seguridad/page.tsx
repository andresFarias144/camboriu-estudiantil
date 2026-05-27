import { PublicFooter } from '../../components/public/PublicFooter'
import { PublicNavbar } from '../../components/public/PublicNavbar'
import { HeartPulse, LockKeyhole, ShieldCheck } from 'lucide-react'

const safetyItems = [
  {
    title: 'Asistencia médica',
    icon: HeartPulse,
    text: 'En las discotecas, Pool Party, Campamento Americano y Parque acuático Zacarías incluye el servicio de ambulancia y personal paramédico permanente durante el evento.',
  },
  {
    title: 'Eventos privados',
    icon: ShieldCheck,
    text: 'Las discotecas, Pool Party y Campamento Americano están diseñados exclusivamente para estudiantes y egresados, y constituyen eventos privados. No se permite la entrada de personas no autorizadas al evento.',
  },
  {
    title: 'Control de acceso',
    icon: LockKeyhole,
    text: 'En el caso de las discotecas y Pool Party, el ingreso está bajo la supervisión del coordinador designado por la empresa de viajes y nuestra portería. A ningún estudiante ó egresado se le permitirá abandonar el establecimiento sin la debida autorización por parte de los responsables del grupo.',
  },
]

export default function SeguridadPage() {
  return (
    <div className="min-h-screen bg-[#080c0a] text-white">
      <PublicNavbar />

      <main>
        <section className="container-page py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-8 lg:gap-14 items-center">
            <div>
              <div className="eyebrow mb-4">Seguridad</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight mb-6">
                Cuidamos cada<br />
                <span className="text-brand-green">experiencia</span>
              </h1>
              <p className="text-sm sm:text-base text-white/65 leading-relaxed">
                A lo largo de los años de trayectoria de nuestra empresa, siempre nos hemos enfocado en diversas facetas del entretenimiento, y una de gran importancia es la seguridad de nuestros eventos y participantes. Para detallar de manera más precisa cada componente de seguridad, nos complace informarles sobre los servicios que ofrecemos en nuestros variados productos:
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <img
                src="/seguridad-ambulancia-campamento.jpg"
                alt="Ambulancia en Campamento Americano"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a]/45 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="container-page pb-16 sm:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safetyItems.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-brand-green/20 bg-brand-green/10 text-brand-green">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                  <p className="text-sm text-white/58 leading-relaxed">{item.text}</p>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
