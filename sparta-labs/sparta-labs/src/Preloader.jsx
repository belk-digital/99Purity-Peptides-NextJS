import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from './ShinyText';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const [show, setShow] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    const isVerified = sessionStorage.getItem('spartaAgeVerified');
    
    if (isVerified) {
      if (onComplete) onComplete();
    } else {
      setShow(true);
      
      const timer = setTimeout(() => {
        setShowVerification(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  const handleAccept = () => {
    sessionStorage.setItem('spartaAgeVerified', 'true');
    setShow(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200); // Wait for the slide-up animation to complete
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 mix-blend-screen"
          >
            <source src="https://res.cloudinary.com/dgrrovta3/video/upload/v1781298434/sparta_animation_video_vs4lve.webm" type="video/webm" />
          </video>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* SVG Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6"
            >
              <svg viewBox="0 0 200 300" className="w-24 h-24 sm:w-32 sm:h-auto fill-[#d90429] drop-shadow-2xl">
                <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
              </svg>
            </motion.div>

            {/* Shiny Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <ShinyText
                text="SPARTA LABS"
                disabled={false}
                speed={3}
                className="text-2xl sm:text-4xl tracking-[0.3em] font-heading font-bold uppercase"
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={100}
                direction="left"
              />
            </motion.div>

            {/* Age Verification Box */}
            <AnimatePresence>
              {showVerification && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl max-w-lg text-center"
                >
                  <h2 className="text-white text-2xl sm:text-3xl font-heading font-bold uppercase tracking-wider mb-4">
                    Age Verification
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed">
                    You must be 18 years or older to access this website. All products are for research use only.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleAccept}
                      className="px-8 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      I Am 18+
                    </button>
                    <button 
                      onClick={handleDecline}
                      className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-white/10 transition-colors"
                    >
                      Leave
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
