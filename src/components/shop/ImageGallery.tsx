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
    <div className="flex flex-col-reverse lg:flex-row w-full gap-3 lg:gap-4 relative h-full">

      {/* Thumbnails Sidebar (Left on Desktop, Bottom on Mobile) */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-none w-full lg:w-[68px] shrink-0 pb-1 lg:pb-0 lg:max-h-[680px]">
          {images.map((img, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={cn(
                  "relative w-14 h-[72px] lg:w-full lg:h-[86px] shrink-0 rounded-xl overflow-hidden transition-all duration-200",
                  isActive
                    ? "ring-1 ring-black ring-offset-[3px] ring-offset-[#F2EDE4] opacity-100"
                    : "opacity-40 hover:opacity-70"
                )}
                aria-label={t('viewImage', { number: idx + 1 })}
              >
                <Image
                  src={img}
                  alt={t('thumbnailAlt', { number: idx + 1 })}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 56px, 68px"
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[680px] bg-cream-warm rounded-2xl overflow-hidden cursor-zoom-in group"
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
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
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
