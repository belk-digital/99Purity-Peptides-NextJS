import React from 'react'
import { FadeUp } from '@/components/motion/FadeUp'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Newsletter() {
  return (
    <section className="relative z-10 w-full py-32 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 z-0 bg-black">
        <Image 
          src="/99 Images/glow-on-velvet.webp" 
          alt="Dark Velvet Background" 
          fill 
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
      </div>

      <Container size="content" className="flex flex-col items-center text-center relative z-10">
        
        <FadeUp>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">
            STAY INFORMED
          </span>
        </FadeUp>
        
        <FadeUp delay={0.1}>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-6">
            Quiet updates.
          </h2>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <p className="text-white/70 text-lg max-w-lg leading-relaxed">
            New compounds and research notes — no marketing noise.
          </p>
        </FadeUp>
        
        <FadeUp delay={0.3} className="w-full">
          <form 
            action={async () => {
              'use server'
              // Server action stub for newsletter subscription
              console.log('Newsletter subscription stub')
            }}
            className="flex flex-col md:flex-row gap-3 max-w-md mx-auto mt-12 w-full"
          >
            <Input 
              type="email" 
              name="email"
              placeholder="your@email.com" 
              required
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
            />
            <Button type="submit" variant="default" size="md" className="shrink-0 w-full md:w-auto bg-primary text-black hover:bg-white hover:text-black font-bold tracking-widest uppercase text-xs">
              SUBSCRIBE
            </Button>
          </form>
        </FadeUp>
        
        <FadeUp delay={0.4}>
          <p className="text-xs font-medium tracking-wide text-white/40 mt-6 uppercase">
            Unsubscribe at any time.
          </p>
        </FadeUp>

      </Container>
    </section>
  )
}
