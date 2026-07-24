import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'
import { buildR2Key, getR2Bucket, getR2Client, getR2PublicUrl } from '../../../../lib/r2'
import { createClient } from '../../../../lib/supabase/server'

const allowedFolders = new Set(['camboriu/attractions', 'camboriu/clients'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const { fileName, contentType, folder } = await request.json()

  if (!fileName || !contentType || !folder || !allowedFolders.has(folder)) {
    return NextResponse.json({ error: 'Datos de subida inválidos.' }, { status: 400 })
  }

  if (!String(contentType).startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes.' }, { status: 400 })
  }

  const key = buildR2Key(folder, fileName)
  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: key,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  })

  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 300 })

  return NextResponse.json({
    key,
    uploadUrl,
    publicUrl: getR2PublicUrl(key),
  })
}
