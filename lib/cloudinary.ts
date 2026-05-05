import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export { cloudinary }

// ── Folders ──────────────────────────────────────────────────
export const CLOUDINARY_FOLDERS = {
  attractions: 'camboriu/attractions',
  clients:     'camboriu/clients',
} as const

// ── Delete an image from Cloudinary ─────────────────────────
export async function deleteCloudinaryImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting Cloudinary image:', error)
  }
}

// ── Extract public_id from Cloudinary URL ────────────────────
export function extractPublicId(url: string): string {
  // e.g. https://res.cloudinary.com/cloud_name/image/upload/v123/folder/image.jpg
  // → folder/image
  const parts = url.split('/')
  const uploadIndex = parts.indexOf('upload')
  if (uploadIndex === -1) return url
  // Skip version segment if present (v123456...)
  const afterUpload = parts.slice(uploadIndex + 1)
  const withoutVersion = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload
  const withoutExtension = withoutVersion.join('/').replace(/\.[^.]+$/, '')
  return withoutExtension
}

// ── Build optimized URL ───────────────────────────────────────
export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number } = {}
) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options.quality ?? 'auto',
    width:   options.width,
    height:  options.height,
    crop:    options.width || options.height ? 'fill' : undefined,
    gravity: 'auto',
  })
}
