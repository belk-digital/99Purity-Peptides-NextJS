'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Microscope, ShieldCheck, Settings, FileCheck } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FadeUp } from '@/components/motion/FadeUp'

const FEATURE_META = [
  {
    key: 'analyticalEvaluation',
    icon: Microscope,
    image: "/99 Images/why-choose-us-1.webp",
    colSpan: "md:col-span-2",
  },
  {
    key: 'clearClassification',
    icon: ShieldCheck,
    image: "/99 Images/why-choose-us-2.webp",
    colSpan: "md:col-span-1",
  },
  {
    key: 'controlledHandling',
    icon: Settings,
    image: "/99 Images/vial-closeup.webp",
    colSpan: "md:col-span-1",
  },
  {
    key: 'operationalTransparency',
    icon: FileCheck,
    image: "/99 Images/coa.webp",
    colSpan: "md:col-span-2",
  }
];

export function WhyChooseUsGrid() {
  const t = useTranslations('content.whyChooseUsGrid')
  const features = FEATURE_META.map((f) => ({
    ...f,
    title: t(`features.${f.key}.title`),
    description: t(`features.${f.key}.description`),
  }))
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

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
    <section ref={containerRef} className="py-32 bg-ink relative overflow-hidden perspective-1000">
      
      {/* Massive Background Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden pointer-events-none z-0 opacity-[0.03] flex flex-col gap-4">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="whitespace-nowrap font-heading font-black text-[15vw] text-white uppercase leading-none tracking-tighter"
        >
          ANALYTICAL PURITY • ANALYTICAL PURITY • 
        </motion.div>
        <motion.div 
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
          className="whitespace-nowrap font-heading font-black text-[15vw] text-white uppercase leading-none tracking-tighter"
        >
          LABORATORY GRADE • LABORATORY GRADE • 
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div 
            variants={titleVariants} 
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
            <h2 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary font-bold">
              {t('eyebrow')}
            </h2>
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
          </motion.div>
          <motion.h3 variants={titleVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading font-black text-white tracking-tighter uppercase mb-6 leading-none break-words">
            {t('titleLine1')} <br className="hidden md:block"/>{t('titleLine2')}
          </motion.h3>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group relative rounded-[2rem] overflow-hidden ${feature.colSpan} cursor-default bg-ink border border-white/5 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]`}
            >
              {/* Image Background - B&W to Color Snap */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  fill 
                  className="object-cover transition-all duration-700 ease-out opacity-20 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none" />
              </div>

              {/* Crisp Border Overlay */}
              <div className="absolute inset-0 z-20 rounded-[2rem] border border-white/10 pointer-events-none group-hover:border-primary/50 transition-colors duration-500 ease-out" />

              <div className="relative z-10 flex flex-col h-full justify-end p-6 md:p-8 lg:p-12 min-h-[350px] lg:min-h-[450px]">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:rotate-12 transition-all duration-500 ease-out">
                  <feature.icon className="w-8 h-8 text-white/50 group-hover:text-ink transition-colors duration-300" strokeWidth={1.5} />
                </div>
                
                <h4 className="text-2xl lg:text-3xl font-heading font-black text-white uppercase tracking-tight mb-4 transition-colors duration-300 break-words group-hover:text-primary">
                  {feature.title}
                </h4>
                
                <div className="overflow-hidden">
                  <p className="text-white/60 text-lg font-light leading-relaxed max-w-lg transition-all duration-300 ease-out group-hover:text-white/90">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
