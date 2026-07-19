'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion'
import { Star, ShieldCheck, Quote } from 'lucide-react'
import Image from 'next/image'
import { PinterestGlassCard } from './PinterestGlassCard'

const HARDCODED_REVIEWS = [
  {
    id: 1,
    name: "Dr. James Mitchell",
    title: "Lead Researcher",
    rating: 5,
    text: "Every single batch consistently hits the 99% mark. The transparency with their COAs is unmatched in this industry. Extremely reliable supplier.",
    verified: true,
    startScroll: 0.15,
    endScroll: 0.35,
    align: "absolute top-[2%] left-[2%] md:top-[2%] md:left-[2%] lg:top-[2%] lg:left-[2%] scale-[0.55] md:scale-[0.7] lg:scale-100 origin-top-left", 
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    title: "Lab Technician",
    rating: 5,
    text: "Shipping was incredibly fast to Texas. We use their Semaglutide for our in vitro models and the solubility is flawless.",
    verified: true,
    startScroll: 0.25,
    endScroll: 0.45,
    align: "absolute top-[34%] right-[2%] md:top-[12%] md:right-auto md:left-[35%] lg:top-[12%] lg:right-auto lg:left-[35%] scale-[0.55] md:scale-[0.7] lg:scale-100 origin-top-right lg:origin-top", 
  },
  {
    id: 3,
    name: "Michael R.",
    title: "Independent Researcher",
    rating: 5,
    text: "Their Tirzepatide is top tier. After seeing their mass spectrometry results match up with our own in-house testing, I won't buy anywhere else.",
    verified: true,
    startScroll: 0.35,
    endScroll: 0.55,
    align: "absolute top-[66%] left-[6%] md:top-[2%] md:left-auto md:right-[2%] lg:top-[2%] lg:left-auto lg:right-[2%] scale-[0.55] md:scale-[0.7] lg:scale-100 origin-top-left lg:origin-top-right", 
  },
  {
    id: 4,
    name: "David T.",
    title: "Biomedical Engineer",
    rating: 5,
    text: "Customer support actually knows what they're talking about. I had a highly technical question... they got back to me with a detailed breakdown within hours.",
    verified: true,
    startScroll: 0.45,
    endScroll: 0.65,
    align: "hidden md:flex absolute md:bottom-auto md:top-[50%] md:left-[2%] lg:top-[50%] lg:left-[2%] md:scale-[0.7] lg:scale-100 origin-top-left", 
  },
  {
    id: 5,
    name: "Amanda Cole",
    title: "Research Scientist",
    rating: 5,
    text: "Purity is everything in our line of work. 99 Purity Peptides has provided the most stable lyopholized compounds we've sourced stateside.",
    verified: true,
    startScroll: 0.55,
    endScroll: 0.75,
    align: "hidden md:flex absolute md:bottom-auto md:top-[60%] md:right-auto md:left-[35%] lg:top-[60%] lg:right-auto lg:left-[35%] md:scale-[0.7] lg:scale-100 origin-top", 
  },
  {
    id: 6,
    name: "Robert H.",
    title: "Principal Investigator",
    rating: 5,
    text: "I highly appreciate the fact that they don't hide their testing. The batch numbers on the vials correlate perfectly with the COAs on the site.",
    verified: true,
    startScroll: 0.65,
    endScroll: 0.85,
    align: "hidden md:flex absolute md:bottom-auto md:top-[50%] md:right-[2%] lg:top-[50%] lg:right-[2%] md:scale-[0.7] lg:scale-100 origin-top-right", 
  }
]

