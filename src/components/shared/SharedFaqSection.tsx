'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export type FaqItemType = {
  question: string;
  answer: string | React.ReactNode;
};

const FaqItem = ({ 
  faq, 
  index,
  onHoverStart,
  onHoverEnd
}: { 
  faq: FaqItemType; 
  index: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const num = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-t border-ink/20 py-8 lg:py-12 group md:cursor-none cursor-pointer transition-colors duration-300 hover:bg-ink/[0.02]"
      onMouseEnter={() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          setIsHovered(true);
          onHoverStart();
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          setIsHovered(false);
          onHoverEnd();
        }
      }}
      onClick={() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setIsHovered(!isHovered);
        }
      }}
    >
      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] flex flex-col lg:flex-row w-full gap-6 lg:gap-8 justify-between items-start">
        
        {/* Left: Num + Question */}
        <div className="flex flex-1 gap-4 sm:gap-6 md:gap-12 lg:gap-32 items-start w-full lg:w-1/2">
          <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium text-ink/40 group-hover:text-primary transition-colors duration-300">
            {num}
          </span>
          <h3 className="font-heading text-[1.2rem] sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-ink leading-tight max-w-full sm:max-w-lg break-words">
            {faq.question}
          </h3>
        </div>

        {/* Right: Answer + Arrow */}
        <div className="w-full lg:w-5/12 flex justify-between items-start gap-8">
          <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="overflow-hidden flex-1"
          >
            <div className="text-ink/80 text-base md:text-lg leading-relaxed pt-2 lg:pt-0 pr-4">
              {faq.answer}
            </div>
          </motion.div>
          <div className="hidden md:block flex-shrink-0">
            <ArrowUpRight className={`w-8 h-8 text-primary transition-transform duration-500 transform ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export function SharedFaqSection({
  title,
  subtitle = "(faqs)",
  description,
  faqs,
}: {
  title: string | React.ReactNode;
  subtitle?: string;
  description?: string | React.ReactNode;
  faqs: FaqItemType[];
}) {
  const [isHoveringFaq, setIsHoveringFaq] = useState(false);

  // Use MotionValues to prevent React re-renders on mousemove (fixes scroll lag)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Prevent heavy JS tracking on mobile devices
      cursorX.set(e.clientX - 50);
      cursorY.set(e.clientY - 50);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  return (
    <section className="bg-cream w-full py-32 relative z-30 font-sans">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-full bg-ink text-cream font-bold text-[10px] uppercase tracking-widest text-center shadow-2xl"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring,
          width: 100, 
          height: 100 
        }}
        animate={{
          scale: isHoveringFaq ? 1 : 0,
          opacity: isHoveringFaq ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="max-w-[70px] leading-tight text-sm">READ</span>
      </motion.div>

      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full">
          <div className="flex flex-col mb-6 md:mb-0 max-w-xl">
            <p className="text-ink/50 text-sm font-bold tracking-widest uppercase mb-6">
              {subtitle}
            </p>
            {description && (
              <p className="text-ink/70 text-lg md:text-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <h2 className="font-heading text-[2.5rem] sm:text-[clamp(3rem,9vw,140px)] font-black text-ink text-left md:text-right uppercase leading-[0.85] tracking-tighter w-full break-words">
            {title}
          </h2>
        </div>
      </div>

      <div className="w-full">
        {faqs.map((faq, index) => (
          <FaqItem 
            key={index} 
            faq={faq} 
            index={index} 
            onHoverStart={() => setIsHoveringFaq(true)}
            onHoverEnd={() => setIsHoveringFaq(false)}
          />
        ))}
        {/* Final border bottom */}
        <div className="border-t border-ink/20 w-full" />
      </div>
    </section>
  );
}
