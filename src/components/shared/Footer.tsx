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
        {/* The Big Rounded Card */}
        <div className="bg-[#111111] rounded-[2.5rem] p-10 md:p-16 lg:p-24 relative overflow-hidden flex flex-col justify-between min-h-[500px] lg:min-h-[700px]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10 mb-32">
            
            {/* Left Brand Text */}
            <div className="lg:col-span-4 pr-8">
              <img src="/99 Images/99pp-Logo.png" alt="99 Purity Peptides Logo" className="h-16 lg:h-20 w-auto object-contain mb-8" />
              <h3 className="text-white text-2xl lg:text-3xl font-medium leading-tight tracking-tight">
                Join research laboratories and universities nationwide relying on 99PurityPeptides.
              </h3>
            </div>

            {/* Explore / Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-medium mb-6">Explore</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/medical-disclaimer" className="hover:text-white transition-colors">Medical Disclaimer</Link></li>
              </ul>
            </div>

            {/* Contact Pills */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-medium mb-6">Contact</h4>
              <div className="flex flex-col gap-3 items-start">
                <a href="mailto:orders@99puritypeptides.com" className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-white/10 rounded-full px-4 py-2 transition-colors w-fit group">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-white tracking-wide">orders@99puritypeptides.com</span>
                </a>
                <a href="mailto:support@99puritypeptides.com" className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-white/10 rounded-full px-4 py-2 transition-colors w-fit group">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-white tracking-wide">support@99puritypeptides.com</span>
                </a>
                <a href="tel:8437439007" className="flex items-center gap-3 bg-[#1a1a1a] hover:bg-white/10 rounded-full px-4 py-2 transition-colors w-fit group">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <span className="text-xs text-white tracking-wide">843 743 9007</span>
                </a>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="lg:col-span-3 flex flex-col">
              <Link href="/contact" className="group border-b border-white/5 pb-6 mb-6 block">
                <div className="flex justify-between items-center text-white mb-2">
                  <h3 className="text-xl font-medium text-primary transition-colors">Contact Us</h3>
                  <div className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowRight className="w-3 h-3 -rotate-45" />
                  </div>
                </div>
                <p className="text-gray-500 text-xs">Reach out to our support team</p>
              </Link>

              <Link href="/shop" className="group block">
                <div className="flex justify-between items-center text-white mb-2">
                  <h3 className="text-xl font-medium group-hover:text-white transition-colors">Shop Catalogue</h3>
                  <div className="w-6 h-6 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                    <ArrowRight className="w-3 h-3 -rotate-45" />
                  </div>
                </div>
                <p className="text-gray-500 text-xs">View all research peptides</p>
              </Link>
            </div>
          </div>

          {/* Bottom Massive Text */}
          <div className="absolute bottom-0 left-0 right-0 w-full translate-y-[28%] select-none pointer-events-none flex justify-center px-4">
            <h1 className="font-heading text-[clamp(4rem,12.5vw,260px)] w-full leading-none font-black text-white text-center tracking-tighter lowercase">
              99purity
            </h1>
          </div>
        </div>

        {/* Bottom Area Outside the Card */}
        <div className="mt-8 px-4 md:px-8 flex flex-col gap-6">
          <p className="text-gray-500 text-[10px] leading-relaxed max-w-6xl mx-auto text-center">
            <span className="font-bold text-gray-400 uppercase tracking-wider mr-2">Disclaimer:</span> 
            The content on this website has not been evaluated or approved by the U.S. Food and Drug Administration (FDA). Products sold by 99 Purity Peptides are offered for research and laboratory purposes only and are not intended to diagnose, treat, cure, or prevent any disease. 99 Purity Peptides is not a compounding pharmacy and does not operate as a chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act. Products are not for human or veterinary use, and are not intended for ingestion, injection, or any form of administration. Purity levels may vary by product and lot; certain items may test below 99% purity.
          </p>
          <div className="flex flex-col lg:flex-row justify-between items-center text-gray-500 text-[11px] font-medium pt-4 border-t border-white/5 pb-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4 lg:mb-0">
              <span className="text-gray-400">99Purity Peptides &copy; {new Date().getFullYear()}</span>
              <span className="hidden sm:inline">·</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              <span className="hidden sm:inline">·</span>
              <Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
            </div>
            <div className="flex items-center gap-2 text-center lg:text-right">
              <span>Designed & Developed by <a href="https://belkdigital.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-bold hover:text-primary transition-colors">Belk Digital</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const [footerHeight, setFooterHeight] = useState(0)
  const footerRef = useRef<HTMLElement>(null)

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

