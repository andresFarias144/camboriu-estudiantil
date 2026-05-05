# Guía de Deploy en Vercel

## 1. Subir a GitHub (si no lo hiciste)

En la terminal, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Camboriu Estudiantil - Fase 1 completa"
git branch -M main
```

Después en github.com:
- Click en el "+" arriba a la derecha → "New repository"
- Nombre: `camboriu-estudiantil`
- Privado o público (a elección)
- NO marcar "Initialize with README"
- Click en "Create repository"

GitHub te muestra los comandos para conectar. Copiá y ejecutá los dos que dicen:

```bash
git remote add origin https://github.com/TU_USUARIO/camboriu-estudiantil.git
git push -u origin main
```

## 2. Deploy en Vercel

1. Ir a [vercel.com](https://vercel.com) → "Continue with GitHub"
2. Click en "Add New" → "Project"
3. Buscar `camboriu-estudiantil` → "Import"
4. **MUY IMPORTANTE:** Antes de hacer Deploy, expandir "Environment Variables" y cargar TODAS las variables de tu `.env.local`:

   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
   - NEXT_PUBLIC_WHATSAPP_NUMBER
   - NEXT_PUBLIC_SITE_URL (cambiar por la URL final de Vercel)

5. Click en **"Deploy"** → Vercel hace el build (1-3 minutos)

## 3. Configurar Cloudinary para producción

Una vez tengas la URL de Vercel (algo como `camboriu-estudiantil.vercel.app`):

1. Ir a Cloudinary → Settings → Upload presets
2. Editar `camboriu_unsigned` → en "Allowed origins" agregar:
   - `https://*.vercel.app`
   - Tu dominio final (cuando lo conectes)

## 4. Conectar dominio personalizado (opcional)

En Vercel:
1. Settings → Domains
2. Agregar `camboriuestudiantil.com`
3. Vercel te da los registros DNS para configurar
4. Configurar esos DNS en GoDaddy / NIC.ar / donde tengas el dominio
5. Esperar propagación (15 min - 24 hs)
6. SSL automático y gratis ✅
