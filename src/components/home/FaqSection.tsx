'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const faqs = [
  { question: "What is a research-use-only (RUO) peptide?", answer: "A research-use-only peptide is a laboratory-grade reagent designated exclusively for non-clinical research applications. RUO peptides are used in assay development, mechanistic studies, and analytical testing but are not intended for diagnostic, therapeutic, or human consumption purposes. This designation ensures clarity in laboratory research contexts." },
  { question: "What purity level is considered research-grade for peptides?", answer: "Research-grade peptides typically meet ≥99% purity as verified by reversed-phase HPLC. This purity threshold ensures minimal interference from impurities in sensitive laboratory applications including immunoassays, receptor binding studies, and enzyme-kinetic assays. All 99PurityPeptides products include HPLC chromatograms documenting purity levels." },
  { question: "What information should a peptide certificate of analysis include?", answer: "A comprehensive peptide COA should document HPLC purity percentages, mass spectrometry identity confirmation, peptide molecular weight, amino acid sequence, analytical test methods used, storage recommendations, and batch-specific impurity profiles. This documentation supports experimental validation and research protocol requirements in laboratory settings." },
  { question: "How do you verify peptide identity using mass spectrometry?", answer: "Peptide identity is verified through liquid chromatography-mass spectrometry (LC-MS), which measures the peptide's molecular weight and confirms it matches the expected value based on amino acid sequence. This analytical method detects sequence errors, modifications, or contamination that could affect research outcomes and assay reliability." },
  { question: "What storage conditions are recommended for lyophilized peptides?", answer: "Lyophilized research peptides should be stored at −20°C in sealed containers with desiccant to prevent moisture absorption. This maintains peptide stability and prevents degradation during long-term storage. Upon reconstitution, peptide solutions should be aliquoted to minimize freeze-thaw cycles and stored according to specific peptide characteristics and experimental requirements." },
  { question: "How do peptide reagents support assay development in labs?", answer: "Peptide reagents serve as substrates, controls, standards, and target molecules in laboratory assay development. Applications include enzyme-kinetic assays using peptide substrates, immunoassay development with peptide antigens, receptor binding studies with peptide ligands, and epitope mapping using peptide fragments. Research-grade purity ensures reproducible assay performance." },
  { question: "What are common impurities in synthetic research peptides?", answer: "Common impurities in synthetic peptides include truncated sequences (deletion peptides), peptides with substitution errors, residual coupling reagents, salts from synthesis and purification, and moisture content. HPLC purity testing identifies and quantifies these impurities, while certificates of analysis document impurity profiles for research transparency and quality assessment." },
  { question: "How can laboratories ensure peptide batch-to-batch consistency?", answer: "Laboratories ensure peptide consistency by verifying each batch's certificate of analysis, comparing HPLC chromatograms across orders, confirming mass spectrometry data matches specifications, and conducting initial validation testing before integration into experimental protocols. Reputable suppliers maintain controlled synthesis and quality control processes to minimize batch variation." },
  { question: "How do peptide reagents support receptor-binding studies?", answer: "Peptide reagents function as ligands, competitors, or probes in receptor-binding assays. Synthetic peptides enable investigation of receptor-ligand interactions, binding affinity determination, structure-activity relationship (SAR) studies, and signaling pathway research. High-purity peptides reduce non-specific binding and improve assay sensitivity in laboratory receptor research applications." },
  { question: "What questions should a research lab ask a peptide vendor?", answer: "Research laboratories should ask peptide vendors about: analytical testing methods used (HPLC, MS specifications), what's included in certificates of analysis, peptide synthesis methodology, storage and handling recommendations, batch-to-batch consistency protocols, documentation provided with shipments, and technical support availability for application-specific guidance. Reputable vendors provide transparent analytical data and research-focused customer service." }
];

const FaqItem = ({ 
  faq, 
  index,
  onHoverStart,
  onHoverEnd
}: { 
  faq: { question: string; answer: string }; 
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
      className="border-t border-ink/20 py-8 lg:py-12 group md:cursor-none cursor-pointer transition-colors duration-300 hover:bg-ink/[0.02]"
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
      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] flex flex-col lg:flex-row w-full gap-6 lg:gap-8 justify-between items-start">
        
        {/* Left: Num + Question */}
        <div className="flex flex-1 gap-4 sm:gap-6 md:gap-12 lg:gap-32 items-start w-full lg:w-1/2">
          <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium text-ink/40 group-hover:text-primary transition-colors duration-300">
            {num}
          </span>
          <h3 className="font-heading text-[1.2rem] sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-ink leading-tight max-w-full sm:max-w-lg break-words">
            {faq.question}
          </h3>
        </div>

        {/* Right: Answer + Arrow */}
        <div className="w-full lg:w-5/12 flex justify-between items-start gap-8">
          <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="overflow-hidden flex-1"
          >
            <p className="text-ink/80 text-base md:text-lg leading-relaxed pt-2 lg:pt-0 pr-4">
              {faq.answer}
            </p>
          </motion.div>
          <div className="hidden md:block flex-shrink-0">
            <ArrowUpRight className={`w-8 h-8 text-primary transition-transform duration-500 transform ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export function FaqSection() {
  const [isHoveringFaq, setIsHoveringFaq] = useState(false);

  // Use MotionValues to prevent React re-renders on mousemove (fixes scroll lag)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; // Prevent heavy JS tracking on mobile devices
      cursorX.set(e.clientX - 50);
      cursorY.set(e.clientY - 50);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  return (
    <section className="bg-cream w-full py-32 relative z-30 font-sans">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-full bg-ink text-cream font-bold text-[10px] uppercase tracking-widest text-center shadow-2xl"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring,
          width: 100, 
          height: 100 
        }}
        animate={{
          scale: isHoveringFaq ? 1 : 0,
          opacity: isHoveringFaq ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="max-w-[70px] leading-tight text-sm">READ</span>
      </motion.div>

      <div className="container mx-auto px-4 md:px-10 max-w-[1600px] mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full">
          <p className="text-ink/50 text-sm font-bold tracking-widest uppercase hidden md:block mb-6 md:mb-0">
            (faqs)
          </p>
          <h2 className="font-heading text-[2.5rem] sm:text-[clamp(3rem,9vw,140px)] font-black text-ink text-left md:text-right uppercase leading-[0.85] tracking-tighter w-full break-words">
            FREQUENTLY<br />ASKED
          </h2>
        </div>
      </div>

      <div className="w-full">
        {faqs.map((faq, index) => (
          <FaqItem 
            key={index} 
            faq={faq} 
            index={index} 
            onHoverStart={() => setIsHoveringFaq(true)}
            onHoverEnd={() => setIsHoveringFaq(false)}
          />
        ))}
        {/* Final border bottom */}
        <div className="border-t border-ink/20 w-full" />
      </div>
    </section>
  );
}

