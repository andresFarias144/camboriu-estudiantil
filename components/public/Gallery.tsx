'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Cerrar con Escape, navegar con flechas
  useEffect(() => {
    if (openIndex === null) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i! + 1) % images.length)
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i! - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)

    // Bloquear scroll del body cuando está abierto
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, images.length])

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Grid de thumbnails */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            style={{
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={url}
              alt={`${alt} ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          onClick={() => setOpenIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpenIndex(null)
            }}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.1)',
              border: '0.5px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              zIndex: 10,
            }}
          >
            <X size={20} />
          </button>

          {/* Contador */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 500,
            }}
          >
            {openIndex + 1} / {images.length}
          </div>

          {/* Botón anterior */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((openIndex - 1 + images.length) % images.length)
              }}
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: '0.5px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Imagen principal */}
          <img
            src={images[openIndex]}
            alt={`${alt} ${openIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />

          {/* Botón siguiente */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((openIndex + 1) % images.length)
              }}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: '0.5px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}