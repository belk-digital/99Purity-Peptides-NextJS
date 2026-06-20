'use client'

import { ShoppingCart, Heart } from 'lucide-react'
import { useRef } from 'react'
import { useScroll, useTransform, motion, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const FALLBACK_PRODUCTS = [
  {
    name: "TB-500",
    categories: [{ title: "Muscle Repair" }],
    meta: { description: "Potent synthetic peptide researched for its role in cellular migration, actin regulation, and wound healing." },
    price: "55",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "tb-500",
  },
  {
    name: "BPC-157",
    categories: [{ title: "Recovery & Healing" }],
    meta: { description: "A highly purified synthetic peptide widely studied for its profound effects on tissue regeneration and angiogenesis." },
    price: "45",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "bpc-157",
  },
  {
    name: "Semaglutide",
    categories: [{ title: "Metabolic Research" }],
    meta: { description: "A GLP-1 receptor agonist actively researched for its mechanisms in glycemic control and metabolic regulation." },
    price: "85",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "semaglutide",
  },
  {
    name: "GHK-Cu",
    categories: [{ title: "Cellular Aging" }],
    meta: { description: "A naturally occurring copper complex peptide frequently studied for its role in collagen synthesis and anti-aging." },
    price: "35",
    images: [{ image: { url: "/99 Images/product-image.webp" } }],
    slug: "ghk-cu",
  }
]

export function BestSellerSection({ products = [] }: { products?: any[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Smooth the scroll progress to eliminate jank
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Increased values so the parallax triggers more noticeably
  const y1 = useTransform(smoothProgress, [0, 1], [80, -80])
  const y2 = useTransform(smoothProgress, [0, 1], [-80, 80])

  const getImageUrl = (prod: any) => prod.images?.[0]?.image?.url || '/99 Images/product-image.webp';

  // Use passed products or fallback to hardcoded ones if API is empty
  const sourceProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  // Ensure we have exactly 8 products to fill a 2-row, 4-column grid perfectly
  const displayProducts = sourceProducts.length >= 8 
    ? sourceProducts.slice(0, 8) 
    : [...sourceProducts, ...sourceProducts, ...sourceProducts, ...sourceProducts].slice(0, 8); // fallback loop

  return (
    <section ref={sectionRef} className="bg-cream py-24 md:py-32 font-sans relative z-30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] relative z-10">
        
        {/* Centered Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Most Popular</span>
          </div>
          <h2 className="font-heading text-5xl lg:text-7xl font-black text-ink leading-[0.9] tracking-tighter uppercase mb-6">
            Our Best Sellers.
          </h2>
          <p className="text-ink/70 text-lg leading-relaxed max-w-2xl mb-10">
            Browse our research-grade peptide reagents for assay development, receptor binding studies, and mechanistic research.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-ink border border-ink/20 hover:border-ink px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-colors hover:bg-white hover:shadow-sm">
            View All Products
          </Link>
        </div>

        {/* 4-Column Masonry/Staggered Grid with Parallax */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 justify-items-center">
          {displayProducts.map((product, idx) => {
            // Apply y1 to even columns (0, 2) and y2 to odd columns (1, 3)
            const isEvenColumn = idx % 2 === 0;
            // Also apply a very slight rotation to alternate cards to give the "slant way" funky look
            const rotationClass = isEvenColumn ? '-rotate-1' : 'rotate-1';
            
            return (
              <motion.div 
                key={idx}
                style={{ y: isEvenColumn ? y1 : y2 }}
                className="w-full max-w-[380px] will-change-transform"
              >
                {/* CSS Transition wrapped element MUST be separate from motion.div */}
                <div className={`w-full h-full bg-white rounded-[20px] sm:rounded-[32px] p-2 sm:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-ink/5 group cursor-pointer relative origin-center transition-all duration-500 hover:rotate-0 hover:z-30 hover:shadow-2xl hover:-translate-y-2 ${rotationClass}`}>
                  <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20" aria-label={`View ${product.name}`} />
                  
                  {/* Top Text Content & Wishlist */}
                  <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-5 flex flex-col gap-1.5 sm:gap-3 relative">
                    <div className="absolute top-3 sm:top-5 right-3 sm:right-5 z-30">
                      <button className="text-ink/30 hover:text-red-500 hover:scale-110 transition-all duration-300">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="pr-6 sm:pr-8">
                      <h3 className="text-sm sm:text-2xl font-semibold text-ink tracking-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-primary text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 sm:mt-1">
                        {product.categories?.[0]?.title || 'Research Peptide'}
                      </p>
                    </div>
                    <p className="text-ink/60 text-[9px] sm:text-[13px] leading-tight sm:leading-relaxed line-clamp-2">
                      {product.meta?.description || 'Highly purified synthetic peptide prepared for rigorous laboratory research.'}
                    </p>
                  </div>

                  {/* Inner Image Container */}
                  <div className="relative w-full aspect-[4/5] rounded-[14px] sm:rounded-[24px] overflow-hidden bg-ink/5">
                    <Image 
                      src={getImageUrl(product)}
                      alt={`${product.name} Best Seller`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Price */}
                    <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10">
                      <span className="text-white text-lg sm:text-3xl font-light tracking-tighter">
                        ${product.price}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110 z-10 hover:bg-ink hover:text-white">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-current transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
