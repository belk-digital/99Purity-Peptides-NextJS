'use client'

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FlaskConical, Network, Shield, Snowflake, Search, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function DifferenceSection() {
  const [isAgitated, setIsAgitated] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const shakeCount = useRef(0);

  const handleVialMouseMove = (e: React.MouseEvent) => {
    if (isAgitated) return;
    
    const now = Date.now();
    const currentX = e.clientX;
    const currentY = e.clientY;
    const dt = now - lastMousePos.current.time;
    
    // We check every tiny movement within a 150ms window
    if (dt > 0 && dt < 150) {
      const dx = Math.abs(currentX - lastMousePos.current.x);
      const dy = Math.abs(currentY - (lastMousePos.current.y || currentY));
      
      // Calculate overall distance moved rapidly
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;
      
      // Require a higher velocity (faster movement) to register a shake
      if (velocity > 3) {
        shakeCount.current += 1;
        // Require more consecutive shakes
        if (shakeCount.current > 5) {
          setIsAgitated(true);
          shakeCount.current = 0;
          setTimeout(() => setIsAgitated(false), 3000); // Reset after 3 seconds
        }
      }
    } else if (dt >= 150) {
      // Don't reset immediately, allow slight pauses
      shakeCount.current = Math.max(0, shakeCount.current - 1);
    }
    
    lastMousePos.current = { x: currentX, y: currentY, time: now };
  };

  // Animation Variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const rightContainerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const vialVariants: any = {
    hidden: { opacity: 0, scale: 0.5, filter: 'blur(20px)', y: 60 },
    visible: {
      opacity: 1, scale: 1, filter: 'blur(0px)', y: 0,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const scatterCardVariants: any = {
    hidden: (i: number) => {
      const scatter = [
        { x: -40, y: -30, rotate: -4 },    // Desktop Left 1
        { x: -50, y: 30, rotate: 3 },      // Desktop Left 2
        { x: 40, y: -40, rotate: 5 },      // Desktop Right 1
        { x: 50, y: 10, rotate: -3 },      // Desktop Right 2
        { x: 30, y: 40, rotate: 4 },       // Desktop Right 3
        { x: -20, y: -20, rotate: -2 },    // Mobile 1
        { x: 20, y: -20, rotate: 2 },      // Mobile 2
        { x: -20, y: 20, rotate: -2 },     // Mobile 3
        { x: 20, y: 20, rotate: 2 },       // Mobile 4
        { x: 0, y: 30, rotate: 0 }         // Mobile 5
      ];
      return {
        opacity: 0,
        x: scatter[i % scatter.length].x * 1.5,
        y: scatter[i % scatter.length].y * 1.5 + 40,
        rotate: scatter[i % scatter.length].rotate * 2,
        scale: 0.6,
        filter: 'blur(8px)'
      };
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 90,
        mass: 1,
        delay: 0.4 + (i % 5) * 0.15
      }
    })
  };

  const lineVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: "easeInOut", delay: 0.3 } 
    }
  };

  const mobileCardVariants: any = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.9,
      filter: 'blur(8px)'
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        delay: 0.5 + i * 0.15
      }
    })
  };

  const pulseLineVariants: any = {
    hidden: { opacity: 0, strokeDashoffset: 0 },
    visible: (i: number) => ({ 
      opacity: 1, 
      strokeDashoffset: -140, // 10x multiplier of the dash array (2+12) for a seamless infinite loop
      transition: { 
        opacity: { delay: 1.5, duration: 1 },
        strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" }
      }
    })
  };

  const dotVariants: any = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.4, ease: "easeOut", delay: 1.5 } 
    }
  };

  const connectionPaths = [
    { d: "M 225 140 L 230 140 L 260 170 L 280 170", cx: 280, cy: 170 },
    { d: "M 225 440 L 230 440 L 260 410 L 280 410", cx: 280, cy: 410 },
    { d: "M 575 90 L 570 90 L 540 120 L 520 120", cx: 520, cy: 120 },
    { d: "M 575 290 L 570 290 L 550 270 L 520 270", cx: 520, cy: 270 },
    { d: "M 575 490 L 570 490 L 540 460 L 520 460", cx: 520, cy: 460 },
  ];

  return (
    <section className="bg-gradient-to-br from-[#003333] to-[#001111] py-24 px-4 md:px-10 overflow-hidden relative font-sans w-full min-h-[800px] flex items-center justify-center">
      
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-[120rem] px-6 sm:px-12 md:px-16 mx-auto relative z-10 flex flex-col xl:flex-row justify-between items-center h-full gap-16 xl:gap-8">
        
        {/* Left Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full xl:w-[35%] z-20 text-center xl:text-left mt-10 xl:mt-0"
        >
          <motion.div variants={itemVariants} className="inline-block border border-white/10 rounded-full px-4 py-1.5 mb-4 sm:mb-6 bg-white/5 backdrop-blur-sm mx-auto xl:mx-0">
            <span className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">99 Purity Peptides</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-white text-[2rem] sm:text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase leading-[0.9] tracking-tighter mb-4 sm:mb-6">
            The Lab<br />Difference
          </motion.h2>
          <motion.p variants={itemVariants} className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto xl:mx-0 font-medium">
            Each batch is tested by an independent, accredited laboratory to confirm purity, identity, and composition. Results are documented and available by batch.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center xl:justify-start">
            <Link 
              href="/certificates"
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase tracking-wider text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              View COA Library
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content - Diagram */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={rightContainerVariants}
          className="w-full xl:w-[65%] relative flex justify-center items-center min-h-[600px]"
        >
          
          {/* Desktop Diagram Container */}
          <div className="relative w-full max-w-[900px] aspect-[4/3] hidden lg:block">
            {/* SVG Connecting Lines */}
            <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {connectionPaths.map((path, i) => (
                <g key={`path-${i}`}>
                  {/* Base faint track */}
                  <motion.path 
                    variants={lineVariants} 
                    d={path.d} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.25)" 
                    strokeWidth="1.5" 
                  />
                  
                  {/* Glowing data flow pulse */}
                  <motion.path 
                    custom={i}
                    variants={pulseLineVariants}
                    d={path.d} 
                    fill="none" 
                    stroke="#008B8B" 
                    strokeWidth="2" 
                    strokeDasharray="2 12"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(0,139,139,0.8)]"
                  />
                  
                  {/* Base End Dot */}
                  <motion.circle variants={dotVariants} cx={path.cx} cy={path.cy} r="3" fill="rgba(255,255,255,0.4)" />
                  
                  {/* Pulsing End Dot Ring */}
                  <motion.circle 
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: [0.8, 0], scale: [1, 3], transition: { duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.5 + i * 0.4 } }
                    }}
                    cx={path.cx} cy={path.cy} r="3" fill="none" stroke="#008B8B" strokeWidth="1"
                    style={{ transformOrigin: `${path.cx}px ${path.cy}px` }}
                  />
                </g>
              ))}
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[520px] z-10 flex flex-col items-center pointer-events-none">
              {/* 3D Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,139,139,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />

              <motion.div variants={vialVariants} className="w-full h-full">
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-full h-full will-change-transform"
                >
                  <motion.div 
                    onMouseMove={handleVialMouseMove}
                    animate={{ filter: isAgitated ? "brightness(1.1) saturate(1.2)" : "brightness(1) saturate(1)" }}
                    className={`relative w-full h-full pointer-events-auto cursor-crosshair z-20 ${isAgitated ? 'animate-vibrate scale-[1.02]' : ''}`}
                    title="Shake to agitate..."
                  >
                    <Image 
                      src="/99 Images/transparant-vial.png" 
                      alt="Vial" 
                      fill
                      sizes="(max-width: 1280px) 240px, 300px"
                      className="object-contain drop-shadow-[-20px_35px_35px_rgba(0,0,0,0.8)] z-10 relative" 
                      priority
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* 3D Floor Shadow */}
              <div className="absolute -bottom-10 w-full flex justify-center pointer-events-none">
                <motion.div 
                  animate={{ scale: [1, 0.7, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[160px] h-[16px] bg-black blur-[8px] rounded-[100%]" 
                />
              </div>
              
              {/* Shake Warning popup */}
              <AnimatePresence>
                {isAgitated && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    className="absolute bottom-0 z-50 flex items-center gap-4 px-5 py-3 rounded-xl bg-black/90 backdrop-blur-xl border border-red-500/50 shadow-[0_10px_40px_rgba(255,0,0,0.4)] pointer-events-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-red-500 font-bold text-xs uppercase tracking-widest leading-none mb-1">
                        Critical Warning
                      </span>
                      <span className="text-red-200/80 font-mono text-[10px] uppercase tracking-wider leading-none">
                        Peptide bonds agitated
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cards (Absolute positioned with percentages for responsive scaling) */}
            <motion.div custom={0} variants={scatterCardVariants} className="absolute top-[16.6%] left-0 pointer-events-auto z-10 w-[28%]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 flex flex-col xl:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                    <FlaskConical className="w-5 h-5 text-[#003333]" />
                  </div>
                  <div className="mt-1 xl:mt-0">
                    <h4 className="text-white font-bold text-sm mb-1.5 leading-tight tracking-wide">Independently Lab Tested</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Verified purity & composition.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div custom={1} variants={scatterCardVariants} className="absolute top-[66.6%] left-0 pointer-events-auto z-10 w-[28%]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 flex flex-col xl:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                    <Network className="w-5 h-5 text-[#003333]" />
                  </div>
                  <div className="mt-1 xl:mt-0">
                    <h4 className="text-white font-bold text-sm mb-1.5 leading-tight tracking-wide">Advanced Synthesis</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Pioneering research grades.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div custom={2} variants={scatterCardVariants} className="absolute top-[8.3%] right-0 pointer-events-auto z-10 w-[28%]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 flex flex-col xl:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                    <Shield className="w-5 h-5 text-[#003333]" />
                  </div>
                  <div className="mt-1 xl:mt-0">
                    <h4 className="text-white font-bold text-sm mb-1.5 leading-tight tracking-wide">Made in the USA</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Strictly controlled standards.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div custom={3} variants={scatterCardVariants} className="absolute top-[41.6%] right-0 pointer-events-auto z-10 w-[28%]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 flex flex-col xl:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                    <Snowflake className="w-5 h-5 text-[#003333]" />
                  </div>
                  <div className="mt-1 xl:mt-0">
                    <h4 className="text-white font-bold text-sm mb-1.5 leading-tight tracking-wide">Cold Chain Logistics</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Strict temperature control.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div custom={4} variants={scatterCardVariants} className="absolute top-[75%] right-0 pointer-events-auto z-10 w-[28%]">
              <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="relative z-10 flex flex-col xl:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                    <Search className="w-5 h-5 text-[#003333]" />
                  </div>
                  <div className="mt-1 xl:mt-0">
                    <h4 className="text-white font-bold text-sm mb-1.5 leading-tight tracking-wide">Full Traceability</h4>
                    <p className="text-white/80 text-xs leading-relaxed">Batch-specific tracking.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile/Tablet Diagram Container */}
          <div className="relative w-full flex flex-col items-center lg:hidden mt-12 overflow-hidden">
             
             {/* 3D Floating Vial Scene */}
             <div className="relative w-full flex flex-col items-center z-20">
               {/* 3D Ambient Glow (Native radial-gradient prevents clipping) */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(0,139,139,0.15)_0%,transparent_70%)] rounded-full pointer-events-none" />

               {/* Floating Vial */}
               <motion.div variants={vialVariants} className="relative w-[180px] h-[400px]">
                 <motion.div
                   animate={{ y: [-12, 12, -12] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="relative w-full h-full will-change-transform"
                 >
                   <Image 
                     src="/99 Images/transparant-vial.png" 
                     alt="Vial" 
                     fill
                     sizes="(max-width: 640px) 180px, 200px"
                     className="object-contain z-10 relative drop-shadow-[-15px_25px_25px_rgba(0,0,0,0.7)]" 
                   />
                 </motion.div>
               </motion.div>

               {/* 3D Floor Shadow (Syncs with the levitation) */}
               <motion.div 
                 animate={{ scale: [1, 0.7, 1], opacity: [0.7, 0.2, 0.7] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="w-[120px] h-[12px] bg-black blur-[6px] rounded-[100%] mt-8" 
               />
             </div>
             
             {/* Clean Grid of Cards */}
             <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.1 }}
               className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl px-4 sm:px-0 mt-12 sm:mt-16"
             >
                {[
                  { icon: FlaskConical, title: "Independently Lab Tested", desc: "Verified purity & composition." },
                  { icon: Network, title: "Advanced Synthesis", desc: "Pioneering research grades." },
                  { icon: Shield, title: "Made in the USA", desc: "Strictly controlled standards." },
                  { icon: Snowflake, title: "Cold Chain Logistics", desc: "Strict temperature control." },
                  { icon: Search, title: "Full Traceability", desc: "Batch-specific tracking." }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div 
                      key={idx} 
                      custom={idx} 
                      variants={mobileCardVariants} 
                      className={`bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-5 shadow-2xl w-full relative transition-all duration-300 group hover:-translate-y-1 hover:bg-white/20 hover:border-white/40 overflow-hidden cursor-default ${idx === 4 ? 'sm:col-span-2 sm:mx-auto sm:w-80' : ''}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-110 shadow-lg transition-transform duration-300">
                          <Icon className="w-5 h-5 text-[#003333]" />
                        </div>
                        <div className="mt-1 sm:mt-0">
                          <h4 className="text-white font-bold text-[13px] sm:text-sm mb-1.5 leading-tight tracking-wide">{card.title}</h4>
                          <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed">{card.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
