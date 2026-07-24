'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2 } from 'lucide-react'

interface R2UploadButtonProps {
  folder: 'camboriu/attractions' | 'camboriu/clients'
  multiple?: boolean
  label: string
  helper?: string
  className?: string
  onUploaded: (url: string) => void
}

export function R2UploadButton({
  folder,
  multiple = false,
  label,
  helper,
  className = '',
  onUploaded,
}: R2UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFile(file: File) {
    const signResponse = await fetch('/api/admin/r2-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        folder,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      }),
    })

    const signed = await signResponse.json()
    if (!signResponse.ok) {
      throw new Error(signed.error || 'No se pudo preparar la subida.')
    }

    const uploadResponse = await fetch(signed.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })

    if (uploadResponse.ok) {
      onUploaded(signed.publicUrl)
      return
    }

    const fallbackData = new FormData()
    fallbackData.append('folder', folder)
    fallbackData.append('file', file)

    const fallbackResponse = await fetch('/api/admin/r2-upload/direct', {
      method: 'POST',
      body: fallbackData,
    })
    const fallback = await fallbackResponse.json()

    if (!fallbackResponse.ok) {
      throw new Error(fallback.error || 'No se pudo subir el archivo a Cloudflare R2.')
    }

    onUploaded(fallback.publicUrl)
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        await uploadFile(file)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
        <span>{uploading ? 'Subiendo...' : label}</span>
        {helper && !uploading && <span className="text-[11px] opacity-70">{helper}</span>}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
