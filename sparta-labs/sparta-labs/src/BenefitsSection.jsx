import React from 'react';
import { ArrowRight, ShieldCheck, FlaskConical, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const BenefitsSection = () => {
  return (
    <section className="bg-[#0a0a0a] px-4 md:px-10 py-24 border-t border-white/5">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 md:gap-0"
        >
          <div className="w-full md:w-1/2">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-bold">The Sparta Standard</p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-0 md:mb-8">
              ENGINEERED FOR <br /> ABSOLUTE PRECISION<span className="text-primary">.</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-8 max-w-md mt-6 md:mt-0">
            <button className="inline-flex items-center gap-3 bg-white text-black text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200 shadow-xl">
              Discover Quality
              <div className="bg-black rounded-full p-2">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </button>
            <p className="text-white text-base md:text-[20px] text-left md:text-right leading-relaxed font-medium">
              Every compound is synthesized under strict laboratory conditions, independently verified via third-party analysis, and sealed to ensure maximum stability.
            </p>
          </div>
        </motion.div>

        {/* Row 2 - Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-black border border-white/5 rounded-2xl p-7 min-h-[350px] flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
            {/* Background Video */}
            <div 
              className="absolute inset-y-0 right-0 w-full md:w-1/2 z-0 opacity-60 mix-blend-screen pointer-events-none"
              style={{ 
                maskImage: 'linear-gradient(to left, black 0%, transparent 100%)', 
                WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%)' 
              }}
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              >
                <source src="https://res.cloudinary.com/denskvdyt/video/upload/v1781140181/animate_this_make_it_looped_no_pzkjaz.mp4" type="video/mp4" />
              </video>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20 transition-opacity duration-700 opacity-50 group-hover:opacity-100 z-0 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
              <div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 pointer-events-auto">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-white text-2xl font-medium leading-snug pointer-events-auto"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  99.1%+ Verified Purity
                </h3>
              </div>
              <p className="text-gray-400 text-base max-w-md mt-8 pointer-events-auto">
                We don't rely on manufacturer claims. Every single batch is independently tested by accredited third-party laboratories in the USA to guarantee minimum 99% purity before it ever reaches our inventory.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-black border border-white/5 rounded-2xl p-7 min-h-80 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[60px] transition-opacity duration-700 opacity-0 group-hover:opacity-100"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white text-2xl font-medium whitespace-pre-line">
                  {"Lyophilized\nStability"}
                </h3>
              </div>
              <p className="text-gray-400 text-base mt-8">
                Our peptides are lyophilized (freeze-dried) under vacuum to ensure long-term molecular stability during transit and storage.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-black border border-white/5 rounded-2xl p-7 min-h-80 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-[50px] transition-opacity duration-700 opacity-0 group-hover:opacity-100"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white text-2xl font-medium whitespace-pre-line">
                  {"Exact\nMilligram Dosing"}
                </h3>
              </div>
              <p className="text-gray-400 text-base mt-8">
                Precision is paramount. We guarantee exact milligram content per vial, completely eliminating the guesswork from your research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
