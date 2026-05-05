// ============================================================
// CAMBORIU ESTUDIANTIL — TypeScript Types
// ============================================================

export type Locale = 'es' | 'pt'

export type AttractionCategory = 'dia' | 'noche'

export type AttractionType =
  | 'paseo'
  | 'discoteca'
  | 'parque_acuatico'
  | 'parque_tematico'
  | 'playa'
  | 'otro'

export type AttractionBadge = 'exclusivo' | 'nuevo' | 'popular' | null

export interface Attraction {
  id:               string
  title:            string
  title_pt:         string | null
  subtitle:         string | null
  subtitle_pt:      string | null
  slug:             string
  category:         AttractionCategory
  type:             AttractionType
  badge:            AttractionBadge
  description:      string | null
  description_pt:   string | null
  main_image:       string | null
  gallery:          string[]
  video_url:        string | null
  address:          string | null
  lat:              number | null
  lng:              number | null
  consultation_cta: string
  whatsapp_msg:     string | null
  season:           string[]
  is_active:        boolean
  is_featured:      boolean
  sort_order:       number
  created_at:       string
  updated_at:       string
}

export type ClientCountry =
  | 'argentina'
  | 'uruguay'
  | 'chile'
  | 'paraguay'
  | 'bolivia'
  | 'peru'
  | 'brasil'

export interface Client {
  id:          string
  name:        string
  slug:        string
  logo_url:    string | null
  country:     ClientCountry
  city:        string | null
  website:     string | null
  instagram:   string | null
  facebook:    string | null
  whatsapp:    string | null
  since_year:  number | null
  is_active:   boolean
  is_featured: boolean
  sort_order:  number
  created_at:  string
  updated_at:  string
}

export interface ContactRequest {
  id:         string
  name:       string
  email:      string | null
  agency:     string | null
  country:    string | null
  interest:   string | null
  passengers: number | null
  message:    string | null
  source:     string
  status:     'new' | 'contacted' | 'closed'
  created_at: string
}

// ── Label maps for UI ─────────────────────────────────────────

export const COUNTRY_LABELS: Record<ClientCountry, { es: string; pt: string; flag: string }> = {
  argentina: { es: 'Argentina',  pt: 'Argentina',  flag: '🇦🇷' },
  uruguay:   { es: 'Uruguay',    pt: 'Uruguai',    flag: '🇺🇾' },
  chile:     { es: 'Chile',      pt: 'Chile',      flag: '🇨🇱' },
  paraguay:  { es: 'Paraguay',   pt: 'Paraguai',   flag: '🇵🇾' },
  bolivia:   { es: 'Bolivia',    pt: 'Bolívia',    flag: '🇧🇴' },
  peru:      { es: 'Perú',       pt: 'Peru',       flag: '🇵🇪' },
  brasil:    { es: 'Brasil',     pt: 'Brasil',     flag: '🇧🇷' },
}

export const ATTRACTION_TYPE_LABELS: Record<AttractionType, { es: string; pt: string }> = {
  paseo:          { es: 'Paseo',           pt: 'Passeio' },
  discoteca:      { es: 'Discoteca',       pt: 'Discoteca' },
  parque_acuatico:{ es: 'Parque acuático', pt: 'Parque aquático' },
  parque_tematico:{ es: 'Parque temático', pt: 'Parque temático' },
  playa:          { es: 'Playa VIP',       pt: 'Praia VIP' },
  otro:           { es: 'Otro',            pt: 'Outro' },
}

export const BADGE_LABELS: Record<string, { es: string; pt: string; color: string }> = {
  exclusivo: { es: 'Exclusivo', pt: 'Exclusivo', color: '#e61e8c' },
  nuevo:     { es: 'Nuevo',     pt: 'Novo',      color: 'rgba(255,255,255,0.2)' },
  popular:   { es: 'Popular',   pt: 'Popular',   color: '#3df070' },
}
