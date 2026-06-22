'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { FluidButton } from '@/components/ui/fluid-button'

const FooterContent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  
  const lenis = useLenis();

  const handleScrollToTop = () => {
    if (lenis) {
      // Use an exponential ease-out curve for buttery smooth deceleration
      lenis.scrollTo(0, { 
        duration: 2, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050505] w-full relative z-30 font-sans border-t border-white/5 overflow-hidden text-white">

      {/* Pre-Footer CTA - Staggered Gallery Design */}
      <div ref={sectionRef} className="relative overflow-hidden bg-[#050505] border-b border-white/5 pt-24 pb-0 flex flex-col items-center">
        
        {/* Top Text Section */}
        <div className="container relative z-20 mx-auto px-4 max-w-4xl text-center flex flex-col items-center gap-6 mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Ready to elevate your research.<br className="hidden md:block" /> Explore our complete catalogue.
          </h2>
          <div className="mt-4">
            <FluidButton 
              href="/shop" 
              text="Explore Catalogue" 
              variant="white"
            />
          </div>
        </div>

        {/* Staggered Image Gallery */}
        <div className="w-full relative z-10 flex items-end justify-center gap-2 sm:gap-4 px-2 sm:px-4 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
          
          <motion.div 
            initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0 }} viewport={{ once: true }}
            className="relative w-1/5 max-w-[250px] h-[60%] shrink-0"
          >
            <img src="/99 Images/category-1.webp" alt="Category" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          
          <motion.div 
            initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}
            className="relative w-1/5 max-w-[280px] h-[80%] shrink-0 z-10"
          >
            <img src="/99 Images/vial-closeup.webp" alt="Vial" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          
          <motion.div 
            initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            className="relative w-1/4 max-w-[350px] h-[100%] shrink-0 z-20"
          >
            <img src="/99 Images/vial-ice-closeup.webp" alt="Vial on Ice" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          
          <motion.div 
            initial={{ y: 120, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}
            className="relative w-1/5 max-w-[280px] h-[75%] shrink-0 z-10"
          >
            <img src="/99 Images/purity.webp" alt="Purity" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          
          <motion.div 
            initial={{ y: 90, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}
            className="relative w-1/5 max-w-[250px] h-[65%] shrink-0"
          >
            <img src="/99 Images/identity.webp" alt="Identity" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
          </motion.div>
          
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 pb-12 max-w-[1920px] pt-8 md:pt-16 relative z-20">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative z-10 mb-6">
            
          {/* Card 1: Brand & Logo */}
          <div 
            className="bg-[#002222] rounded-[2rem] p-8 md:p-10 flex flex-col justify-between h-full ring-1 ring-inset ring-white/10 group relative overflow-hidden shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Smooth Edge Cutout (Bottom Right) */}
            <div className="flex absolute -bottom-[2px] -right-[2px] w-[88px] h-[88px] bg-[#050505] rounded-tl-[2rem] items-center justify-center z-30 pointer-events-auto">
              <div 
                className="absolute -top-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              <div 
                className="absolute bottom-0 -left-[1.5rem] w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              
              <button 
                onClick={handleScrollToTop}
                title="Scroll to top"
                className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 translate-x-1 translate-y-1 hover:-translate-y-0 group/btn"
              >
                <ArrowRight className="w-5 h-5 -rotate-90 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            
            <img src="/99 Images/99pp-Logo.png" alt="99 Purity Peptides Logo" className="h-14 md:h-16 w-auto object-contain mb-12 relative z-10 self-start transition-transform duration-500 group-hover:scale-105" />

            <div className="pr-20 relative z-10">
              <h3 className="text-white text-lg md:text-xl font-medium leading-relaxed tracking-wide">
                Join research laboratories and universities nationwide relying on <span className="font-bold">99PurityPeptides.</span>
              </h3>
            </div>
          </div>

          {/* Card 2: Explore */}
          <div 
            className="bg-cream rounded-[2rem] p-8 md:p-10 flex flex-col h-full ring-1 ring-inset ring-black/5 shadow-md hover:shadow-lg transition-all duration-500 relative overflow-hidden"
          >
            {/* Smooth Edge Cutout (Right Edge Center) */}
            <div className="flex absolute top-1/2 -translate-y-1/2 -right-[2px] w-[64px] h-[96px] bg-[#050505] rounded-l-[2rem] items-center justify-center z-30 pointer-events-auto">
              <div 
                className="absolute -top-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              <div 
                className="absolute -bottom-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 H 100 V 100 A 100 100 0 0 0 0 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              
              <Link href="/shop" title="Shop" className="w-10 h-10 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 translate-x-1 group/btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="m2 7 4.42-4.42a2 2 0 0 1 2.83 0l8.34 8.34a2 2 0 0 1 0 2.83L13.17 18.17a2 2 0 0 1-2.83 0L2 9.83V7z"/><path d="M7 7h.01"/></svg>
              </Link>
            </div>
            
            <div className="pr-14 md:pr-12 w-full">
              <h4 className="text-ink font-bold tracking-[0.15em] uppercase text-xs mb-4">Explore</h4>
              <ul className="w-full flex flex-col">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About', href: '/about' },
                  { label: 'Shop', href: '/shop' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Peptide Calculator', href: '/calculator' },
                  { label: 'Affiliates', href: '/affiliates' }
                ].map((item) => (
                  <li key={item.label} className="w-full">
                    <Link href={item.href} className="group block py-2 border-b border-black/[0.04] last:border-0 relative z-10 transition-transform duration-300 hover:translate-x-1">
                      <div className="flex justify-between items-center text-ink w-full">
                        <span className="text-[15px] font-bold group-hover:text-primary transition-colors tracking-tight">
                          {item.label}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-black/[0.04] text-ink flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                          <ArrowRight className="w-3 h-3 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Contact */}
          <div 
            className="bg-cream rounded-[2rem] p-8 md:p-10 flex flex-col h-full ring-1 ring-inset ring-black/5 shadow-md hover:shadow-lg transition-all duration-500 relative overflow-hidden"
          >
            {/* Smooth Edge Cutout (Right Edge Center) */}
            <div className="flex absolute top-1/2 -translate-y-1/2 -right-[2px] w-[64px] h-[96px] bg-[#050505] rounded-l-[2rem] items-center justify-center z-30 pointer-events-auto">
              <div 
                className="absolute -top-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 100 0 V 100 H 0 A 100 100 0 0 0 100 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              <div 
                className="absolute -bottom-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 H 100 V 100 A 100 100 0 0 0 0 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              
              <a href="mailto:support@99puritypeptides.com" title="Email Support" className="w-10 h-10 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 translate-x-1 group/btn">
                <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </a>
            </div>

            <div className="pr-14">
              <h4 className="text-ink font-bold tracking-[0.15em] uppercase text-xs mb-8">Contact</h4>
              <div className="flex flex-col gap-5 items-start">
                <a href="mailto:orders@99puritypeptides.com" className="flex items-center gap-4 hover:bg-black/[0.03] rounded-2xl p-2 -ml-2 transition-colors group w-full">
                  <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/[0.05] flex items-center justify-center text-ink-muted group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0 group-hover:scale-110">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-ink font-semibold tracking-wide truncate">orders@99puritypeptides.com</span>
                </a>
                <a href="mailto:support@99puritypeptides.com" className="flex items-center gap-4 hover:bg-black/[0.03] rounded-2xl p-2 -ml-2 transition-colors group w-full">
                  <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/[0.05] flex items-center justify-center text-ink-muted group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0 group-hover:scale-110">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-ink font-semibold tracking-wide truncate">support@99puritypeptides.com</span>
                </a>
                <a href="tel:8437439007" className="flex items-center gap-4 hover:bg-black/[0.03] rounded-2xl p-2 -ml-2 transition-colors group w-full">
                  <div className="w-10 h-10 rounded-full bg-black/[0.04] border border-black/[0.05] flex items-center justify-center text-ink-muted group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0 group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span className="text-[11px] sm:text-xs text-ink font-semibold tracking-wide">843 743 9007</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 4: Actions */}
          <div 
            className="bg-cream rounded-[2rem] p-8 md:p-10 flex flex-col justify-center h-full ring-1 ring-inset ring-black/5 relative overflow-hidden group shadow-md hover:shadow-lg transition-all duration-500"
          >
            {/* Smooth Edge Cutout (Top Right Corner) */}
            <div className="flex absolute -top-[2px] -right-[2px] w-[88px] h-[88px] bg-[#050505] rounded-bl-[2rem] items-center justify-center z-30 pointer-events-auto">
              <div 
                className="absolute top-0 -left-[1.5rem] w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 H 100 V 100 A 100 100 0 0 0 0 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              <div 
                className="absolute -bottom-[1.5rem] right-0 w-6 h-6 bg-contain bg-no-repeat pointer-events-none" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M 0 0 H 100 V 100 A 100 100 0 0 0 0 0 Z' fill='%23050505'/%3E%3C/svg%3E")` }} 
              />
              
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Follow us on Instagram" className="w-12 h-12 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative z-10 translate-x-1 -translate-y-1 group/btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>

            <div className="pr-16 pt-16 md:pr-14 md:pt-4">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <Link href="/contact" className="group/btn border-b border-black/[0.04] pb-6 mb-6 block relative z-10 transition-transform duration-300 hover:translate-x-2">
                <div className="flex justify-between items-center text-ink mb-1">
                  <h3 className="text-xl md:text-2xl font-bold group-hover/btn:text-primary transition-colors tracking-tight">Contact Us</h3>
                  <div className="w-10 h-10 rounded-full bg-black/[0.04] text-ink flex items-center justify-center transition-all duration-500 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:scale-110">
                    <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-500 group-hover/btn:rotate-0" />
                  </div>
                </div>
                <p className="text-ink/60 text-xs sm:text-sm font-medium">Reach out to our support team</p>
              </Link>

              <Link href="/shop" className="group/btn block relative z-10 transition-transform duration-300 hover:translate-x-2">
                <div className="flex justify-between items-center text-ink mb-1">
                  <h3 className="text-xl md:text-2xl font-bold group-hover/btn:text-primary transition-colors tracking-tight">Shop Catalogue</h3>
                  <div className="w-10 h-10 rounded-full bg-black/[0.04] text-ink flex items-center justify-center transition-all duration-500 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:scale-110">
                    <ArrowRight className="w-4 h-4 -rotate-45 transition-transform duration-500 group-hover/btn:rotate-0" />
                  </div>
                </div>
                <p className="text-ink/60 text-xs sm:text-sm font-medium">View all research peptides</p>
              </Link>
            </div>
          </div>

        </div>

        {/* Full-width Brand Name Card */}
        <div className="bg-cream rounded-[1.5rem] md:rounded-[2rem] h-[10vw] sm:h-[11vw] md:h-[11.5vw] lg:h-[12vw] xl:h-[12.5vw] relative overflow-hidden border border-primary/10 flex justify-center items-start shadow-sm w-full">
          <h1 className="relative z-20 pt-[2vw] sm:pt-[1.5vw] font-heading text-[12.5vw] sm:text-[13.5vw] md:text-[14vw] lg:text-[14.5vw] xl:text-[15vw] leading-[0.8] font-black text-primary/15 text-center tracking-tighter lowercase select-none w-full whitespace-nowrap px-4">
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

