-- ============================================================
-- CAMBORIU ESTUDIANTIL — Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: attractions
-- ============================================================
create table public.attractions (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  category      text not null check (category in ('dia', 'noche')),
  type          text not null check (type in ('paseo', 'discoteca', 'parque_acuatico', 'parque_tematico', 'playa', 'otro')),
  badge         text check (badge in ('exclusivo', 'nuevo', 'popular')) default null,
  description   text,
  main_image    text,                         -- Cloudinary URL
  gallery       text[] default '{}',          -- Array of Cloudinary URLs
  video_url     text,                         -- YouTube/Vimeo embed URL
  address       text,
  lat           float,
  lng           float,
  consultation_cta  text default 'Consultar disponibilidad',
  whatsapp_msg  text,                         -- Pre-filled WhatsApp message
  season        text[] default '{}',          -- e.g. ["2024", "2025"]
  is_active     boolean default true,
  is_featured   boolean default false,
  sort_order    integer default 0,
  -- Bilingual fields
  title_pt      text,
  description_pt text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- TABLE: clients (agencias de turismo)
-- ============================================================
create table public.clients (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,                           -- Cloudinary URL
  country     text not null check (country in ('argentina','uruguay','chile','paraguay','bolivia','peru','brasil')),
  city        text,
  website     text,
  instagram   text,
  facebook    text,
  whatsapp    text,                           -- Internal use only (not public)
  since_year  integer,
  is_active   boolean default true,
  is_featured boolean default false,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- TABLE: contact_requests
-- ============================================================
create table public.contact_requests (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  email           text,
  agency          text,
  country         text,
  interest        text,
  passengers      integer,
  message         text,
  source          text default 'website',    -- website | whatsapp | email
  status          text default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at      timestamptz default now()
);

-- ============================================================
-- Auto-update updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger attractions_updated_at
  before update on public.attractions
  for each row execute function public.handle_updated_at();

create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Auto-generate slug from title
-- ============================================================
create or replace function public.slugify(val text)
returns text as $$
begin
  return lower(
    regexp_replace(
      regexp_replace(
        translate(val,
          'áàäâéèëêíìïîóòöôúùüûñçÁÀÄÂÉÈËÊÍÌÏÎÓÒÖÔÚÙÜÛÑÇ',
          'aaaaeeeeiiiioooouuuuncAAAAEEEEIIIIOOOOUUUUNC'
        ),
      '[^a-z0-9\s-]', '', 'g'),
    '\s+', '-', 'g')
  );
end;
$$ language plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public read access for active records
alter table public.attractions enable row level security;
alter table public.clients enable row level security;
alter table public.contact_requests enable row level security;

-- Anyone can read active attractions
create policy "Public can view active attractions"
  on public.attractions for select
  using (is_active = true);

-- Anyone can read active clients
create policy "Public can view active clients"
  on public.clients for select
  using (is_active = true);

-- Anyone can insert contact requests
create policy "Anyone can submit contact request"
  on public.contact_requests for insert
  with check (true);

-- Authenticated admin users can do everything
create policy "Admin full access attractions"
  on public.attractions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access clients"
  on public.clients for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin can read contact requests"
  on public.contact_requests for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- SEED: Sample attractions
-- ============================================================
insert into public.attractions (title, title_pt, slug, category, type, badge, description, description_pt, address, lat, lng, consultation_cta, whatsapp_msg, is_active, is_featured, sort_order) values
(
  'Green Valley',
  'Green Valley',
  'green-valley',
  'noche',
  'discoteca',
  'exclusivo',
  'El complejo de diversión nocturna más importante de Sudamérica. 5 clubes únicos en un marco natural imponente. Elegido varias veces el mejor club del mundo.',
  'O complexo de entretenimento noturno mais importante da América do Sul. 5 clubes únicos em um cenário natural imponente. Eleito várias vezes o melhor clube do mundo.',
  'Rod. SC-486, Camboriú - SC, Brasil',
  -27.0279,
  -48.6489,
  'Consultar disponibilidad',
  'Hola! Consulto por Green Valley para la temporada 2025.',
  true, true, 1
),
(
  'Eclipse',
  'Eclipse',
  'eclipse',
  'noche',
  'discoteca',
  null,
  'La famosa fiesta de la espuma. Eclipse es una disco propia de Camboriu Estudiantil, una de las noches más memorables del viaje.',
  'A famosa festa da espuma. Eclipse é uma disco própria da Camboriu Estudiantil, uma das noites mais memoráveis da viagem.',
  'Balneário Camboriú, SC, Brasil',
  -26.9929,
  -48.6357,
  'Consultar disponibilidad',
  'Hola! Consulto por la fiesta Eclipse para la temporada 2025.',
  true, true, 2
),
(
  'Beto Carrero World',
  'Beto Carrero World',
  'beto-carrero-world',
  'dia',
  'parque_tematico',
  null,
  'El parque de diversiones más grande de Latinoamérica. Una jornada llena de adrenalina, shows y atracciones para todos.',
  'O maior parque de diversões da América Latina. Um dia cheio de adrenalina, shows e atrações para todos.',
  'Rodovia Antônio Heil, 6600 - Penha, SC, Brasil',
  -26.7687,
  -48.6457,
  'Consultar disponibilidad',
  'Hola! Consulto por Beto Carrero World para la temporada 2025.',
  true, true, 3
),
(
  'Big Wheel Camboriú',
  'Big Wheel Camboriú',
  'big-wheel',
  'dia',
  'paseo',
  'nuevo',
  'La rueda gigante más grande de Sudamérica. Una experiencia única con vistas panorámicas de Balneário Camboriú y el océano Atlántico.',
  'A roda gigante mais alta da América do Sul. Uma experiência única com vistas panorâmicas de Balneário Camboriú e o Oceano Atlântico.',
  'Av. Atlântica, Balneário Camboriú - SC, Brasil',
  -26.9919,
  -48.6345,
  'Consultar disponibilidad',
  'Hola! Consulto por el Big Wheel para la temporada 2025.',
  true, false, 4
),
(
  'Barco Pirata + Cena en la Playa',
  'Barco Pirata + Jantar na Praia',
  'barco-pirata',
  'dia',
  'paseo',
  null,
  'Paseo en barco por Portobelo con show de piratas, cena en la playa y fogón. Una tarde y noche diferente a todo lo demás.',
  'Passeio de barco por Portobelo com show de piratas, jantar na praia e fogueira. Uma tarde e noite diferente de tudo.',
  'Porto Belo, SC, Brasil',
  -27.1549,
  -48.5553,
  'Consultar disponibilidad',
  'Hola! Consulto por el Barco Pirata para la temporada 2025.',
  true, false, 5
),
(
  'Parque Acuático Zacarias',
  'Parque Aquático Zacarias',
  'parque-acuatico-zacarias',
  'dia',
  'parque_acuatico',
  null,
  'Agua, toboganes y diversión en uno de los parques acuáticos más populares de la región. Un día de sol y adrenalina.',
  'Água, tobogãs e diversão em um dos parques aquáticos mais populares da região. Um dia de sol e adrenalina.',
  'Balneário Camboriú, SC, Brasil',
  -26.9950,
  -48.6360,
  'Consultar disponibilidad',
  'Hola! Consulto por el Parque Zacarias para la temporada 2025.',
  true, false, 6
),
(
  'Cascata Carolina',
  'Cascata Carolina',
  'cascata-carolina',
  'dia',
  'parque_acuatico',
  null,
  'Pool party y experiencia acuática única en Cascata Carolina. Una nueva atracción con piletas, toboganes y ambiente festivo.',
  'Pool party e experiência aquática única na Cascata Carolina. Uma nova atração com piscinas, tobogãs e ambiente festivo.',
  'Balneário Camboriú, SC, Brasil',
  -26.9960,
  -48.6370,
  'Consultar disponibilidad',
  'Hola! Consulto por Cascata Carolina para la temporada 2025.',
  true, false, 7
);

-- ============================================================
-- SEED: Sample clients
-- ============================================================
insert into public.clients (name, slug, country, city, website, is_active, is_featured, sort_order) values
('Agencia Viajar Juntos', 'viajar-juntos', 'argentina', 'Buenos Aires', 'https://viajarjuntos.com.ar', true, true, 1),
('Travel Rock', 'travel-rock', 'argentina', 'Buenos Aires', 'https://travelrock.com.ar', true, true, 2),
('Samba Brasil Argentina', 'samba-brasil-ar', 'argentina', 'Buenos Aires', null, true, false, 3),
('Travel Rock Uruguay', 'travel-rock-uy', 'uruguay', 'Montevideo', null, true, false, 1),
('Samba Brasil Uruguay', 'samba-brasil-uy', 'uruguay', 'Montevideo', null, true, false, 2),
('Explora Chile', 'explora-chile', 'chile', 'Santiago', null, true, false, 1),
('Paraguay Tours', 'paraguay-tours', 'paraguay', 'Asunción', null, true, false, 1),
('Euroriente', 'euroriente', 'peru', 'Lima', null, true, false, 1);
