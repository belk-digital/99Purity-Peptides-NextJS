import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function BlogPostCard({
  slug,
  title,
  category,
  excerpt,
  imageSrc,
  readTime,
}: {
  slug: string
  title: string
  category: string
  excerpt: string
  imageSrc: string
  readTime: string
}) {
  return (
    <Link href={`/journal/${slug}`} className="group flex flex-col bg-white rounded-[2rem] p-4 md:p-6 h-full border border-ink/5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] mb-6 md:mb-8 border border-ink/5">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col flex-grow px-2 md:px-4 pb-2 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono px-3 py-1 bg-cream-warm border border-ink/5 text-ink/70 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
            {category}
          </span>
          <span className="font-mono text-[10px] md:text-xs text-ink/40 font-bold uppercase tracking-[0.2em]">{readTime}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black font-heading text-ink mb-4 group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-sm md:text-base text-ink/70 line-clamp-3 mt-auto leading-relaxed font-medium">
          {excerpt}
        </p>
        <div className="mt-8 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-ink/40 group-hover:text-primary transition-colors duration-500">
          Read Article <span className="transform group-hover:translate-x-1 transition-transform duration-500">→</span>
        </div>
      </div>
    </Link>
  )
}
