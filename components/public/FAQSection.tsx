'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: '¿Qué medidas de seguridad toman?',
    answer: `A lo largo de los años de trayectoria de nuestra empresa, siempre nos hemos enfocado en diversas facetas del entretenimiento, y una de gran importancia es la seguridad de nuestros eventos y participantes. Para detallar de manera más precisa cada componente de seguridad, nos complace informarles sobre los servicios que ofrecemos en nuestros variados productos:

ASISTENCIA MÉDICA
En las discotecas, Pool Party, Campamento Americano y Parque acuático Zacarías incluye el servicio de ambulancia y personal paramédico permanente durante el evento.

EVENTOS PRIVADOS
Las discotecas, Pool Party y Campamento Americano están diseñados exclusivamente para estudiantes y egresados, y constituyen eventos privados. No se permite la entrada de personas no autorizadas al evento.

CONTROL DE ACCESO
En el caso de las discotecas y Pool Party, el ingreso está bajo la supervisión del coordinador designado por la empresa de viajes y nuestra portería. A ningún estudiante o egresado se le permitirá abandonar el establecimiento sin la debida autorización por parte de los responsables del grupo.`,
  },
  {
    question: '¿Puedo personalizar el itinerario?',
    answer:
      'Sí, trabajamos con cada empresa para adaptar el viaje a sus necesidades específicas. Podemos modificar actividades, duración, presupuesto.',
  },
  {
    question: '¿Cuentan con oficina física?',
    answer:
      'Sí, nos encontramos en el centro de la ciudad de Balneario Camboriú. Dirección: Av. Central, 151 - Centro, Balneário Camboriú - Ed. Washington, Piso 5, Sala 504 - SC.',
  },
  {
    question: '¿Cómo reservo?',
    answer:
      'Contactanos a través de WhatsApp, email o nuestras redes sociales.',
  },
  {
    question: 'Vuelos y traslados, ¿están incluidos?',
    answer:
      'No, no realizamos vuelos ni traslados internacionales. Sí contamos con la posibilidad de brindar servicio de traslado internos dentro del destino, desde aeropuertos hasta Balneario Camboriú o para la realización de actividades.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-10 lg:gap-16 items-start">
          {/* Columna izquierda */}
          <div className="lg:sticky lg:top-24">
            <div className="eyebrow mb-4">FAQ</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-5">
              Preguntas <br />
              <span className="text-brand-magenta">frecuentes</span>
            </h2>
            <p className="text-sm sm:text-base text-white/55 leading-relaxed max-w-md">
              Resolvemos todas tus dudas sobre nuestros viajes de estudios y egresados. Si no encontrás la respuesta que buscás, no dudes en contactarnos.
            </p>
          </div>

          {/* Acordeón */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isOpen
          ? 'bg-white/[0.04] border-brand-magenta/30'
          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left px-5 sm:px-7 py-5 sm:py-6 cursor-pointer"
      >
        <span className="text-base sm:text-lg font-medium pr-4">{question}</span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isOpen
              ? 'bg-brand-magenta text-white rotate-180'
              : 'bg-white/10 text-white/60'
          }`}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 -mt-2">
          <div className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}