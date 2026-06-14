import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FlaskConical, Network, Shield, Snowflake, Search } from 'lucide-react';
import vialImg from './assets/product image.png'; 

const DifferenceSection = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.4, 
      transition: { duration: 1.2, ease: "easeInOut", delay: 0.5 } 
    }
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.4, ease: "easeOut", delay: 1.5 } 
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#590000] via-[#850000] to-[#3a0000] py-24 px-4 md:px-10 overflow-hidden relative font-sans w-full min-h-[800px] flex items-center justify-center border-t border-white/10">
      
      {/* Background Tech Pattern & Logo */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <motion.svg 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.05, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        viewBox="0 0 200 300" 
        className="absolute right-[-5%] top-[10%] w-[600px] h-auto pointer-events-none z-0 fill-white"
      >
        <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
      </motion.svg>

      <div className="max-w-[88rem] w-full mx-auto relative z-10 flex flex-col xl:flex-row justify-between items-center h-full gap-16 xl:gap-8">
        
        {/* Left Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full xl:w-[35%] z-20 text-center xl:text-left mt-10 xl:mt-0"
        >
          <motion.h2 variants={itemVariants} className="text-white text-4xl md:text-8xl font-heading font-black uppercase leading-[0.9] tracking-tighter mb-6">
            The Sparta<br />Difference
          </motion.h2>
          <motion.p variants={itemVariants} className="text-red-100/80 text-base md:text-[20px] leading-relaxed mb-10 max-w-lg mx-auto xl:mx-0">
            Each batch is tested by an independent, accredited laboratory to confirm purity, identity, and composition. Results are documented and available by batch.
          </motion.p>
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-3 hover:bg-gray-200 transition-colors shadow-xl mx-auto xl:mx-0"
          >
            <FileText className="w-5 h-5" />
            Download COA (Certificate of Analysis)
          </motion.button>
        </motion.div>

        {/* Right Content - Diagram */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="w-full xl:w-[65%] relative flex justify-center items-center min-h-[600px]"
        >
          
          {/* Desktop Diagram Container (Scales maintaining aspect ratio) */}
          <div className="relative w-full max-w-[800px] aspect-[4/3] hidden lg:block">
            {/* SVG Connecting Lines */}
            <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Left Card 1 */}
              <motion.path variants={lineVariants} d="M 192 140 L 230 140 L 260 170 L 280 170" fill="none" stroke="white" strokeWidth="1.5" />
              <motion.circle variants={dotVariants} cx="280" cy="170" r="3" fill="white" />
              
              {/* Left Card 2 */}
              <motion.path variants={lineVariants} d="M 192 440 L 230 440 L 260 410 L 280 410" fill="none" stroke="white" strokeWidth="1.5" />
              <motion.circle variants={dotVariants} cx="280" cy="410" r="3" fill="white" />
              
              {/* Right Card 1 */}
              <motion.path variants={lineVariants} d="M 608 90 L 570 90 L 540 120 L 520 120" fill="none" stroke="white" strokeWidth="1.5" />
              <motion.circle variants={dotVariants} cx="520" cy="120" r="3" fill="white" />

              {/* Right Card 2 */}
              <motion.path variants={lineVariants} d="M 608 290 L 570 290 L 550 270 L 520 270" fill="none" stroke="white" strokeWidth="1.5" />
              <motion.circle variants={dotVariants} cx="520" cy="270" r="3" fill="white" />

              {/* Right Card 3 */}
              <motion.path variants={lineVariants} d="M 608 490 L 570 490 L 540 460 L 520 460" fill="none" stroke="white" strokeWidth="1.5" />
              <motion.circle variants={dotVariants} cx="520" cy="460" r="3" fill="white" />
            </svg>

            {/* Central Vial */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] z-10 flex flex-col items-center pointer-events-none">
              <motion.div variants={itemVariants}>
                <img 
                  src={vialImg} 
                  alt="Sparta Vial" 
                  className="w-full h-auto mix-blend-multiply drop-shadow-2xl pointer-events-auto"
                />
              </motion.div>
            </div>

            {/* Cards (Absolute positioned with percentages for responsive scaling) */}
            <motion.div variants={itemVariants} className="absolute top-[16.6%] left-0 pointer-events-auto">
              <div className="bg-[#f4f4f5] rounded-xl p-4 w-48 shadow-2xl relative hover:-translate-y-1 transition-transform cursor-pointer">
                <FlaskConical className="w-6 h-6 text-red-800 mb-2" />
                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Independently Lab Tested</h4>
                <p className="text-gray-600 text-[11px] leading-snug">Verified purity & composition.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="absolute top-[66.6%] left-0 pointer-events-auto">
              <div className="bg-[#f4f4f5] rounded-xl p-4 w-48 shadow-2xl relative hover:-translate-y-1 transition-transform cursor-pointer">
                <Network className="w-6 h-6 text-red-800 mb-2" />
                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Advanced Peptide Synthesis</h4>
                <p className="text-gray-600 text-[11px] leading-snug">Pioneering peptide research.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="absolute top-[8.3%] right-0 pointer-events-auto">
              <div className="bg-[#f4f4f5] rounded-xl p-4 w-48 shadow-2xl relative hover:-translate-y-1 transition-transform cursor-pointer">
                <Shield className="w-6 h-6 text-red-800 mb-2" />
                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Made in the United States</h4>
                <p className="text-gray-600 text-[11px] leading-snug">Manufactured and handled under controlled standards.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="absolute top-[41.6%] right-0 pointer-events-auto">
              <div className="bg-[#f4f4f5] rounded-xl p-4 w-48 shadow-2xl relative hover:-translate-y-1 transition-transform cursor-pointer">
                <Snowflake className="w-6 h-6 text-red-800 mb-2" />
                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Cold Chain Logistics</h4>
                <p className="text-gray-600 text-[11px] leading-snug">Stored and shipped under strict temperature control.</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="absolute top-[75%] right-0 pointer-events-auto">
              <div className="bg-[#f4f4f5] rounded-xl p-4 w-48 shadow-2xl relative hover:-translate-y-1 transition-transform cursor-pointer">
                <Search className="w-6 h-6 text-red-800 mb-2" />
                <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Full Traceability</h4>
                <p className="text-gray-600 text-[11px] leading-snug">Batch-specific sourcing and tracking.</p>
              </div>
            </motion.div>
          </div>

          {/* Mobile/Tablet Diagram Container (Responsive, Stacked) */}
          <div className="relative w-full flex flex-col items-center lg:hidden mt-12 gap-8">
             {/* Vial */}
             <motion.div variants={itemVariants} className="w-[220px] md:w-[280px] z-10">
               <img src={vialImg} alt="Sparta Vial" className="w-full h-auto mix-blend-multiply drop-shadow-2xl" />
             </motion.div>
             
             {/* Grid of Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
                <motion.div variants={itemVariants} className="bg-[#f4f4f5] rounded-xl p-4 shadow-2xl">
                  <FlaskConical className="w-6 h-6 text-red-800 mb-2" />
                  <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Independently Lab Tested</h4>
                  <p className="text-gray-600 text-[11px] leading-snug">Verified purity & composition.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f4f4f5] rounded-xl p-4 shadow-2xl">
                  <Network className="w-6 h-6 text-red-800 mb-2" />
                  <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Advanced Peptide Synthesis</h4>
                  <p className="text-gray-600 text-[11px] leading-snug">Pioneering peptide research.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f4f4f5] rounded-xl p-4 shadow-2xl">
                  <Shield className="w-6 h-6 text-red-800 mb-2" />
                  <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Made in the United States</h4>
                  <p className="text-gray-600 text-[11px] leading-snug">Manufactured and handled under controlled standards.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f4f4f5] rounded-xl p-4 shadow-2xl">
                  <Snowflake className="w-6 h-6 text-red-800 mb-2" />
                  <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Cold Chain Logistics</h4>
                  <p className="text-gray-600 text-[11px] leading-snug">Stored and shipped under strict temperature control.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#f4f4f5] rounded-xl p-4 shadow-2xl sm:col-span-2 sm:mx-auto sm:w-80">
                  <Search className="w-6 h-6 text-red-800 mb-2" />
                  <h4 className="text-gray-900 font-semibold text-sm mb-1 leading-tight">Full Traceability</h4>
                  <p className="text-gray-600 text-[11px] leading-snug">Batch-specific sourcing and tracking.</p>
                </motion.div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DifferenceSection;
