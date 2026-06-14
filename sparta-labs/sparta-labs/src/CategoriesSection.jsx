import React from 'react';
import { motion } from 'framer-motion';

import catRecovery from './assets/cat_recovery_v2.png';
import catReceptor from './assets/cat_receptor_v2.png';
import catMetabolic from './assets/cat_metabolic_v2.png';
import catGrowth from './assets/cat_growth_v2.png';
import catCognitive from './assets/cat_cognitive_v2.png';
import catCellular from './assets/cat_cellular_v2.png';
import catBioreg from './assets/cat_bioreg_v2.png';

const categories = [
  { id: 1, title: 'Recovery', image: catRecovery },
  { id: 2, title: 'Receptor Agonists', image: catReceptor },
  { id: 3, title: 'Metabolic', image: catMetabolic },
  { id: 4, title: 'Growth Factors', image: catGrowth },
  { id: 5, title: 'Cognitive', image: catCognitive },
  { id: 6, title: 'Cellular Health', image: catCellular },
  { id: 7, title: 'Bioregulators', image: catBioreg },
];

const CategoriesSection = () => {
  return (
    <section className="bg-black w-full py-0 relative z-30 font-sans border-t border-white/5 overflow-hidden">
      
      {/* Section Header */}
      <div className="container mx-auto px-4 md:px-10 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row justify-between items-end"
        >
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tighter uppercase w-full md:w-1/2">
            RESEARCH<br />CATEGORIES.
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-md text-left md:text-right mt-6 md:mt-0 leading-relaxed font-medium">
            Explore our specialized catalogue of high-purity peptides synthesized for specific research pathways and biological systems.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Vertical Slice Gallery */}
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-[60vh] min-h-[500px] max-h-[700px] cursor-grab active:cursor-grabbing">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="snap-center shrink-0 w-[85vw] sm:w-[45vw] md:w-[33.333vw] lg:w-[25vw] h-full relative group overflow-hidden border-r border-white/5 cursor-pointer"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full bg-black">
              <img 
                src={category.image} 
                alt={category.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-70 group-hover:opacity-100"
              />
              {/* Subtle bottom gradient for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-700" />
            </div>

            {/* Bottom Centered Text */}
            <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none px-4">
                <h3 
                  className="font-sans text-3xl md:text-4xl font-semibold text-white tracking-tight text-center drop-shadow-xl transition-all duration-500 group-hover:-translate-y-2"
                >
                  {category.title}
                </h3>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default CategoriesSection;
