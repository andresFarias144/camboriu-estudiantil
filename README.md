# Camboriu Estudiantil — Setup Guide

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Imágenes | Cloudinary |
| i18n | next-intl (ES / PT) |
| Estilos | Tailwind CSS |
| Deploy | Vercel |
| PWA | next-pwa (Fase 2) |

---

## Paso 1 — Clonar e instalar

```bash
git clone https://github.com/tu-usuario/camboriu-estudiantil.git
cd camboriu-estudiantil
npm install
cp .env.example .env.local
```

---

## Paso 2 — Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) → **New project**
2. Nombre del proyecto: `camboriu-estudiantil`
3. Elegir región: **South America (São Paulo)**
4. Anotar la contraseña de la base de datos (guardarla en lugar seguro)

### Ejecutar el schema

1. En el dashboard de Supabase → **SQL Editor**
2. Copiar el contenido de `supabase/schema.sql`
3. Ejecutar → esto crea las tablas, políticas RLS y datos de ejemplo

### Obtener las credenciales

- Ir a **Settings → API**
- Copiar `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copiar `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copiar `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Crear el usuario admin

1. En Supabase → **Authentication → Users → Add user**
2. Email: `admin@camboriuestudiantil.com`
3. Password: (elegir una contraseña segura)
4. Ese mismo email va en `ADMIN_EMAIL` del `.env.local`

---

## Paso 3 — Configurar Cloudinary

1. Ir a [cloudinary.com](https://cloudinary.com) → crear cuenta gratuita
2. En el **Dashboard** copiar:
   - Cloud name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

### Crear el Upload Preset (para subidas desde el frontend)

1. **Settings → Upload → Upload presets → Add upload preset**
2. Nombre: `camboriu_unsigned`
3. Signing mode: **Unsigned** ← importante
4. Folder: `camboriu`
5. Guardar → copiar el nombre en `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## Paso 4 — Variables de entorno

Completar `.env.local` con todos los valores obtenidos:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=camboriu_unsigned

NEXT_PUBLIC_WHATSAPP_NUMBER=5547992816769
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Paso 5 — Correr en desarrollo

```bash
npm run dev
```

- Sitio público: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Login admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## Paso 6 — Deploy en Vercel

1. Push al repositorio de GitHub
2. Ir a [vercel.com](https://vercel.com) → **Add new project** → importar el repo
3. En **Environment Variables** agregar todas las variables del `.env.local`
4. Deploy → Vercel hace build automático en cada push a `main`

### Configurar dominio personalizado en Vercel

1. **Settings → Domains → Add domain**
2. Agregar `camboriuestudiantil.com`
3. Seguir las instrucciones para configurar DNS

---

## Estructura del proyecto

```
camboriu-estudiantil/
├── app/
│   ├── [locale]/              # Sitio público con i18n
│   │   ├── page.tsx           # Home
│   │   ├── destinos/          # Lista + detalle de atracciones
│   │   └── clientes/          # Página de agencias
│   ├── admin/                 # Panel de administración (protegido)
│   │   ├── login/             # Login del admin
│   │   ├── atracciones/       # CRUD de atracciones
│   │   └── clientes/          # CRUD de clientes
│   └── api/                   # API routes (si se necesitan)
├── components/
│   ├── admin/                 # Componentes del panel admin
│   └── public/                # Componentes del sitio público
├── lib/
│   ├── supabase/              # Cliente Supabase (browser + server)
│   ├── cloudinary.ts          # Config y helpers de Cloudinary
│   └── types.ts               # TypeScript types
├── messages/
│   ├── es.json                # Traducciones español
│   └── pt.json                # Traducciones portugués
├── supabase/
│   └── schema.sql             # Schema completo de la base de datos
├── middleware.ts              # Protección de rutas admin + i18n
├── next.config.mjs            # Config Next.js
├── tailwind.config.js         # Config Tailwind con colores de marca
└── .env.example               # Variables de entorno de referencia
```

---

## URLs del panel admin

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con resumen |
| `/admin/login` | Login de administrador |
| `/admin/atracciones` | Lista de atracciones |
| `/admin/atracciones/nueva` | Crear nueva atracción |
| `/admin/atracciones/[id]` | Editar atracción |
| `/admin/clientes` | Lista de agencias |
| `/admin/clientes/nuevo` | Crear nueva agencia |
| `/admin/clientes/[id]` | Editar agencia |
| `/admin/consultas` | Ver consultas recibidas |

---

## Bilingüismo (ES / PT)

El idioma se controla por:
- Prefijo de URL: `/` (español, default) y `/pt/` (portugués)
- Toggle en la navbar cambia de idioma manteniendo la página actual
- Todos los textos de UI están en `messages/es.json` y `messages/pt.json`
- El contenido de atracciones tiene campos duplicados: `title` / `title_pt`, `description` / `description_pt`

---

## Notas importantes

- **RLS activo**: Los usuarios no autenticados solo ven registros con `is_active = true`
- **Admin**: Para acceder al panel hay que estar autenticado en Supabase Auth
- **Cloudinary**: Las imágenes se suben directamente desde el navegador usando un preset unsigned (seguro para el frontend)
- **Slug**: Se auto-genera desde el título al crear, pero se puede editar manualmente
