'use client'

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
  date,
}: {
  slug: string
  title: string
  category: string
  excerpt: string
  imageSrc: string
  readTime: string
  date?: string
}) {
  return (
    <Link href={`/${slug}`} className="group flex flex-col bg-white rounded-[2rem] p-4 md:p-5 h-full border border-ink/5 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.5rem] mb-6 border border-ink/5 shrink-0">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-col flex-grow px-1 md:px-2 pb-2 relative z-10">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-ink text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {category}
          </span>
          <div className="flex items-center gap-3">
            {date && (
              <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {date}
              </span>
            )}
            <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime}
            </span>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold font-sans text-ink mb-4 group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-sm md:text-base text-ink/60 line-clamp-3 mt-auto leading-relaxed font-medium">
          {excerpt}
        </p>
        <div className="mt-8 flex items-center justify-between">
          <span className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-ink/10 text-xs font-bold text-ink group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300 gap-2 shadow-sm">
            Read article
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: title,
                  text: excerpt,
                  url: window.location.origin + '/' + slug,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.origin + '/' + slug);
                alert('Link copied to clipboard!');
              }
            }}
            className="p-2 bg-cream border border-ink/5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-ink/40 group-hover:border-primary/20 shrink-0"
            aria-label="Share article"
            title="Share article"
          >
            <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
