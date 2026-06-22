'use client'

import React from 'react'
import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

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

export function FaqSection() {
  return (
    <SharedFaqSection 
      title={
        <>
          FREQUENTLY<br />ASKED
        </>
      }
      faqs={faqs}
    />
  );
}

