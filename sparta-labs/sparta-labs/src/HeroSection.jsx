import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Menu, ShoppingCart, X } from 'lucide-react';

export default function HeroSection({ isScrolled }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navLinks = [
    'SHOP', 'CATEGORIES', 'CALCULATOR', 'ABOUT', 'JOURNAL', 'FAQ', 'CONTACT', 'AFFILIATES'
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
      >
        <source src="https://res.cloudinary.com/dgrrovta3/video/upload/v1781206084/Sparta_Hero_video_etnndz.mp4" type="video/mp4" />
      </video>

      {/* Navigation Layer */}
      <motion.div 
        animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 flex items-center justify-between px-3 sm:px-6 md:px-12 py-4 sm:py-6 w-full text-white"
      >
        
        {/* Left Section: Hamburger Menu */}
        <div className="flex-1 flex justify-start">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-white hover:text-gray-300 transition-colors p-2 -ml-2"
          >
            <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center shrink-0 space-x-1.5 sm:space-x-2">
          {/* Helmet SVG */}
          <svg viewBox="0 0 200 300" className="w-5 h-5 sm:w-8 sm:h-auto fill-white">
            <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
          </svg>
          <span className="text-xs sm:text-base tracking-widest font-heading font-bold uppercase mt-1 whitespace-nowrap">
            SPARTA LABS
          </span>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-4 text-sm">
          <div className="hidden md:flex items-center text-gray-300 hover:text-white cursor-pointer transition-colors text-xs font-bold tracking-wider">
            <img src="https://flagcdn.com/us.svg" alt="EN" className="w-4 h-3 mr-1.5 rounded-[2px] object-cover" />
            EN
          </div>
          <button className="text-white hover:text-gray-300 transition-colors p-1">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button className="flex items-center text-[10px] sm:text-xs text-white border border-white/20 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 hover:bg-white/10 transition-colors font-medium whitespace-nowrap">
            Shop now
          </button>
        </div>
      </motion.div>

      {/* Main Content Overlay */}
      <div className="relative z-20 flex-1 flex flex-col items-start justify-center text-left px-4 sm:px-6 md:px-12 -mt-10 sm:-mt-20 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.1] text-white tracking-tight uppercase font-bold drop-shadow-2xl max-w-4xl mb-6">
            THE FUTURE<br/>
            OF PEPTIDE<br/>
            SCIENCE
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed tracking-wide"
        >
          Precision-engineered peptides for researchers,
          <br className="hidden sm:block" /> demanding the highest standards
          <br className="hidden sm:block" /> of purity and performance.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <button className="flex items-center justify-center text-sm text-black bg-white hover:bg-gray-200 border border-transparent rounded-full px-8 py-3.5 transition-colors font-bold uppercase tracking-wider w-full sm:w-auto">
            Shop Now
          </button>
          <button className="flex items-center justify-center text-sm text-white border border-white/30 rounded-full px-8 py-3.5 hover:bg-white/10 transition-colors font-medium uppercase tracking-wider w-full sm:w-auto">
            View All Research Peptides <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>

      {/* Footer Ticker */}
      <div className="relative z-20 w-full border-t border-white/10 bg-black/20 backdrop-blur-md py-4 sm:py-6 px-4 mb-4 rounded-2xl sm:rounded-3xl mx-4 max-w-[calc(100%-2rem)] sm:mx-8 sm:max-w-[calc(100%-4rem)] overflow-hidden self-center">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 sm:gap-6">
          {/* ITEM 1 */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-widest text-[10px] sm:text-lg">99.1% PURITY</span>
          </div>

          {/* ITEM 2 */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider text-[10px] sm:text-xl">LAB TESTED</span>
          </div>

          {/* ITEM 3 */}
          <div className="flex items-center">
            <span className="text-white font-bold tracking-wide text-[10px] sm:text-xl">RESEARCH GRADE</span>
          </div>

          {/* ITEM 4 */}
          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-white font-bold tracking-wider text-sm sm:text-lg">USA MADE</span>
          </div>

          {/* ITEM 5 */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider text-sm sm:text-xl">FAST SHIPPING</span>
          </div>
        </div>
      </div>

      {/* Sliding Glassy Quarter Panel Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop to close when clicked outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80vw] sm:w-[400px] md:w-[25vw] z-[70] bg-black/80 backdrop-blur-2xl border-r border-white/10 flex flex-col p-8 md:p-12"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="self-end text-white/50 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Links */}
              <div className="flex flex-col mt-12 space-y-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link}
                    href="#"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-widest uppercase hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 text-primary">-</span>
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
