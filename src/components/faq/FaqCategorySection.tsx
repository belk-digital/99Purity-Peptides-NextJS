'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { FaqCategoryType, FaqItemType } from '@/data/faqs'

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
      className="border-t border-ink/20 py-6 lg:py-10 group md:cursor-none cursor-pointer transition-colors duration-300 hover:bg-ink/[0.02]"
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
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-between items-start">
        
        {/* Left: Num + Question */}
        <div className="flex flex-1 gap-4 sm:gap-6 items-start w-full lg:w-1/2">
          <span className="font-heading text-lg sm:text-xl font-medium text-ink/40 group-hover:text-primary transition-colors duration-300">
            {num}
          </span>
          <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tighter text-ink leading-tight">
            {faq.question}
          </h3>
        </div>

        {/* Right: Answer + Arrow */}
        <div className="w-full lg:w-1/2 flex justify-between items-start gap-4 lg:gap-8 pl-8 sm:pl-10 lg:pl-0">
          <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="overflow-hidden flex-1"
          >
            <div 
              className="text-ink/80 text-sm md:text-base leading-relaxed pt-2 lg:pt-0 pr-4 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </motion.div>
          <div className="hidden md:block flex-shrink-0">
            <ArrowUpRight className={`w-6 h-6 text-primary transition-transform duration-500 transform ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export function FaqCategorySection({
  category,
  onHoverStart,
  onHoverEnd
}: {
  category: FaqCategoryType;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <div className="mb-20">
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-ink uppercase tracking-tighter mb-8 break-words">
        {category.category}
      </h2>
      <div className="w-full">
        {category.items.map((faq, index) => (
          <FaqItem 
            key={index} 
            faq={faq} 
            index={index} 
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        ))}
        {/* Final border bottom */}
        <div className="border-t border-ink/20 w-full" />
      </div>
    </div>
  );
}
