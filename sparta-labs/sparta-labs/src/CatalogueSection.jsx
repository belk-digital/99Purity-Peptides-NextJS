import React from 'react';
import { motion } from 'framer-motion';
import retatrutideImg from './assets/retatrutidre.jpg';
import handImg from './assets/hand.png';

const CatalogueSection = () => {
  return (
    <section className="bg-black w-full py-24 px-4 md:px-10 relative z-30 font-sans border-t border-white/5">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row justify-between items-end mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase w-full md:w-1/2">
            SELECTED<br />REFERENCES<span className="text-primary">.</span>
          </h2>
          <p className="text-white text-base md:text-[20px] max-w-md text-left md:text-right mt-6 md:mt-0 leading-relaxed font-medium">
            A small catalogue of research-grade peptides. Each batch independently verified, sealed and traceable to the milligram.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Featured Card (Left) */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-8 w-full lg:w-1/2 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 tracking-widest uppercase z-10">
              <span>NXP-024</span>
              <span className="flex items-center text-white"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span> IN STOCK</span>
            </div>
            
            {/* Giant Background Spartan Helmet Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
              <svg 
                viewBox="0 0 200 300" 
                className="h-[450px] w-auto opacity-10 fill-primary -mt-20"
              >
                <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z"/>
              </svg>
            </div>

            <div className="flex-1 flex items-center justify-center py-8 z-10 relative">
              <img src={retatrutideImg} alt="Retatrutide" className="h-96 w-auto object-contain drop-shadow-2xl" />
            </div>

            <div className="flex justify-between items-end z-10 relative">
              <div>
                <p className="text-primary text-[10px] tracking-widest uppercase mb-1 font-bold">FEATURED</p>
                <h3 className="font-heading text-3xl font-bold text-white uppercase mb-1 tracking-tight">Retatrutide</h3>
                <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">10MG - 98%</p>
              </div>
              <div className="text-2xl font-bold text-white font-heading tracking-tight">
                €189
              </div>
            </div>
          </div>

          {/* List (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            {/* Item 1 */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center shadow-2xl relative overflow-hidden group">
              <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img src={handImg} alt="Tirzepatide" className="w-full h-full object-cover" />
              </div>
              <div className="ml-6 flex-1">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1 font-semibold">NXP-019</p>
                <h3 className="font-heading text-xl font-bold text-white uppercase mb-1 tracking-tight">Tirzepatide</h3>
                <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">15MG - 98%</p>
              </div>
              <div className="flex flex-col items-end justify-between h-24">
                <div className="text-lg font-bold text-white font-heading tracking-tight">€159</div>
                <button className="bg-white hover:bg-gray-200 text-black text-[9px] font-bold px-6 py-2 rounded-full uppercase tracking-widest transition-all shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center shadow-2xl relative overflow-hidden group">
              <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img src={retatrutideImg} alt="Retatrutide" className="w-full h-full object-contain drop-shadow-md scale-110" />
              </div>
              <div className="ml-6 flex-1">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1 font-semibold">NXP-019</p>
                <h3 className="font-heading text-xl font-bold text-white uppercase mb-1 tracking-tight">Retatrutide</h3>
                <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">15MG - 98%</p>
              </div>
              <div className="flex flex-col items-end justify-between h-24">
                <div className="text-lg font-bold text-white font-heading tracking-tight">€159</div>
                <button className="bg-white hover:bg-gray-200 text-black text-[9px] font-bold px-6 py-2 rounded-full uppercase tracking-widest transition-all shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex items-center shadow-2xl relative overflow-hidden group">
              <div className="w-32 h-32 bg-white/5 border border-white/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img src={handImg} alt="GHK-Cu" className="w-full h-full object-cover" />
              </div>
              <div className="ml-6 flex-1">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1 font-semibold">NXP-019</p>
                <h3 className="font-heading text-xl font-bold text-white uppercase mb-1 tracking-tight">GHK-Cu</h3>
                <p className="text-gray-400 text-[10px] tracking-widest uppercase font-semibold">15MG - 98%</p>
              </div>
              <div className="flex flex-col items-end justify-between h-24">
                <div className="text-lg font-bold text-white font-heading tracking-tight">€159</div>
                <button className="bg-white hover:bg-gray-200 text-black text-[9px] font-bold px-6 py-2 rounded-full uppercase tracking-widest transition-all shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-white hover:bg-gray-200 text-black text-[10px] font-bold px-10 py-4 rounded-full uppercase tracking-widest transition-colors shadow-lg backdrop-blur-md">
            View Full Catalogue
          </button>
        </div>
      </div>
    </section>
  );
};

export default CatalogueSection;
