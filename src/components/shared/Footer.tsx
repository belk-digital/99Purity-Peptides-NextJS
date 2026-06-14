'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'

const FooterContent = () => {
  return (
    <footer className="bg-[#050505] w-full relative z-30 font-sans border-t border-white/5 overflow-hidden text-white">

      {/* Pre-Footer CTA */}
      <div className="relative border-b border-white/5 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 pointer-events-none opacity-30"
          style={{ 
            backgroundImage: `url('https://res.cloudinary.com/dgrrovta3/image/upload/v1781300102/ChatGPT_Image_Jun_11_2026_09_09_54_PM_zvfy8c.png')`
          }}
        />
        
        <div className="container relative z-10 mx-auto px-4 md:px-10 py-16 md:py-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-black/60 backdrop-blur-md border border-white/5 rounded-3xl py-8 px-6 md:py-12 md:px-16 relative overflow-hidden max-w-5xl mx-auto shadow-2xl"
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center">
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
      <div className="container mx-auto px-4 md:px-10 pt-24 pb-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="md:col-span-2">
            <div className="font-heading text-2xl font-black text-white tracking-tight uppercase mb-6 flex items-center gap-3">
              <svg viewBox="0 0 200 300" className="w-6 h-6 sm:w-8 sm:h-auto fill-[#d90429]">
                <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
              </svg>
              SPARTA LABS
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
              Precision-engineered peptides synthesized for absolute clarity. Supplying the world's most demanding independent researchers and private laboratories.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-6">Catalogue</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">GLP-1 Agonists</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Growth Hormone</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">BPC / TB-500</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Cosmetic Peptides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-[10px] mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Return Policy</Link></li>
              <li><Link href="/certificates" className="hover:text-primary transition-colors">Independent COAs</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Sparta Labs. All rights reserved. Not for human consumption.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Giant Typography Watermark */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none mt-10 flex justify-center pb-12">
        <h1 className="font-heading text-[14vw] sm:text-[16vw] font-black text-[#d90429] text-center uppercase tracking-tighter whitespace-nowrap px-4">
          SPARTA
        </h1>
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

