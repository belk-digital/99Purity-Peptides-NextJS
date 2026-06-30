'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { FilterSidebar } from '@/components/shop/FilterSidebar'
import { ProductCard } from '@/components/shared/ProductCard'
import { Product } from '@/components/shop/PrimaryProductCard' // Re-use interface for now
import { motion, useInView } from 'framer-motion'
import { X, Filter, Search, ShieldCheck, FlaskConical, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { FluidButton } from '@/components/ui/fluid-button'
import { Category } from '@/components/shop/FilterSidebar'
import { getShopProducts } from '@/app/(frontend)/(shop)/actions'

import { SharedFaqSection } from '@/components/shared/SharedFaqSection'

const shopFaqs = [
  { question: "What research peptides are available from 99PurityPeptides?", answer: "99PurityPeptides offers an extensive catalog of laboratory-grade research peptides including individual amino acid sequences, modified peptides, peptide fragments, conjugated peptides, and custom synthesis options. Our inventory includes commonly requested research compounds for cellular studies, biochemical assays, receptor binding investigations, and molecular biology applications. All products are provided in lyophilized (freeze-dried) powder form with purity levels ranging from 95% to 99%+ as verified by analytical testing. Browse our complete catalog organized by sequence length, research category, or specific peptide families." },
  { question: "Are all 99PurityPeptides products tested for purity and quality?", answer: "Every research peptide undergoes rigorous third-party analytical testing before release. Our quality control process includes High-Performance Liquid Chromatography (HPLC) to verify purity percentages, Mass Spectrometry (MS) to confirm molecular weight and sequence accuracy, and peptide content analysis to ensure accurate concentration. Each product batch receives an individual Certificate of Analysis (COA) documenting test results, storage recommendations, and lot-specific data. This analytical verification ensures you receive research-grade materials meeting published specifications for your laboratory investigations." },
  { question: "What purity levels are standard for research peptides?", answer: "99PurityPeptides specializes in high-purity research compounds with most products achieving 95-99%+ purity as determined by HPLC analysis. Standard catalog peptides typically meet ≥95% purity suitable for most research applications. Premium-grade options offer ≥98% purity for experiments requiring exceptional quality, and custom synthesis can target >99% purity for highly sensitive analytical work. Product pages clearly indicate tested purity levels, and COAs provide exact percentage for your specific lot. Higher purity reduces experimental variables caused by impurities or synthesis by-products." },
  { question: "How do I interpret the Certificate of Analysis (COA)?", answer: "Certificates of Analysis include several key data points for research validation. The HPLC chromatogram shows the purity peak representing your target peptide versus any impurities; the percentage represents the area under the curve for your compound. Mass Spectrometry data confirms the molecular weight matches the theoretical weight calculated from the amino acid sequence. Peptide content indicates the actual peptide mass as a percentage of total powder weight (remainder being counterions and moisture). Storage conditions specify temperature requirements for maintaining stability. For assistance interpreting COA data, contact our technical team." },
  { question: "Do you offer custom peptide synthesis for specific research needs?", answer: "Yes. Our custom synthesis services produce research peptides not available in standard catalogs, including novel sequences, unusual modifications (phosphorylation, methylation, acetylation), fluorescent labels, biotinylation, cyclization, D-amino acid incorporation, and peptide libraries. Submit your sequence and modification requirements through our custom synthesis request form. Our synthesis team provides feasibility assessment, timeline estimates (typically 2-4 weeks depending on complexity), and pricing quotes. Minimum order quantities apply for custom work, with all products receiving the same rigorous analytical testing as catalog items." },
  { question: "What are proper storage instructions for research peptides?", answer: "Lyophilized (unopened) research peptides should be stored at -20°C (standard freezer temperature) in a dry environment protected from light and moisture. Under these conditions, most peptides maintain stability for 1-2 years or longer. Once reconstituted in solution, peptide stability decreases significantly—store reconstituted solutions at -20°C for short-term use (days to weeks) or -80°C for longer storage (months), depending on the specific sequence. Avoid repeated freeze-thaw cycles which degrade peptide integrity. Aliquot reconstituted peptides into single-use portions to minimize freeze-thaw damage. Always check product-specific COAs for sequence-dependent storage recommendations." },
  { question: "How should I reconstitute lyophilized peptides for laboratory use?", answer: "Reconstitution protocols depend on the peptide sequence and intended research application. General guidelines: use sterile, ultra-pure water or appropriate buffer (PBS, DMSO, acetic acid solution) based on peptide solubility characteristics. Add solvent slowly down the vial wall, avoid vigorous mixing that could denature peptides, and allow gentle dissolution at room temperature or 4°C. For peptides with poor water solubility, DMSO often serves as an initial solvent followed by dilution into aqueous buffers. Calculate final concentration based on peptide content percentage from your COA. Detailed reconstitution protocols are provided with each order and available on product pages." },
  { question: "What is the shelf life of research peptides?", answer: "Properly stored lyophilized peptides typically maintain stability for 2-3 years at -20°C, though exact shelf life varies by sequence composition. Peptides containing methionine, cysteine, or tryptophan may have shorter shelf life due to oxidation susceptibility. Reconstituted peptide solutions have significantly shorter stability—typically days to weeks at -20°C or several months at -80°C, depending on sequence and storage conditions. Always use peptides within the stability window indicated on the COA. For experiments requiring extended peptide use, consider ordering smaller quantities more frequently rather than storing large volumes long-term." },
  { question: "Can peptides be damaged during shipping or storage?", answer: "Research peptides are relatively stable when properly packaged and stored, but can degrade under adverse conditions. Our shipping protocols use temperature-controlled packaging with cold packs or dry ice to maintain product integrity during transit. Upon receipt, immediately transfer peptides to appropriate storage (-20°C for lyophilized products). Exposure to heat, humidity, or repeated temperature fluctuations accelerates degradation. If you suspect shipping damage (compromised packaging, warm products, visible moisture), do not use the material—contact us immediately for replacement. Proper storage and handling maintains peptide quality throughout its usable lifetime." },
  { question: "Should I aliquot peptides after reconstitution?", answer: "Yes, aliquoting is strongly recommended for laboratory best practices. Divide reconstituted peptide solutions into multiple small-volume vials representing single-use portions for your experiments. This approach minimizes freeze-thaw cycles that progressively damage peptide structure and reduce biological activity. Use sterile technique when aliquoting to prevent contamination. Label each aliquot with peptide identity, concentration, reconstitution date, and storage temperature. Store aliquots at -20°C or -80°C depending on anticipated usage timeline. This practice ensures consistent experimental results across multiple assays using material from the same synthesis batch." },
  { question: "Do you offer bulk discounts for laboratory peptide purchases?", answer: "Yes. Volume pricing is available for research institutions, universities, and biotech companies ordering large quantities of research peptides. Discount tiers typically begin at 10+ vials of the same peptide, with increasing discounts for 25+, 50+, and 100+ unit orders. For custom synthesis, bulk orders of the same sequence qualify for per-gram pricing reductions. Contact orders@99puritypeptides.com with your anticipated order volume to receive institutional pricing. Long-term supply agreements and contract manufacturing arrangements offer additional cost savings for ongoing research programs requiring consistent peptide supply." },
  { question: "Can I order research peptides in different quantities?", answer: "Research peptides are available in multiple package sizes to accommodate different experimental scales. Standard offerings include 1mg, 5mg, 10mg, 25mg, and larger quantities upon request. Product pages display available sizes with corresponding pricing. For expensive or rarely-used sequences, smaller quantities minimize waste. For high-throughput screening or long-term research projects, larger quantities provide better per-milligram value. Custom quantities beyond standard offerings can be requested through our sales team. Choose package sizes based on your experimental requirements, anticipated usage rate, and stability considerations for your storage conditions." },
  { question: "Are COAs available before ordering to verify product specifications?", answer: "Representative COAs for catalog peptides are available upon request to help researchers evaluate product suitability before purchase. Contact us with the catalog number or peptide sequence, and we'll provide a recent COA showing typical purity and analytical data for that product. Please note that COAs are lot-specific—your shipped product will include a COA for its specific batch, which may show minor variations from representative samples while still meeting guaranteed specifications. This pre-purchase COA review allows verification that our quality standards meet your experimental requirements." },
  { question: "How do I find specific peptides in your catalog?", answer: "Navigate our product catalog using multiple search and filter options. Search directly by peptide name, sequence, catalog number, or CAS number for known compounds. Browse by category (signaling peptides, enzyme substrates, receptor ligands, antimicrobial peptides, etc.) or by research application. Filter results by purity level (95%+, 98%+, 99%+), package size, price range, or availability status. Advanced search allows filtering by sequence characteristics like length, specific amino acids, or modifications. If you cannot locate a specific peptide, contact us—we may carry it under alternate nomenclature or can synthesize it as a custom order." },
  { question: "What information is included on product pages?", answer: "Each product page provides comprehensive information for research planning: peptide name and common aliases, amino acid sequence, molecular formula and weight, CAS number (when applicable), tested purity range, available package sizes and pricing, storage recommendations, solubility guidelines, and links to representative COAs. Many listings include reconstitution protocols, relevant research literature citations, and related products for comparative studies. Product pages serve as complete technical references for making informed purchasing decisions and planning experimental protocols before your order arrives." },
  { question: "Are all products manufactured in the USA for research compliance?", answer: "99PurityPeptides manufactures research compounds in US-based facilities operating under current Good Manufacturing Practices (cGMP) guidelines appropriate for research-grade materials. Domestic manufacturing ensures compliance with US regulatory frameworks governing research chemicals, enables faster quality control and delivery, and provides transparency in our supply chain. All products are labeled 'For Research Use Only – Not for Human Consumption' per regulatory requirements. US-based operations support American research institutions with reliable domestic supply of laboratory materials meeting recognized quality standards." },
  { question: 'What does "Research Use Only" mean for these products?', answer: '"Research Use Only" (RUO) designation means these peptides are manufactured and sold exclusively for laboratory investigation by qualified researchers in controlled settings. These products are not intended for, and must not be used for: human consumption or administration, medical treatment or diagnosis, veterinary applications, food or cosmetic production, or any purpose outside legitimate scientific research. Researchers must handle RUO materials according to institutional biosafety protocols, maintain appropriate documentation, and ensure compliance with their organization\'s research guidelines. This designation protects both researchers and suppliers under current regulatory frameworks.' },
  { question: "Do research peptides require special handling or safety precautions?", answer: "Handle all research peptides using standard laboratory safety practices. Wear appropriate personal protective equipment (gloves, lab coat, safety glasses). Work in well-ventilated areas or under fume hoods when reconstituting peptides, especially when using organic solvents like DMSO. Avoid skin contact, inhalation of powder, or ingestion. Safety Data Sheets (SDS) provided with each product detail specific hazards and recommended precautions. Dispose of peptide waste according to your institution's chemical waste protocols. While most research peptides present minimal hazard when properly handled, treat all laboratory chemicals with respect and follow your facility's biosafety and chemical hygiene plans." },
  { question: "Can I use these peptides for any purpose outside research?", answer: "No. 99PurityPeptides products are manufactured, labeled, and sold exclusively for in vitro laboratory research applications. Using these compounds for human consumption, athletic performance, bodybuilding, medical treatment, or any non-research purpose violates regulatory guidelines, our terms of sale, and potentially federal and state laws. We monitor purchases for compliance and reserve the right to refuse orders that appear intended for inappropriate use. Researchers must certify that products will be used only for legitimate scientific investigation in controlled laboratory environments under appropriate oversight." },
  { question: "Are your products approved by the FDA or other regulatory agencies?", answer: "Research peptides sold for laboratory investigation are not FDA-approved drugs and do not require FDA approval, as they are not intended for therapeutic use. These are research-grade chemical reagents for scientific study, similar to other laboratory supplies. 99PurityPeptides operates in compliance with applicable regulations governing the manufacture and sale of research chemicals. Our quality systems follow industry best practices, and products undergo analytical testing to meet labeled specifications. Researchers using these materials are responsible for ensuring their investigations comply with relevant oversight including institutional review boards, biosafety committees, and applicable research regulations." }
];

interface ShopClientProps {
  initialProducts: Product[]
  totalPages: number
  categories: Category[]
}

function ShopClientInner({ initialProducts, totalPages, categories }: ShopClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(totalPages > 1)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const lastScrollYRef = React.useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsScrollingDown(prev => {
             if (!prev) return true
             return prev
          })
        } else if (currentScrollY < lastScrollYRef.current) {
          setIsScrollingDown(prev => {
             if (prev) return false
             return prev
          })
        }
        lastScrollYRef.current = currentScrollY
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const loadMoreRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef, { margin: "400px" })

  // Filter update trigger
  useEffect(() => {
    const fetchFiltered = async () => {
      const categoriesParam = searchParams.getAll('category')
      const minP = searchParams.get('minPrice')
      const maxP = searchParams.get('maxPrice')
      
      const res = await getShopProducts({
        page: 1,
        categories: categoriesParam.length > 0 ? categoriesParam : undefined,
        inStock: searchParams.get('inStock') === 'true',
        onSale: searchParams.get('onSale') === 'true',
        minPrice: minP ? parseInt(minP) : undefined,
        maxPrice: maxP ? parseInt(maxP) : undefined,
        sort: searchParams.get('sort') || undefined,
      })

      if (res.success) {
        setProducts(res.products as Product[])
        setCurrentPage(1)
        setHasMore(res.hasNextPage || false)
      }
    }
    fetchFiltered()
  }, [searchParams])

  // Infinite scroll trigger
  useEffect(() => {
    if (isInView && hasMore && !isLoadingMore) {
      setIsLoadingMore(true)
      const fetchMore = async () => {
        const nextPage = currentPage + 1
        const categoriesParam = searchParams.getAll('category')
        const minP = searchParams.get('minPrice')
        const maxP = searchParams.get('maxPrice')

        const res = await getShopProducts({
          page: nextPage,
          categories: categoriesParam.length > 0 ? categoriesParam : undefined,
          inStock: searchParams.get('inStock') === 'true',
          onSale: searchParams.get('onSale') === 'true',
          minPrice: minP ? parseInt(minP) : undefined,
          maxPrice: maxP ? parseInt(maxP) : undefined,
          sort: searchParams.get('sort') || undefined,
        })

        if (res.success && res.products) {
          setProducts(prev => [...prev, ...(res.products as Product[])])
          setCurrentPage(nextPage)
          setHasMore(res.hasNextPage || false)
        } else {
          setHasMore(false)
        }
        setIsLoadingMore(false)
      }
      fetchMore()
    }
  }, [isInView, hasMore, isLoadingMore, currentPage, searchParams])

  const getActiveChips = () => {
    const chips: { key: string, label: string, value: string }[] = []
    searchParams.getAll('category').forEach(cat => chips.push({ key: `category-${cat}`, label: cat, value: cat }))
    if (searchParams.get('inStock') === 'true') chips.push({ key: 'inStock', label: 'In Stock', value: 'true' })
    if (searchParams.get('onSale') === 'true') chips.push({ key: 'onSale', label: 'On Sale', value: 'true' })
    return chips
  }

  const removeFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key.startsWith('category-')) {
      const currentCats = params.getAll('category').filter(c => c !== value)
      params.delete('category')
      currentCats.forEach(c => params.append('category', c))
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const activeChips = getActiveChips()

  return (
    <div className="w-full bg-cream min-h-screen font-sans">
      
      {/* 1. Curve Cut Hero Section */}
      <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[56px] [.announcement-closed_&]:pt-3 sm:p-5 sm:pt-[64px] [.announcement-closed_&]:sm:pt-5 md:p-8 md:pt-[76px] [.announcement-closed_&]:md:pt-8 font-sans overflow-hidden flex transition-[padding] duration-300">
        {/* Main Inner Container */}
        <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-center items-center">
          
          {/* Border Ring Overlay */}
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

          {/* Background Gradients */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/3 opacity-50" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 opacity-50" />

          {/* Background Image */}
          <Image
            src="/99 Images/vial-ice-closeup.webp"
            alt="Shop Background"
            fill
            priority
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-90 rounded-[2rem] md:rounded-[4rem]"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/50 to-black/60 z-10 pointer-events-none" />

          {/* Left Center Marquee Cutout */}
          <div className="absolute bottom-[32%] sm:bottom-[30%] md:bottom-[30%] -left-px bg-cream rounded-r-[3rem] md:rounded-r-[4rem] z-30 flex items-center w-[220px] sm:w-[280px] md:w-[360px] h-12 sm:h-16 md:h-20 shadow-xl">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] left-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Bottom Fillet (Inverted Corner) */}
            <div 
              className="absolute -bottom-[calc(3rem-1px)] left-0 w-12 h-12 md:-bottom-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 100V0h100A100 100 0 0 0 0 100Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            
            {/* Inner Masking Container */}
            <div className="w-full h-full relative overflow-hidden rounded-r-[3rem] md:rounded-r-[4rem] flex items-center">
              {/* Gradient mask for smooth fade in/out of marquee */}
              <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
              
              <motion.div 
                className="flex whitespace-nowrap items-center text-ink font-heading font-extrabold tracking-[0.2em] text-[10px] sm:text-xs md:text-sm w-max pointer-events-none"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <span className="flex items-center mx-4 md:mx-6">
                      <Award className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                      BUY 2 GET 1 FREE
                    </span>
                    <span className="flex items-center mx-4 md:mx-6">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-primary" />
                      FREE SHIPPING OVER $150
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Main Content inside the card */}
          <div className="relative z-20 flex flex-col items-center text-center px-5 sm:px-12 md:px-16 lg:px-24 w-full h-full max-w-8xl justify-center pb-32 sm:pb-0 sm:pt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] md:leading-[1.1] text-white tracking-tight uppercase font-black drop-shadow-2xl mb-4 md:mb-6 max-w-7xl w-full mx-auto">
                Synthetic Research Peptides for Laboratory Applications
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/70 text-sm sm:text-base md:text-xl max-w-2xl font-light leading-relaxed tracking-wide mb-8"
            >
              Documented synthetic research peptides are supplied for controlled laboratory and analytical research environments only.
            </motion.p>

          </div>

          {/* Bottom Left Product Highlights - Vertical Stepper */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-[15%] sm:bottom-8 md:bottom-12 left-4 sm:left-8 md:left-12 z-20 flex flex-col gap-2 sm:gap-5"
          >
            {[
              { icon: ShieldCheck, text: "≥99% HPLC Purity", subtext: "Independently Tested" },
              { icon: FlaskConical, text: "COA Verified", subtext: "Batch Certified" },
              { icon: Award, text: "Research Use Only", subtext: "Lab Grade" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 relative z-10 group cursor-default">
                {/* Icon Container */}
                <div className="flex items-center justify-center w-[26px] h-[26px] sm:w-[34px] sm:h-[34px] rounded-full bg-zinc-900 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)] shrink-0">
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                {/* Text */}
                <div className="flex flex-col justify-center">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-heading font-bold text-white/90 uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300 leading-tight">
                    {item.text}
                  </span>
                  {/* Subtext hidden on very small screens to avoid overlap with button */}
                  <span className="text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest font-medium hidden xs:block mt-0.5">
                    {item.subtext}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom Right Button Cutout */}
          <div className="absolute -bottom-px -right-px bg-cream rounded-tl-[3rem] md:rounded-tl-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 pl-6 md:pl-10 z-30 shadow-2xl">
            {/* Top Fillet (Inverted Corner) */}
            <div 
              className="absolute -top-[calc(3rem-1px)] right-0 w-12 h-12 md:-top-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            {/* Left Fillet (Inverted Corner) */}
            <div 
              className="absolute bottom-0 -left-[calc(3rem-1px)] w-12 h-12 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
            />
            <FluidButton 
              href="#products-grid" 
              text={<><span className="md:hidden">Shop</span><span className="hidden md:inline">Browse Catalog</span></>} 
              className="relative z-10" 
            />
          </div>

        </div>
      </div>

      <Container size="page" className="pb-12" id="products-grid">
        {/* Modern Minimal Filter Bar */}
        <div className={`flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10 py-4 sticky z-40 transition-all duration-300 ${isScrollingDown ? 'top-4 sm:top-6 opacity-100 translate-y-0' : 'top-[130px] sm:top-[140px] md:top-[150px] opacity-100 translate-y-0'}`}>
          <div className="flex items-center justify-between gap-4 w-full bg-white/95 backdrop-blur-2xl rounded-full px-2 py-2 border border-ink/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex items-center gap-2 pl-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full px-4 sm:px-6 gap-2 text-ink hover:bg-ink/5 transition-colors font-semibold uppercase tracking-widest text-[10px] sm:text-xs">
                    <Filter size={14} />
                    Filters {activeChips.length > 0 && <span className="bg-primary text-white w-4 h-4 flex items-center justify-center rounded-full text-[9px]">{activeChips.length}</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  sideOffset={16} 
                  className="w-[95vw] sm:w-[90vw] md:max-w-[800px] p-0 rounded-[2rem] border border-ink/10 ring-0 shadow-2xl bg-white/90 overflow-hidden backdrop-blur-3xl"
                >
                  <div className="relative z-10 max-h-[75vh] p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar">
                     <FilterSidebar categories={categories} />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:block w-px h-6 bg-ink/10 mx-2"></div>
              
              <span className="text-[10px] sm:text-xs text-ink/50 font-semibold uppercase tracking-widest hidden md:inline-block">
                {products.length} Results
              </span>
            </div>

            <Select 
              defaultValue={searchParams.get('sort') || 'newest'}
              onValueChange={(val) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('sort', val)
                router.push(`${pathname}?${params.toString()}`, { scroll: false })
              }}
            >
              <SelectTrigger className="w-auto min-w-[140px] bg-transparent border-0 focus:ring-0 shadow-none hover:bg-ink/5 rounded-full px-4 h-10 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-ink gap-2 transition-all">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent align="end" className="bg-white/95 backdrop-blur-3xl border-ink/10 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-2 min-w-[180px] sm:min-w-[200px] w-[90vw] max-w-[280px] sm:w-auto sm:max-w-none">
                <SelectItem value="newest" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">Newest Arrivals</SelectItem>
                <SelectItem value="price-asc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">Price: High to Low</SelectItem>
                <SelectItem value="name-asc" className="rounded-xl cursor-pointer text-[10px] sm:text-xs uppercase tracking-widest font-bold focus:bg-primary/5 focus:text-primary py-3 px-4 transition-colors">Alphabetical A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Chips Row */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 px-4 w-full">
              {activeChips.map(chip => (
                <button
                  key={chip.key}
                  onClick={() => removeFilter(chip.key.startsWith('category') ? 'category' : chip.key, chip.value)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-ink/[0.03] hover:bg-ink/[0.06] border border-ink/5 rounded-full transition-all group text-[9px] sm:text-[10px] font-bold uppercase tracking-widest"
                >
                  <span className="text-ink">{chip.label}</span>
                  <X size={12} className="text-ink/40 group-hover:text-ink" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Area */}
        {products.length > 0 ? (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
              {products.map((product, index) => (
                <motion.div 
                  key={product.slug} 
                  className="flex h-full w-full"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 12) * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Trigger & Loader */}
            {hasMore && (
              <div ref={loadMoreRef} className="w-full flex justify-center pt-24 pb-12">
                {isLoadingMore && (
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="w-8 h-8 text-ink" />
                    <span className="text-[10px] sm:text-xs font-bold text-ink/50 uppercase tracking-widest">Loading more...</span>
                  </div>
                )}
              </div>
            )}
            {!hasMore && (
              <div className="w-full text-center pt-24 pb-12 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/30">
                You've reached the end of the catalog.
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            icon={Search} 
            title="No products found" 
            description="Try adjusting your filters to find what you're looking for." 
            action={
              <FluidButton 
                onClick={() => router.push('/shop')} 
                text="Clear all filters"
                variant="dark"
              />
            }
          />
        )}
      </Container>
      <div className="-mt-16">
        <SharedFaqSection 
          title="Questions" 
          description="Common questions about research peptides, ordering, and lab standards"
          faqs={shopFaqs}
        />
      </div>
    </div>
  )
}

export function ShopClient(props: ShopClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream w-full" />}>
      <ShopClientInner {...props} />
    </Suspense>
  )
}
