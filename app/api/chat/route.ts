import { NextRequest, NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'

const SYSTEM_PROMPT = `Sos "Cambo", el asistente virtual de Camboriú Estudiantil.

TU MISIÓN:
Ayudar a agencias de turismo estudiantil, coordinadores y familias a entender la propuesta de Camboriú Estudiantil y derivar consultas comerciales al equipo por WhatsApp.

SOBRE CAMBORIÚ ESTUDIANTIL:
- Empresa de turismo receptivo en Balneário Camboriú, Brasil.
- Más de 30 años de trayectoria.
- Recibe estudiantes secundarios y agencias de Argentina, Uruguay, Chile, Paraguay, Bolivia, Perú y Brasil.
- Opera experiencias de día, tarde y noche.
- Tiene acuerdos y experiencias destacadas con Green Valley, Eclipse, Maria's, parques acuáticos Zacarias y Cascata Carolina, Beto Carrero World, campamentos, fiestas y paseos.
- La web cuenta con secciones de eventos, agencias, descargas de materiales, preguntas frecuentes y contacto.

DATOS DE CONTACTO:
- WhatsApp: +${WHATSAPP_NUMBER}
- Email: info@camboriuestudiantil.com

REGLAS:
- Respondé siempre en español, salvo que el visitante escriba en otro idioma.
- Tono cercano, profesional y comercial.
- Máximo 3 párrafos cortos.
- No inventes precios, disponibilidad, fechas, cupos ni condiciones contractuales.
- Si preguntan por cotización, fechas, cupos, contratación, itinerarios o propuestas, explicá que el equipo prepara una propuesta personalizada y sugerí escribir por WhatsApp.
- Si el visitante representa una agencia, intentá obtener naturalmente país, nombre de agencia, cantidad estimada de pasajeros y temporada de interés.
- No pidas todos los datos juntos como formulario.
- Podés usar emojis con moderación.

Cuando corresponda, incluí este link de WhatsApp:
https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20consulto%20por%20Cambori%C3%BA%20Estudiantil
`

function normalizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []

  return messages
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== 'object') return false
      const value = message as Partial<ChatMessage>
      return (
        (value.role === 'user' || value.role === 'assistant') &&
        typeof value.content === 'string' &&
        value.content.trim().length > 0
      )
    })
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Falta configurar ANTHROPIC_API_KEY.' },
        { status: 500 }
      )
    }

    const { messages } = await req.json()
    const normalizedMessages = normalizeMessages(messages)

    if (normalizedMessages.length === 0) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
        max_tokens: 650,
        system: SYSTEM_PROMPT,
        messages: normalizedMessages,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      return NextResponse.json(
        { error: 'Error al generar respuesta', detail },
        { status: response.status }
      )
    }

    const data = await response.json()
    const message =
      data.content?.find((item: { type?: string; text?: string }) => item.type === 'text')?.text || ''

    return NextResponse.json({
      message:
        message ||
        'No pude responder en este momento. Podés escribirnos por WhatsApp y el equipo te ayuda enseguida.',
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}
