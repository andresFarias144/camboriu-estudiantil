'use client'

import { useState } from 'react'
import { Building2, ChevronDown } from 'lucide-react'
import { defaultFaqs } from '../../lib/defaultFaqs'
import { AGENCY_CONTRACTING_QUESTION } from '../../lib/agencyContracting'

type FAQItemData = {
  question: string
  answer: string
}

export function FAQSection({ faqs = defaultFaqs }: { faqs?: FAQItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const items = faqs.length > 0 ? faqs : defaultFaqs

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
            {items.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isFeatured={faq.question === AGENCY_CONTRACTING_QUESTION}
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
  isFeatured,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isFeatured: boolean
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isOpen
          ? 'bg-white/[0.04] border-brand-magenta/30'
          : isFeatured
          ? 'bg-brand-green/[0.055] border-brand-green/30 hover:border-brand-green/50'
          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left px-5 sm:px-7 py-5 sm:py-6 cursor-pointer"
      >
        <span className="pr-4">
          {isFeatured && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
              <Building2 size={12} />
              Contratación exclusiva por agencias
            </span>
          )}
          <span className="block text-base sm:text-lg font-medium">{question}</span>
        </span>
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
