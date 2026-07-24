import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { buildR2Key, getR2Bucket, getR2Client, getR2PublicUrl } from '../../../../../lib/r2'
import { createClient } from '../../../../../lib/supabase/server'

const allowedFolders = new Set(['camboriu/attractions', 'camboriu/clients'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const folder = String(formData.get('folder') || '')

  if (!(file instanceof File) || !allowedFolders.has(folder)) {
    return NextResponse.json({ error: 'Datos de subida inválidos.' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes.' }, { status: 400 })
  }

  const key = buildR2Key(folder, file.name)
  const body = Buffer.from(await file.arrayBuffer())

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )

  return NextResponse.json({
    key,
    publicUrl: getR2PublicUrl(key),
  })
}
