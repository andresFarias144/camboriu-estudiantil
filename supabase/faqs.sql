create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists faqs_question_unique on public.faqs (question);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
before update on public.faqs
for each row
execute function public.set_updated_at();

alter table public.faqs enable row level security;

drop policy if exists "Public can read active faqs" on public.faqs;
create policy "Public can read active faqs"
on public.faqs
for select
using (is_active = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated users can insert faqs" on public.faqs;
create policy "Authenticated users can insert faqs"
on public.faqs
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update faqs" on public.faqs;
create policy "Authenticated users can update faqs"
on public.faqs
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete faqs" on public.faqs;
create policy "Authenticated users can delete faqs"
on public.faqs
for delete
to authenticated
using (true);

insert into public.faqs (question, answer, sort_order, is_active)
values
  (
    '¿Qué medidas de seguridad toman?',
    $$A lo largo de los años de trayectoria de nuestra empresa, siempre nos hemos enfocado en diversas facetas del entretenimiento, y una de gran importancia es la seguridad de nuestros eventos y participantes. Para detallar de manera más precisa cada componente de seguridad, nos complace informarles sobre los servicios que ofrecemos en nuestros variados productos:

ASISTENCIA MÉDICA
En las discotecas, Pool Party, Campamento Americano y Parque acuático Zacarías incluye el servicio de ambulancia y personal paramédico permanente durante el evento.

EVENTOS PRIVADOS
Las discotecas, Pool Party y Campamento Americano están diseñados exclusivamente para estudiantes y egresados, y constituyen eventos privados. No se permite la entrada de personas no autorizadas al evento.

CONTROL DE ACCESO
En el caso de las discotecas y Pool Party, el ingreso está bajo la supervisión del coordinador designado por la empresa de viajes y nuestra portería. A ningún estudiante o egresado se le permitirá abandonar el establecimiento sin la debida autorización por parte de los responsables del grupo.$$,
    0,
    true
  ),
  (
    '¿Cómo puedo contratar un viaje de egresados o una gira de estudio con Camboriú Estudiantil?',
    $$Nuestra empresa opera exclusivamente a través de agencias de viajes autorizadas, que son las encargadas de comercializar nuestros programas de giras de estudio y viajes de egresados en cada país.

En nuestra página web, dentro de la sección Agencias, podrán encontrar el listado completo de las agencias que mantienen contrato vigente con nosotros. A través de ellas podrán recibir asesoramiento y acceder a las distintas propuestas disponibles, que incluyen vuelos, alojamiento, excursiones, actividades y eventos.

Es importante destacar que la disponibilidad para las temporadas de diciembre de 2026 y diciembre de 2027 es muy limitada, ya que gran parte de la capacidad hotelera ha sido reservada con anticipación por las agencias de viajes que trabajan con nuestra empresa.

Por este motivo, recomendamos realizar las consultas y reservas con la mayor anticipación posible para asegurar disponibilidad y acceder a las mejores opciones.

Para cualquier consulta, desde cualquier país, les recomendamos contactar a una de las agencias autorizadas que figuran en nuestra página web, quienes podrán brindar información actualizada sobre programas, disponibilidad y condiciones de contratación.$$,
    -1,
    true
  ),
  (
    '¿Puedo personalizar el itinerario?',
    'Sí, trabajamos con cada empresa para adaptar el viaje a sus necesidades específicas. Podemos modificar actividades, duración, presupuesto.',
    3,
    true
  ),
  (
    '¿Cuentan con oficina física?',
    'Sí, nos encontramos en el centro de la ciudad de Balneario Camboriú. Dirección: Av. Central, 151 - Centro, Balneário Camboriú - Ed. Washington, Piso 5, Sala 504 - SC.',
    4,
    true
  ),
  (
    '¿Cómo reservo?',
    'Camboriú Estudiantil no vende directamente al público. Para consultar programas, disponibilidad y condiciones de contratación, elegí una de las agencias autorizadas que figuran en la sección Agencias de nuestra página web.',
    5,
    true
  ),
  (
    'Vuelos y traslados, ¿están incluidos?',
    'No, no realizamos vuelos ni traslados internacionales. Sí contamos con la posibilidad de brindar servicio de traslado internos dentro del destino, desde aeropuertos hasta Balneario Camboriú o para la realización de actividades.',
    6,
    true
  )
on conflict (question) do update
set
  answer = excluded.answer,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
