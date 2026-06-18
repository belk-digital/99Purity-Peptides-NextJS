'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'

const FooterContent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <footer className="bg-[#050505] w-full relative z-30 font-sans border-t border-white/5 overflow-hidden text-white">

      {/* Pre-Footer CTA */}
      <div ref={sectionRef} className="relative border-b border-white/5 overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-50"
          style={{ 
            backgroundImage: `url('/99 Images/vial-closeup.webp')`,
            y
          }}
        />
        
        <div className="container relative z-10 mx-auto px-4 md:px-10 pt-16 md:pt-24 pb-32 md:pb-48 max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-[2.5rem] py-10 px-6 md:py-16 md:px-16 relative overflow-hidden max-w-5xl mx-auto shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
          >
            {/* Subtle inner top glow for glass edge */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center">
              <div className="max-w-3xl">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.1] tracking-tight uppercase mb-4 w-full">
                  <span className="block whitespace-nowrap">Ready to elevate</span>
                  <span className="block whitespace-nowrap">your research?</span>
                </h2>
                <p className="text-gray-400 text-base md:text-lg mx-auto max-w-2xl">
                  Join our private newsletter to receive exclusive access to new syntheses, batch reports, and priority stock alerts.
                </p>
              </div>

              <div className="w-full max-w-md mx-auto relative flex items-center shrink-0">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white text-black placeholder:text-black/80 rounded-full pl-6 pr-40 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full font-medium"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-black hover:bg-gray-900 text-white font-bold px-6 rounded-full flex items-center justify-center gap-2 transition-colors uppercase tracking-wider text-xs z-10 shadow-sm">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 pb-12 max-w-[1920px] -mt-20 md:-mt-32 relative z-20">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10 mb-6">
            
          {/* Card 1: Brand & Logo */}
          <div className="bg-[#0A2E35] rounded-[2rem] p-8 md:p-12 flex flex-col justify-between h-full border border-white/5 group relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <img src="/99 Images/99pp-Logo.png" alt="99 Purity Peptides Logo" className="h-16 md:h-20 w-auto object-contain mb-12 relative z-10 self-start" />

            <h3 className="text-white text-xl lg:text-2xl font-medium leading-tight tracking-tight relative z-10">
              Join research laboratories and universities nationwide relying on 99PurityPeptides.
            </h3>
          </div>

          {/* Card 2: Explore */}
          <div className="bg-cream rounded-[2rem] p-8 md:p-12 flex flex-col h-full border border-ink/5 shadow-sm">
            <h4 className="text-ink font-bold tracking-widest uppercase text-xs mb-8">Explore</h4>
            <ul className="space-y-4 text-ink-muted text-sm font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> About</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Shop</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> FAQ</Link></li>
            </ul>
          </div>

          {/* Card 3: Contact */}
          <div className="bg-cream rounded-[2rem] p-8 md:p-12 flex flex-col h-full border border-ink/5 shadow-sm">
            <h4 className="text-ink font-bold tracking-widest uppercase text-xs mb-8">Contact</h4>
            <div className="flex flex-col gap-4 items-start">
              <a href="mailto:orders@99puritypeptides.com" className="flex items-center gap-4 hover:bg-ink/5 rounded-2xl p-2 -ml-2 transition-colors group w-full">
                <div className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink-muted group-hover:text-primary group-hover:border-primary/30 transition-colors shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] sm:text-xs text-ink font-medium tracking-wide break-all">orders@99puritypeptides.com</span>
              </a>
              <a href="mailto:support@99puritypeptides.com" className="flex items-center gap-4 hover:bg-ink/5 rounded-2xl p-2 -ml-2 transition-colors group w-full">
                <div className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink-muted group-hover:text-primary group-hover:border-primary/30 transition-colors shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] sm:text-xs text-ink font-medium tracking-wide break-all">support@99puritypeptides.com</span>
              </a>
              <a href="tel:8437439007" className="flex items-center gap-4 hover:bg-ink/5 rounded-2xl p-2 -ml-2 transition-colors group w-full">
                <div className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink-muted group-hover:text-primary group-hover:border-primary/30 transition-colors shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span className="text-xs text-ink font-medium tracking-wide">843 743 9007</span>
              </a>
            </div>
          </div>

          {/* Card 4: Actions */}
          <div className="bg-cream rounded-[2rem] p-8 md:p-12 flex flex-col justify-center h-full border border-ink/5 relative overflow-hidden group shadow-sm">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Link href="/contact" className="group/btn border-b border-ink/10 pb-8 mb-8 block relative z-10">
              <div className="flex justify-between items-center text-ink mb-2">
                <h3 className="text-2xl font-medium group-hover/btn:text-primary transition-colors">Contact Us</h3>
                <div className="w-10 h-10 rounded-full bg-ink/5 text-ink flex items-center justify-center transition-all group-hover/btn:bg-primary group-hover/btn:text-white">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </div>
              </div>
              <p className="text-ink-muted text-sm">Reach out to our support team</p>
            </Link>

            <Link href="/shop" className="group/btn block relative z-10">
              <div className="flex justify-between items-center text-ink mb-2">
                <h3 className="text-2xl font-medium group-hover/btn:text-primary transition-colors">Shop Catalogue</h3>
                <div className="w-10 h-10 rounded-full bg-ink/5 text-ink flex items-center justify-center transition-all group-hover/btn:bg-primary group-hover/btn:text-white">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </div>
              </div>
              <p className="text-ink-muted text-sm">View all research peptides</p>
            </Link>
          </div>

        </div>

        {/* Full-width Brand Name Card */}
        <div className="bg-cream rounded-[2rem] h-40 md:h-56 relative overflow-hidden border border-ink/5 flex justify-center items-center shadow-sm w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none z-10" />
          <h1 className="absolute bottom-0 translate-y-[40%] font-heading text-[12vw] leading-none font-black text-ink/[0.04] text-center tracking-tighter lowercase select-none w-full whitespace-nowrap overflow-hidden">
            99purity
          </h1>
        </div>

        {/* Bottom Area Outside the Card */}
        <div className="mt-8 px-4 md:px-8 flex flex-col gap-6 relative z-10">
          <p className="text-cream/70 text-[10px] leading-relaxed max-w-6xl mx-auto text-center">
            <span className="font-bold text-cream uppercase tracking-wider mr-2">Disclaimer:</span> 
            The content on this website has not been evaluated or approved by the U.S. Food and Drug Administration (FDA). Products sold by 99 Purity Peptides are offered for research and laboratory purposes only and are not intended to diagnose, treat, cure, or prevent any disease. 99 Purity Peptides is not a compounding pharmacy and does not operate as a chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act. Products are not for human or veterinary use, and are not intended for ingestion, injection, or any form of administration. Purity levels may vary by product and lot; certain items may test below 99% purity.
          </p>
          <div className="flex flex-col lg:flex-row justify-between items-center text-cream/70 text-[11px] font-medium pt-4 border-t border-cream/10 pb-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-0">
              <span className="text-cream/90">99Purity Peptides &copy; {new Date().getFullYear()}</span>
              <span className="hidden sm:inline">·</span>
              <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/refund" className="hover:text-cream transition-colors">Refund Policy</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/shipping" className="hover:text-cream transition-colors">Shipping Policy</Link>
            </div>
            <div className="flex items-center gap-2 text-center lg:text-right">
              <span>Designed & Developed by <a href="https://belkdigital.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold hover:text-primary transition-colors">Belk Digital</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const [footerHeight, setFooterHeight] = useState(0)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      setFooterHeight(entries[0].contentRect.height)
    })
    resizeObserver.observe(footerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div ref={footerRef} className="w-full relative z-40 bg-black print:hidden" style={{ pointerEvents: 'auto' }}>
      <FooterContent />
    </div>
  )
}

