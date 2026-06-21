'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Globe2 } from 'lucide-react';
import { FluidButton } from '@/components/ui/fluid-button';

const MERCH_ITEMS = [
  { name: 'Canvas Tote', image: '/99 Images/merch/merch_tote_bag_1781758420743.png', class: 'col-span-1 row-span-2' },
  { name: 'Premium T-Shirt', image: '/99 Images/merch/merch_t_shirt_1781758435328.png', class: 'col-span-1 row-span-1' },
  { name: 'Research Hoodie', image: '/99 Images/merch/merch_hoodie_1781758456477.png', class: 'col-span-1 row-span-1' },
  { name: 'Shipping Box', image: '/99 Images/merch/merch_box_1781758512334.png', class: 'col-span-2 row-span-1' },
  { name: 'Thermos Bottle', image: '/99 Images/merch/merch_bottle_1781758466668.png', class: 'col-span-1 row-span-2' },
  { name: 'Lanyard', image: '/99 Images/merch/merch_lanyard_1781758525888.png', class: 'col-span-1 row-span-2' },
  { name: 'Research Cap', image: '/99 Images/merch/merch_cap_1781758478975.png', class: 'col-span-2 row-span-1' },
  { name: 'Enamel Keyring', image: '/99 Images/merch/merch_keyring_1781758546025.png', class: 'col-span-1 row-span-2' },
  { name: 'Lab Notebook', image: '/99 Images/merch/merch_notebook_1781758535829.png', class: 'col-span-1 row-span-1' },
  { name: 'Coffee Cup', image: '/99 Images/merch/merch_coffee_cup_1781758489600.png', class: 'col-span-1 row-span-1' },
];

export function MerchandiseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-cream py-24 md:py-32 relative z-30 font-sans overflow-hidden border-t border-ink/5">
      <div className="container mx-auto px-4 md:px-10 max-w-[100rem]">
        
        <div className="text-center mb-16">
          <div className="inline-block border border-ink/10 rounded-full px-4 py-1.5 mb-6 bg-white shadow-sm">
            <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">99 Purity Gear</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-none tracking-tighter uppercase drop-shadow-sm">
            Represent The<br />Research.
          </h2>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-4 md:gap-6 grid-flow-dense">
          {MERCH_ITEMS.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isOthersHovered = hoveredIndex !== null && hoveredIndex !== i;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.23, 1, 0.32, 1],
                  delay: (i % 4) * 0.1 
                }}
                className={item.class}
              >
                <motion.div 
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    scale: isHovered ? 1.05 : isOthersHovered ? 0.95 : 1,
                    opacity: isOthersHovered ? 0.5 : 1,
                    zIndex: isHovered ? 50 : 1
                  }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="relative rounded-[32px] overflow-hidden bg-white border border-ink/5 group cursor-pointer shadow-sm hover:shadow-2xl hover:ring-2 hover:ring-primary/20 w-full h-full"
                >
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                    <h3 className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md mb-1">{item.name}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto overflow-hidden">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2">
                        Explore Gear &rarr;
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Bar */}
        <div className="mt-6 bg-white border border-ink/5 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 text-ink-muted text-[10px] md:text-xs font-bold tracking-widest uppercase text-center md:text-left">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> Premium Quality</span>
            <span className="hidden sm:flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Exclusive Merch</span>
            <span className="flex items-center gap-2"><Globe2 size={16} className="text-primary" /> Worldwide Shipping</span>
          </div>
          <FluidButton 
            href="/merchandise" 
            text="Shop All Gear" 
            variant="cyan"
          />
        </div>

      </div>
    </section>
  )
}
