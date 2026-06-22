'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Microscope, ShieldAlert, Activity, FileWarning, AlertTriangle } from 'lucide-react'

export function ComplianceStatement() {
  const statements = [
    {
      icon: Microscope,
      text: "Products offered by 99 Purity Peptides are synthetic research peptides intended for laboratory research only.",
    },
    {
      icon: ShieldAlert,
      text: "Not for human or animal use.",
    },
    {
      icon: Activity,
      text: "Not for diagnosis, treatment, ingestion or administration of any kind.",
    },
    {
      icon: FileWarning,
      text: "Products have not been evaluated or approved by the US Food and Drug Administration (FDA).",
    }
  ];

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
      rotateX: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
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
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-[#050505] relative overflow-hidden border-t border-white/5 perspective-1000">
      
      {/* Subtle Premium Background (No glows) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Massive background watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-[0.02] pointer-events-none">
          <AlertTriangle className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]" strokeWidth={0.5} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.h2 variants={titleVariants} className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6 font-bold flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-primary/30"></span>
            Official Notice
            <span className="w-8 h-[1px] bg-primary/30"></span>
          </motion.h2>
          <motion.h3 variants={titleVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white tracking-tighter uppercase mb-4 leading-[1.1] break-words">
            Compliance <br className="md:hidden" />Statement
          </motion.h3>
          <motion.p variants={titleVariants} className="text-white/40 uppercase tracking-widest text-sm md:text-base font-light">
            Terms of Research Use
          </motion.p>
        </motion.div>

        {/* 2x2 Bento Grid for Low Content */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
        >
          {statements.map((item, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="h-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 lg:p-12 relative overflow-hidden group hover:bg-[#111] hover:border-white/20 transition-all duration-300 ease-out flex flex-col justify-between cursor-default"
            >
              
              {/* Sharp geometric accent line on hover instead of a glowing gradient */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-500 ease-in-out" />
              
              {/* Number Watermark */}
              <div className="absolute -bottom-4 -right-4 text-[120px] font-heading font-black text-white/[0.02] leading-none pointer-events-none group-hover:text-white/[0.05] group-hover:-translate-y-4 transition-all duration-500 ease-out">
                0{index + 1}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:border-white transition-all duration-300 ease-out">
                  <item.icon className="w-7 h-7 text-white/50 group-hover:text-black transition-colors duration-300" strokeWidth={1.5} />
                </div>
                
                <p className="text-white/80 font-light text-xl lg:text-2xl leading-relaxed group-hover:text-white transition-colors duration-300 mt-auto">
                  {item.text}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  )
}
