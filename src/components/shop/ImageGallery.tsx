'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const t = useTranslations('shop.imageGallery')
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Embla for mobile swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setActiveIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = useCallback((index: number) => {
    setActiveIndex(index)
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    const img = e.currentTarget.querySelector('img')
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector('img')
    if (img) {
      img.style.transformOrigin = 'center center'
      // Reset scale is handled by CSS group-hover removing the scale class
    }
  }

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col-reverse w-full gap-3 lg:gap-4 relative h-full">

      {/* Thumbnails Row (Below Main Image on All Breakpoints) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2.5 overflow-x-auto scrollbar-none w-full shrink-0 p-2">
          {images.map((img, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "relative w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-full overflow-hidden transition-all duration-200 bg-white",
                  isActive
                    ? "ring-2 ring-black ring-offset-2 ring-offset-[#F2EDE4] opacity-100"
                    : "opacity-50 hover:opacity-80"
                )}
                aria-label={t('viewImage', { number: idx + 1 })}
              >
                <Image
                  src={img}
                  alt={t('thumbnailAlt', { number: idx + 1 })}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full max-w-[340px] mx-auto aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden cursor-zoom-in group"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative min-w-0 shrink-0 grow-0 basis-full h-full overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={img}
                alt={t('productViewAlt', { number: idx + 1 })}
                fill
                priority={idx === 0}
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/25 backdrop-blur-sm text-white rounded-full px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] pointer-events-none tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        )}
      </div>

    </div>
  )
}
