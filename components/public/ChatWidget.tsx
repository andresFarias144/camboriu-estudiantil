'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, Send, X } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    '¡Hola! Soy Cambo, el asistente de Camboriú Estudiantil. ¿Querés consultar por eventos, agencias, materiales o una propuesta para tu grupo?',
}

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'
const whatsappMessage = 'Hola, consulto por Camboriú Estudiantil.'

function buildWhatsAppMessage(messages: Message[]) {
  const conversation = messages
    .filter((message) => message.content.trim().length > 0)
    .slice(-8)
    .map((message) => `${message.role === 'user' ? 'Yo' : 'Cambo'}: ${message.content}`)
    .join('\n')

  if (!conversation) return whatsappMessage

  return `Hola, consulto por Camboriú Estudiantil. Este es el contexto de mi conversación con Cambo:\n\n${conversation}`
}

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage(messages))}`

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowBubble(false), 6000)
    return () => window.clearTimeout(timeout)
  }, [])

  if (pathname.startsWith('/admin')) return null

  async function sendMessageWithText(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al consultar el chat')
      }

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            data.message ||
            'No pude responder en este momento. Podés escribirnos por WhatsApp y el equipo te ayuda enseguida.',
        },
      ])
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            'Tuve un problema para responder. Si querés avanzar rápido, escribinos por WhatsApp y el equipo te ayuda con la consulta.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit() {
    sendMessageWithText(input)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 md:bottom-7 md:right-7">
      {showBubble && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setShowBubble(false)
          }}
          className="max-w-56 rounded-2xl rounded-br-none border border-white/10 bg-[#080c0a]/95 px-4 py-3 text-left text-xs text-white/80 shadow-2xl backdrop-blur no-underline"
        >
          ¿Necesitás ayuda con tu viaje o agencia?
        </button>
      )}

      {open && (
        <div className="flex h-[520px] w-[calc(100vw-40px)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080c0a] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#111a14] to-[#2a0d20] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-[#080c0a]">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-none">Cambo</div>
                <div className="mt-1 text-xs text-white/45">
                  {loading ? 'Respondiendo...' : 'Asistente virtual'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#0d120f] px-4 py-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-none bg-brand-green text-[#080c0a]'
                      : 'rounded-bl-none border border-white/10 bg-white/[0.06] text-white/80'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-none border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/35" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-[#080c0a] p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribí tu consulta..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-green/50 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-green text-[#080c0a] transition-opacity disabled:opacity-45"
                aria-label="Enviar mensaje"
              >
                <Send size={17} />
              </button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#25d366] px-3 py-2 text-xs font-semibold text-white no-underline transition-opacity hover:opacity-90"
            >
              Hablar con el equipo por WhatsApp
            </a>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setShowBubble(false)
          }}
          className="group relative flex h-24 w-24 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
          aria-label="Abrir chat"
        >
          <span className="absolute inset-2 rounded-full bg-gradient-to-br from-[#3df070] via-[#00c8ff] to-[#e61e8c] opacity-95 shadow-[0_0_38px_rgba(61,240,112,0.32)] transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-4 rounded-full bg-[#080c0a]/18 backdrop-blur-[1px]" />

          <svg
            className="absolute inset-0 h-full w-full animate-spin [animation-duration:12s]"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <defs>
              <path
                id="chat-widget-text-path"
                d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text className="fill-white text-[8px] font-extrabold uppercase tracking-[0.22em]">
              <textPath href="#chat-widget-text-path" startOffset="0%">
                Preguntame - Hablemos - Despeja tus dudas -
              </textPath>
            </text>
          </svg>

          <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#080c0a]/30 shadow-[inset_0_0_18px_rgba(255,255,255,0.16)]">
            <MessageCircle size={29} strokeWidth={2.2} />
          </span>
          <span className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-[#080c0a] bg-brand-green shadow-[0_0_12px_rgba(61,240,112,0.8)]" />
        </button>
      )}
    </div>
  )
}
