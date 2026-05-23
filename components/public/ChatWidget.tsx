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

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(true)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2 md:bottom-7 md:left-7">
      {showBubble && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            setShowBubble(false)
          }}
          className="max-w-56 rounded-2xl rounded-bl-none border border-white/10 bg-[#080c0a]/95 px-4 py-3 text-left text-xs text-white/80 shadow-2xl backdrop-blur no-underline"
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
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
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
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-magenta text-white shadow-2xl transition-transform hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle size={26} />
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-[#080c0a] bg-brand-green" />
        </button>
      )}
    </div>
  )
}
