'use client'

import React, { useRef, useState, MouseEvent } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { CheckCircle2, ArrowRight, Beaker, ShieldAlert } from 'lucide-react'
import Image from 'next/image'

export function OurServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  // Premium crisp entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      rotateX: 5,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    }
  };

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-cream relative border-t border-ink/5 overflow-hidden perspective-1000">
      
      {/* Premium Roadmap/Journey SVG Background */}
      <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
        <svg 
          className="w-full h-full max-w-7xl mx-auto opacity-30" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="xMidYMid slice" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Faint static background track */}
          <path 
            d="M 500,0 C 500,200 900,200 900,400 C 900,600 100,600 100,800 C 100,1000 500,1000 500,1200" 
            stroke="var(--ink)" 
            strokeWidth="2" 
            strokeDasharray="10 10" 
            strokeOpacity="0.1" 
          />
          {/* Animated drawing path (The "Roadmap") */}
          <motion.path 
            d="M 500,0 C 500,200 900,200 900,400 C 900,600 100,600 100,800 C 100,1000 500,1000 500,1200" 
            stroke="var(--primary)" 
            strokeWidth="4" 
            strokeLinecap="round"
            style={{ pathLength }}
          />
          
          {/* Pulsing nodes along the path */}
          <motion.circle cx="500" cy="50" r="8" fill="var(--primary)" opacity={useTransform(scrollYProgress, [0.1, 0.2], [0, 1])} />
          <motion.circle cx="900" cy="400" r="12" fill="white" stroke="var(--primary)" strokeWidth="4" opacity={useTransform(scrollYProgress, [0.4, 0.5], [0, 1])} />
          <motion.circle cx="100" cy="800" r="12" fill="white" stroke="var(--primary)" strokeWidth="4" opacity={useTransform(scrollYProgress, [0.6, 0.7], [0, 1])} />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.h2 variants={titleVariants} className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6 font-bold flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-primary/30"></span>
            Our Capabilities
            <span className="w-12 h-[1px] bg-primary/30"></span>
          </motion.h2>
          <motion.h3 variants={titleVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-ink tracking-tighter uppercase mb-6 leading-[1.1] break-words">
            Synthetic Research<br/>
            <span className="text-primary">Peptide Supply</span>
          </motion.h3>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          
          {/* Main Content Card (Spans 8 columns) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-8 group relative bg-white border border-ink/5 rounded-[2rem] p-10 lg:p-14 overflow-hidden cursor-default transition-all duration-500 hover:border-ink/20 hover:shadow-2xl"
          >
            {/* Premium Vertical Sweeping Dark Fill */}
            <div className="absolute bottom-0 left-0 w-full h-0 bg-ink group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />

            {/* Clean Image Underlay */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500 origin-top-right z-0">
              <Image src="/99 Images/vial-closeup.webp" alt="Background" fill className="object-cover rounded-bl-[100%]" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-ink/5 rounded-2xl flex items-center justify-center mb-8 border border-ink/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                  <Beaker strokeWidth={1.5} className="w-8 h-8 text-ink group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-ink uppercase tracking-tight mb-6 group-hover:text-white transition-colors duration-500 break-words">
                  Laboratory Grade Excellence
                </h4>
                <p className="text-ink/70 text-lg font-light leading-relaxed max-w-xl group-hover:text-white/80 transition-colors duration-500">
                  99 Purity Peptides supplies chemically synthesised research peptides across multiple laboratory research categories. Our catalogue of laboratory-grade peptides supports analytical environments where structured classification and documented purity standards are required.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Exclusive Application Card (Spans 4 columns) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-4 group relative bg-white border border-ink/5 rounded-[2rem] p-10 lg:p-12 overflow-hidden cursor-default transition-all duration-500 hover:border-ink/20 hover:shadow-2xl"
          >
            {/* Premium Vertical Sweeping Primary Fill */}
            <div className="absolute bottom-0 left-0 w-full h-0 bg-primary group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />

            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none z-0">
              <ShieldAlert className="w-32 h-32 text-ink group-hover:text-white transition-colors duration-500 transform group-hover:rotate-12" strokeWidth={1} />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end">
              <h4 className="text-2xl font-heading font-black text-ink uppercase tracking-tight mb-4 group-hover:text-white transition-colors duration-500 break-words">
                Exclusive Application
              </h4>
              <p className="text-primary font-medium mb-4 text-base group-hover:text-white/90 transition-colors duration-500">
                All materials are provided exclusively for laboratory and analytical research applications.
              </p>
              <div className="w-12 h-[1px] bg-ink/10 mb-4 group-hover:bg-white/20 transition-colors duration-500" />
              <p className="text-ink/40 text-sm font-light italic group-hover:text-white/60 transition-colors duration-500">
                We do not provide medical consultation, dosage guidance, or application recommendations.
              </p>
            </div>
          </motion.div>

          {/* Research Commitment Footer Card (Spans 12 columns) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-12 group relative bg-white border border-ink/5 rounded-[2rem] p-10 lg:p-14 overflow-hidden cursor-default transition-all duration-500 hover:border-ink/20 hover:shadow-2xl"
          >
            {/* Premium Vertical Sweeping Dark Fill */}
            <div className="absolute bottom-0 left-0 w-full h-0 bg-ink group-hover:h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              
              {/* Left Title Area */}
              <div className="w-full lg:w-1/3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-ink/5 rounded-full flex items-center justify-center border border-ink/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                    <CheckCircle2 className="w-6 h-6 text-primary group-hover:text-primary transition-colors duration-500" strokeWidth={2} />
                  </div>
                  <h4 className="text-sm font-mono tracking-[0.2em] text-ink/40 uppercase font-bold group-hover:text-white/50 transition-colors duration-500">
                    Research Commitment
                  </h4>
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-ink uppercase tracking-tight leading-tight group-hover:text-white transition-colors duration-500 break-words">
                  Supporting Controlled Scientific Environments
                </h3>
                <p className="text-ink/60 font-light mt-4 text-base group-hover:text-white/70 transition-colors duration-500">
                  99 Purity Peptides functions solely as a research material supplier. Operational support includes:
                </p>
              </div>

              {/* Right List Area */}
              <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {[
                  "Order processing",
                  "Documentation access",
                  "Product classification clarification",
                  "General sourcing inquiries"
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center p-5 rounded-2xl bg-ink/[0.02] border border-ink/5 hover:border-primary/50 transition-all duration-300 group/item cursor-default group-hover:bg-white/5 group-hover:border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-ink/[0.05] border border-ink/5 flex items-center justify-center mr-4 group-hover/item:bg-primary group-hover/item:border-primary transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
                      <ArrowRight className="w-3 h-3 text-ink/30 group-hover/item:text-ink transition-colors duration-300 transform group-hover/item:translate-x-0.5 group-hover:text-white/50" />
                    </div>
                    <span className="font-medium text-ink/70 group-hover/item:text-white transition-colors duration-300 group-hover:text-white/90">{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
