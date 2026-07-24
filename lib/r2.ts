import { S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

export function getR2Client() {
  const endpoint =
    process.env.R2_ENDPOINT ||
    (process.env.R2_ACCOUNT_ID
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined)

  if (!endpoint || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('Faltan variables de entorno de Cloudflare R2.')
  }

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  })
}

export function getR2Bucket() {
  const bucket = process.env.R2_BUCKET
  if (!bucket) throw new Error('Falta R2_BUCKET.')
  return bucket
}

export function getR2PublicUrl(key: string) {
  const baseUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  if (!baseUrl) throw new Error('Falta R2_PUBLIC_URL o NEXT_PUBLIC_R2_PUBLIC_URL.')
  return `${baseUrl.replace(/\/$/, '')}/${key.split('/').map(encodeURIComponent).join('/')}`
}

export function buildR2Key(folder: string, fileName: string) {
  const safeFolder = folder
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, '-'))
    .join('/')

  const safeName = fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const unique = randomUUID()

  return `${safeFolder}/${year}/${month}/${unique}-${safeName || 'archivo'}`
}
