'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Globe2 } from 'lucide-react';

const MERCH_ITEMS = [
  { name: 'Canvas Tote', image: '/99 Images/merch/merch_tote_bag_1781758420743.png', class: 'md:col-span-1 md:row-span-2' },
  { name: 'Premium T-Shirt', image: '/99 Images/merch/merch_t_shirt_1781758435328.png', class: 'md:col-span-1 md:row-span-1' },
  { name: 'Research Hoodie', image: '/99 Images/merch/merch_hoodie_1781758456477.png', class: 'md:col-span-1 md:row-span-1' },
  { name: 'Enamel Keyring', image: '/99 Images/merch/merch_keyring_1781758546025.png', class: 'md:col-span-1 md:row-span-2' },
  { name: 'Lab Notebook', image: '/99 Images/merch/merch_notebook_1781758535829.png', class: 'md:col-span-1 md:row-span-1' },
  { name: 'Thermos Bottle', image: '/99 Images/merch/merch_bottle_1781758466668.png', class: 'md:col-span-1 md:row-span-2' },
  { name: 'Shipping Box', image: '/99 Images/merch/merch_box_1781758512334.png', class: 'md:col-span-2 md:row-span-1' },
  { name: 'Lanyard', image: '/99 Images/merch/merch_lanyard_1781758525888.png', class: 'md:col-span-1 md:row-span-2' },
  { name: 'Coffee Cup', image: '/99 Images/merch/merch_coffee_cup_1781758489600.png', class: 'md:col-span-1 md:row-span-1' },
  { name: 'Research Cap', image: '/99 Images/merch/merch_cap_1781758478975.png', class: 'md:col-span-2 md:row-span-1' },
];

export function MerchandiseSection() {
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
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-4 md:gap-6">
          {MERCH_ITEMS.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 0.98 }}
              className={`relative rounded-[32px] overflow-hidden bg-white border border-ink/5 group cursor-pointer shadow-sm hover:shadow-md transition-shadow ${item.class}`}
            >
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">{item.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="mt-6 bg-white border border-ink/5 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 text-ink-muted text-[10px] md:text-xs font-bold tracking-widest uppercase text-center md:text-left">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> Premium Quality</span>
            <span className="hidden sm:flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Exclusive Merch</span>
            <span className="flex items-center gap-2"><Globe2 size={16} className="text-primary" /> Worldwide Shipping</span>
          </div>
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-colors w-full md:w-auto">
            Shop All Gear
          </button>
        </div>

      </div>
    </section>
  )
}