function ReviewCard({ 
  review, 
  scrollYProgress 
}: { 
  review: typeof HARDCODED_REVIEWS[0]
  scrollYProgress: MotionValue<number> 
}) {
  const scale = useTransform(scrollYProgress, [review.startScroll, review.endScroll], [0.5, 1])
  const opacity = useTransform(scrollYProgress, [review.startScroll, review.endScroll], [0, 1])
  const yOffset = useTransform(scrollYProgress, [review.startScroll, review.endScroll], [50, 0])

  return (
    <div className={`z-30 pointer-events-none ${review.align}`}>
      <motion.div
        style={{ scale, opacity, y: yOffset, willChange: "transform, opacity" }}
        className={`flex flex-col w-[85vw] max-w-[340px] md:max-w-[300px] lg:max-w-[310px] xl:max-w-[340px] 2xl:max-w-[380px] pointer-events-auto group`}
      >
        <PinterestGlassCard 
          title={review.name}
          description={review.text}
          icon={<span className="text-white font-bold text-[10px] sm:text-xs">99</span>}
          tag={review.verified ? "Verified" : undefined}
          microcopy={review.title}
          theme="cream"
          iconPosition="left"
          className="lg:!p-5 [&_h3]:lg:!text-[1.1rem] [&_h3]:lg:!mb-1.5 [&_p]:lg:!text-[0.75rem] [&_p]:lg:!leading-[1.6] [&>div.z-20]:lg:!pb-14"
        />
      </motion.div>
    </div>
  )
}

export function HomeReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Apply spring physics for buttery smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    mass: 0.5,
    stiffness: 100,
    restDelta: 0.001
  })

  // Text Animation (Zoom through and disappear)
  // We use an exponential curve: starts slow (1 to 5), then speeds up at the end (5 to 30)
  const textScale = useTransform(smoothProgress, [0.05, 0.25, 0.40], [1, 5, 30])
  const textOpacity = useTransform(smoothProgress, [0.25, 0.35], [1, 0])

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] md:h-[300vh] bg-cream">
      {/* Sticky container holds the viewport while we scroll through the 300vh */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-[1000px]">

        {/* Central Zooming Text */}
        <motion.div 
          style={{ scale: textScale, opacity: textOpacity }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
        >
          {/* Floating Zero-Gravity Avatars (Initials Instead of Faces) */}
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] lg:left-[20%] w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=JM&background=1e5661&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[15%] right-[15%] lg:right-[25%] w-12 h-12 md:w-20 md:h-20 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=SJ&background=111111&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[25%] left-[20%] lg:left-[30%] w-14 h-14 md:w-20 md:h-20 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=MR&background=f3f4f6&color=111111&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[20%] right-[15%] lg:right-[20%] w-16 h-16 md:w-28 md:h-28 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=EC&background=0f766e&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-[45%] left-[5%] lg:left-[10%] w-10 h-10 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=MT&background=facc15&color=111111&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Extra Desktop-Only Avatars to fill the wider screen */}
          <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="hidden lg:block absolute top-[35%] right-[10%] w-16 h-16 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=JS&background=f3f4f6&color=111111&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, 22, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }} className="hidden lg:block absolute bottom-[15%] left-[12%] w-14 h-14 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=AL&background=1e5661&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="hidden lg:block absolute top-[10%] left-[35%] w-12 h-12 rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=KD&background=111111&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} className="hidden lg:block absolute bottom-[10%] right-[35%] w-[4.5rem] h-[4.5rem] rounded-full border-[3px] border-white shadow-xl overflow-hidden -z-10">
            <img src="https://ui-avatars.com/api/?name=RM&background=0f766e&color=fff&size=150&font-size=0.35&bold=true" alt="Client" className="w-full h-full object-cover" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-[5rem] font-heading text-[#111111] uppercase tracking-tighter leading-[1.1] max-w-5xl mx-auto drop-shadow-sm text-center">
            What Our <span className="text-[#1e5661]">Clients</span> Say About Us
          </h2>
        </motion.div>

        {/* The Review Cards Container */}
        <div className="absolute inset-0 z-30 w-full h-full max-w-[1400px] mx-auto px-4 md:px-8 py-20 md:py-4 overflow-hidden md:overflow-visible">
          <div className="relative w-full h-full">
            {HARDCODED_REVIEWS.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                scrollYProgress={smoothProgress} 
              />
            ))}
          </div>
        </div>

        {/* Seamless blend gradients to prevent harsh cutoffs with surrounding sections */}
        <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-cream via-cream/80 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  )
}
