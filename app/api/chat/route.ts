import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase/server'
import { AGENCY_CONTRACTING_ANSWER } from '../../../lib/agencyContracting'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type LeadData = {
  name: string | null
  email: string | null
  agency: string | null
  country: string | null
  interest: string | null
  passengers: number | null
  shouldSave: boolean
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5547992816769'

const SYSTEM_PROMPT = `Sos "Cambo", el asistente virtual de Camboriú Estudiantil.

TU MISIÓN:
Ayudar a agencias de turismo estudiantil, coordinadores y familias a entender la propuesta de Camboriú Estudiantil y derivar consultas comerciales al equipo por WhatsApp.

SOBRE CAMBORIÚ ESTUDIANTIL:
- Empresa de turismo receptivo en Balneário Camboriú, Brasil.
- No vende viajes, entradas ni servicios directamente a estudiantes, familias, turistas o público general.
- Opera exclusivamente a través de agencias de viajes autorizadas que comercializan sus programas en cada país.
- Más de 30 años de trayectoria.
- Recibe estudiantes secundarios y agencias de Argentina, Uruguay, Chile, Paraguay, Bolivia, Perú y Brasil.
- Opera experiencias de día, tarde y noche.
- Tiene acuerdos y experiencias destacadas con Green Valley, Eclipse, Maria's, parques acuáticos Zacarias y Cascata Carolina, Beto Carrero World, campamentos, fiestas y paseos.
- La web cuenta con secciones de eventos, agencias, descargas de materiales, preguntas frecuentes y contacto.

DATOS IMPORTANTES QUE NO PODÉS CONFUNDIR:
- Green Valley es una discoteca / club nocturno, no es un parque temático. Es uno de los complejos de diversión nocturna más importantes de Sudamérica, con clubes en un marco natural imponente, y fue elegido varias veces como mejor club del mundo.
- Eclipse es una discoteca propia de Camboriú Estudiantil, famosa por la fiesta de la espuma.
- Parque Acuático Zacarias y Cascata Carolina son parques acuáticos. El nombre correcto es "Zacarias", nunca "Zararios" ni otra variante.
- Beto Carrero World es un parque temático.
- Barco Pirata es un paseo/experiencia embarcada, no una discoteca.

DATOS DE CONTACTO:
- WhatsApp: +${WHATSAPP_NUMBER}
- Email: info@camboriuestudiantil.com

REGLAS:
- Respondé siempre en español, salvo que el visitante escriba en otro idioma.
- Tono cercano, profesional y comercial.
- Máximo 3 párrafos cortos.
- No inventes precios, disponibilidad, fechas, cupos, condiciones contractuales ni características de atracciones.
- Copiá exactamente los nombres propios de atracciones como aparecen cargados. No traduzcas ni corrijas nombres propios.
- Si no tenés información concreta sobre una atracción, decí que el equipo puede confirmarlo por WhatsApp.
- Usá como fuente principal la sección "ATRACCIONES CARGADAS EN EL ADMIN" cuando esté disponible.
- Si preguntan cómo contratar, reservar o comprar un viaje, si pueden contratar directamente, o si venden al público, aclarales que Camboriú Estudiantil opera exclusivamente a través de agencias autorizadas y que deben consultar el listado de la sección Agencias.
- Nunca sugieras que un estudiante, familiar o turista puede contratar directamente con Camboriú Estudiantil.
- Si preguntan por disponibilidad, fechas o cupos, aclarales que deben consultarlo con una agencia autorizada. La disponibilidad para diciembre de 2026 y diciembre de 2027 es muy limitada.
- Si quien consulta representa una agencia y quiere trabajar con Camboriú Estudiantil, sí puede derivarse al equipo mediante el botón de WhatsApp.
- Si el visitante representa una agencia, intentá obtener naturalmente país, nombre de agencia, cantidad estimada de pasajeros y temporada de interés.
- No pidas todos los datos juntos como formulario.
- Podés usar emojis con moderación.
- No escribas URLs crudas ni links de WhatsApp en la respuesta. El widget ya muestra un botón fijo para hablar por WhatsApp.
- Cuando corresponda, decí "podés tocar el botón de WhatsApp que aparece abajo" o una frase similar.
`

async function getAttractionsContext() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('attractions')
      .select('title, subtitle, category, type, description')
      .eq('is_active', true)
      .order('sort_order')
      .limit(20)

    if (!data || data.length === 0) return ''

    const items = data.map((attraction) => {
      const description = attraction.description
        ? attraction.description.replace(/\s+/g, ' ').slice(0, 650)
        : 'Sin descripción cargada.'

      return `- ${attraction.title}: categoría ${attraction.category}, tipo ${attraction.type}. ${
        attraction.subtitle ? `Subtítulo: ${attraction.subtitle}. ` : ''
      }Descripción: ${description}`
    })

    return `\n\nATRACCIONES CARGADAS EN EL ADMIN:\n${items.join('\n')}`
  } catch (error) {
    console.error('Attractions context error:', error)
    return ''
  }
}

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

function latestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === 'user')?.content || ''
}

function includesCommercialIntent(text: string) {
  const normalized = text.toLowerCase()
  const keywords = [
    'agencia',
    'cotizar',
    'cotización',
    'presupuesto',
    'precio',
    'tarifa',
    'viaje',
    'grupo',
    'estudiantes',
    'egresados',
    'pasajeros',
    'temporada',
    'fecha',
    'cupo',
    'ingreso',
    'entradas',
    'consultar',
  ]

  return keywords.some((keyword) => normalized.includes(keyword))
}

function asksHowToContract(text: string) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const directSalePhrases = [
    'como reservo',
    'como reservar',
    'quiero reservar',
    'como contrato',
    'como contratar',
    'quiero contratar',
    'como compro',
    'como comprar',
    'venden directo',
    'venta directa',
    'venden al publico',
    'comprar directo',
    'contratar directo',
    'sin agencia',
    'por mi cuenta',
    'necesito una agencia',
  ]

  const contractingTerms = ['contratar', 'reservar', 'comprar', 'cotizar', 'conseguir']
  const travelTerms = [
    'viaje de egresados',
    'gira de estudio',
    'viaje estudiantil',
    'programa',
    'paquete',
    'viaje',
  ]

  return (
    directSalePhrases.some((phrase) => normalized.includes(phrase)) ||
    (contractingTerms.some((term) => normalized.includes(term)) &&
      travelTerms.some((term) => normalized.includes(term)))
  )
}

function extractLeadData(messages: ChatMessage[]): LeadData {
  const transcript = messages.map((message) => message.content).join('\n')
  const latestMessage = latestUserMessage(messages)
  const email = transcript.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || null
  const passengersMatch = transcript.match(/(?:somos|son|para|llevar|traer)?\s*(\d{2,4})\s*(?:pasajeros|pax|estudiantes|chicos|personas)/i)
  const agencyMatch = transcript.match(/(?:agencia|empresa)\s+(?:se llama|es|de viajes)?\s*[:\-]?\s*([A-ZÁÉÍÓÚÑ0-9][A-ZÁÉÍÓÚÑ0-9\s.&'-]{2,40})/i)
  const countryMatch = transcript.match(/\b(argentina|uruguay|chile|paraguay|bolivia|per[uú]|brasil)\b/i)
  const interestMatch = transcript.match(/\b(cascata carolina|zacarias|beto carrero|green valley|eclipse|maria'?s|barco pirata|campamento|playa|disco|discoteca)\b/i)

  return {
    name: null,
    email,
    agency: agencyMatch?.[1]?.trim() || null,
    country: countryMatch?.[1] || null,
    interest: interestMatch?.[1] || latestMessage.slice(0, 120),
    passengers: passengersMatch ? Number(passengersMatch[1]) : null,
    shouldSave: includesCommercialIntent(transcript),
  }
}

function cleanAssistantReply(text: string) {
  return text
    .replace(/https:\/\/wa\.me\/[^\s)]+/gi, 'el botón de WhatsApp que aparece abajo')
    .replace(/http:\/\/wa\.me\/[^\s)]+/gi, 'el botón de WhatsApp que aparece abajo')
    .replace(/wa\.me\/[^\s)]+/gi, 'el botón de WhatsApp que aparece abajo')
    .trim()
}

async function saveChatLead(messages: ChatMessage[], assistantReply: string) {
  const lead = extractLeadData(messages)
  if (!lead.shouldSave) return

  const supabase = createAdminClient()
  const transcript = [...messages, { role: 'assistant' as const, content: assistantReply }]
    .map((message) => `${message.role === 'user' ? 'Usuario' : 'Cambo'}: ${message.content}`)
    .join('\n\n')

  await supabase.from('contact_requests').insert({
    name: lead.name || 'Lead desde chatbot',
    email: lead.email,
    agency: lead.agency,
    country: lead.country,
    interest: lead.interest || 'Consulta desde chatbot',
    passengers: lead.passengers,
    message: transcript,
    source: 'chatbot',
    status: 'new',
  })
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

    const userMessage = latestUserMessage(normalizedMessages)

    if (asksHowToContract(userMessage)) {
      try {
        await saveChatLead(normalizedMessages, AGENCY_CONTRACTING_ANSWER)
      } catch (error) {
        console.error('Chat lead save error:', error)
      }

      return NextResponse.json({
        message: AGENCY_CONTRACTING_ANSWER,
      })
    }

    const attractionsContext = await getAttractionsContext()
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 650,
        system: `${SYSTEM_PROMPT}${attractionsContext}`,
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
    const finalMessage =
      cleanAssistantReply(message) ||
      'No pude responder en este momento. Podés escribirnos por WhatsApp y el equipo te ayuda enseguida.'

    try {
      await saveChatLead(normalizedMessages, finalMessage)
    } catch (error) {
      console.error('Chat lead save error:', error)
    }

    return NextResponse.json({
      message: finalMessage,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}
