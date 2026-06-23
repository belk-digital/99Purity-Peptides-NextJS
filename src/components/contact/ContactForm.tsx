'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FluidButton } from '@/components/ui/fluid-button'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      // Reset after showing success message
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1500)
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-zinc-900 rounded-[2rem] md:rounded-[4rem] border border-white/10 overflow-visible text-left p-8 sm:p-12 md:p-16 mb-24 font-sans">
      
      {/* Glow / Noise inside the form container (optional premium feel) */}
      <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] overflow-hidden pointer-events-none z-0">
        <svg className="absolute inset-0 h-full w-full opacity-[0.1] mix-blend-screen">
          <filter id="form-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#form-noise)" />
        </svg>
      </div>

      <div className="relative z-10 mb-10 md:mb-16">
        <h3 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter text-white mb-3">Get in touch with us</h3>
        <p className="text-white/60 font-light text-base md:text-lg">Please complete the form below for non-advisory inquiries only.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6 w-full text-left pb-16 md:pb-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <label htmlFor="name" className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-white/50 pl-4">Name</label>
            <input 
              type="text" 
              id="name" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 backdrop-blur-sm"
              placeholder="John Doe"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-white/50 pl-4">Email</label>
            <input 
              type="email" 
              id="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 backdrop-blur-sm"
              placeholder="john@laboratory.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <label htmlFor="subject" className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-white/50 pl-4">Subject</label>
          <input 
            type="text" 
            id="subject" 
            required
            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 backdrop-blur-sm"
            placeholder="Order Inquiry"
          />
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <label htmlFor="message" className="text-xs font-mono tracking-[0.2em] uppercase font-bold text-white/50 pl-4">Message</label>
          <textarea 
            id="message" 
            required
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none backdrop-blur-sm"
            placeholder="How can we assist you today?"
          />
        </div>
      </form>

      {/* Bottom Right Cutout for Submit Button */}
      <div className="absolute -bottom-[1px] -right-[1px] w-fit bg-cream rounded-tl-[2rem] md:rounded-tl-[3.5rem] rounded-br-[2rem] md:rounded-br-[4rem] pointer-events-auto pl-5 sm:pl-6 md:pl-8 pt-4 sm:pt-5 md:pt-6 flex justify-center items-center z-20">
        
        {/* Top Fillet (Curves from Top to Left inside the form body) */}
        <div 
          className="absolute -top-[calc(2rem-1px)] md:-top-[calc(3rem-1px)] right-0 w-8 h-8 md:w-12 md:h-12 bg-contain bg-no-repeat pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
        />
        
        {/* Left Fillet (Curves from Left to Top inside the form body) */}
        <div 
          className="absolute bottom-0 -left-[calc(2rem-1px)] md:-left-[calc(3rem-1px)] w-8 h-8 md:w-12 md:h-12 bg-contain bg-no-repeat pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
        />

        <div className="relative z-10">
          <FluidButton 
            onClick={isSubmitting || isSubmitted ? undefined : () => handleSubmit()}
            text={<>{isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Submit Request'}</>} 
            className={isSubmitting || isSubmitted ? 'opacity-70' : ''}
          />
        </div>
      </div>

    </div>
  )
}
