'use client'

import React from 'react';
import { ArrowRight, ShieldCheck, FlaskConical, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { PinterestGlassCard } from '../home/PinterestGlassCard';

export function TrustBadges() {
  const cardContainerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: "spring", damping: 20, stiffness: 100 } 
    }
  };

  return (
    <section className="bg-cream px-4 md:px-10 py-24 md:py-32 w-full relative z-30">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 md:gap-0"
        >
          <div className="w-full md:w-1/2">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-bold">The 99 Purity Standard</p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-zinc-900 leading-[0.9] tracking-tighter uppercase mb-0 md:mb-8">
              ENGINEERED FOR <br /> ABSOLUTE PRECISION<span className="text-primary">.</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-8 max-w-md mt-6 md:mt-0">
            <button className="inline-flex items-center gap-3 bg-zinc-900 text-cream text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-primary transition-all duration-300 shadow-xl group">
              Discover Quality
              <div className="bg-cream rounded-full p-2 group-hover:bg-zinc-900 transition-colors">
                <ArrowRight className="w-5 h-5 text-zinc-900 group-hover:text-cream transition-colors" />
              </div>
            </button>
            <p className="text-zinc-600 text-base md:text-lg text-left md:text-right leading-relaxed font-medium">
              Every compound is synthesized under strict laboratory conditions, independently verified via third-party analysis, and sealed to ensure maximum stability.
            </p>
          </div>
        </motion.div>

        {/* Row 2 - Cards Grid using PinterestGlassCard */}
        <motion.div 
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={cardVariants} className="flex justify-center h-full">
            <PinterestGlassCard 
              title="99.1%+ Verified Purity"
              description="We don't rely on manufacturer claims. Every single batch is independently tested by accredited third-party laboratories in the USA to guarantee minimum 99% purity before it ever reaches our inventory."
              icon={<ShieldCheck className="w-5 h-5" />}
              tag="USA Verified"
            />
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants} className="flex justify-center h-full lg:mt-16">
            <PinterestGlassCard 
              title="Lyophilized Stability"
              description="Our peptides are lyophilized (freeze-dried) under vacuum to ensure long-term molecular stability during transit and storage."
              icon={<FlaskConical className="w-5 h-5" />}
              tag="Vacuum Sealed"
            />
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariants} className="flex justify-center h-full lg:mt-32">
            <PinterestGlassCard 
              title="Exact Milligram Dosing"
              description="Precision is paramount. We guarantee exact milligram content per vial, completely eliminating the guesswork from your research."
              icon={<Target className="w-5 h-5" />}
              tag="Precision Dosed"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

