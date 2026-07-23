import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, FileText, MapPin, Beaker, Activity, Brain, Fingerprint, Dna, FlaskConical, ArrowRight } from 'lucide-react'
import { ResearchInquiryForm } from './ResearchInquiryForm'
import { FluidButton } from '@/components/ui/fluid-button'
import { HeroSearchComponent } from './HeroSearchComponent'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Research Compound Sourcing for Laboratories | 99 Purity Peptides',
  description: 'US-based, third-party lab-verified research compounds for accredited laboratories and institutions. Research use only. Submit your requirements to connect with our research supply team.',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function ResearchInquiryPage() {
  const payload = await getPayload({ config: configPromise })
  
  // Optimize query to prevent timeouts by only fetching needed products
  const { docs: allProducts } = await payload.find({
    collection: 'products',
    where: {
      or: [
        { slug: { equals: 'bpc-tb-500-research-peptide-blend' } },
        { name: { like: 'KLOW' } },
        { name: { like: 'GLOW' } },
        { slug: { equals: 'ghk-cu' } }
      ]
    },
    limit: 10,
    depth: 1,
    overrideAccess: true,
  })

  const tb500 = allProducts.find(p => p.slug === 'bpc-tb-500-research-peptide-blend')
  const klow = allProducts.find(p => p.name.toLowerCase().includes('klow'))
  const glow = allProducts.find(p => p.name.toLowerCase().includes('glow'))
  const ghkcu = allProducts.find(p => p.slug === 'ghk-cu')

  const featuredProducts = [
    { name: 'Compound T-500 / B-157', product: tb500, fallbackSlug: 'bpc-tb-500-research-peptide-blend' },
    { name: 'KLOW Blend', product: klow, fallbackSlug: 'klow' },
    { name: 'GLOW Blend', product: glow, fallbackSlug: 'glow' },
    { name: 'GHK-Cu', product: ghkcu, fallbackSlug: 'ghk-cu' }
  ]

  return (
    <div className="flex flex-col flex-1 w-full bg-cream text-ink">
      
      {/* Main Content */}
      <main className="flex-grow relative">
        
        {/* Hero Section (Modeled after AboutHero) */}
        <section className="relative w-full h-[100dvh] min-h-[600px] md:min-h-[700px] bg-cream p-3 sm:p-5 md:p-8 overflow-hidden flex flex-col">
          <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-between">
            
            {/* Minimal Local Header */}
            <header className="absolute top-0 left-0 w-full z-50 py-6 md:py-8">
              <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 flex items-center justify-center md:justify-start">
                <Link href="/" className="pointer-events-none hover:opacity-80 transition-opacity">
                  <img 
                    src="/99 Images/99pp-Logo.png" 
                    alt="99 Purity Peptides" 
                    className="h-10 sm:h-12 w-auto object-contain" 
                  />
                </Link>
              </div>
            </header>

            {/* Border Ring Overlay */}
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[4rem] ring-1 ring-inset ring-white/5 pointer-events-none z-20" />

            {/* Background Image */}
            <Image
              src="/99 Images/vial-closeup.webp"
              alt="Research Peptides Vials"
              fill
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80"
              priority
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 z-10 pointer-events-none" />

            {/* Cutout & Button Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
              <div className="absolute -bottom-px left-0 right-0 mx-auto w-fit bg-cream rounded-t-[2.5rem] md:rounded-t-[4rem] pointer-events-auto p-3 sm:p-5 md:p-8 pt-6 md:pt-10 px-6 md:px-12 flex justify-center items-center">
                {/* Left Fillet */}
                <div 
                  className="absolute bottom-0 -left-[calc(2.5rem-1px)] w-10 h-10 md:-left-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0v100H0A100 100 0 0 0 100 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
                />
                {/* Right Fillet */}
                <div 
                  className="absolute bottom-0 -right-[calc(2.5rem-1px)] w-10 h-10 md:-right-[calc(4rem-1px)] md:w-16 md:h-16 bg-contain bg-no-repeat pointer-events-none z-0"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 0v100h100A100 100 0 0 1 0 0Z' fill='%23FAF7F2'/%3E%3C/svg%3E")` }}
                />
                <FluidButton 
                  href="#inquiry-form" 
                  variant="dark"
                  text={<>Submit Requirements</>}
                  className="relative z-10" 
                />
              </div>
            </div>

            {/* Main Content inside the card */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 w-full h-full max-w-[1440px] pb-32 pt-20 md:pb-24 md:pt-16 lg:pb-32 mx-auto">
              <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
                <div className="inline-block border border-white/20 rounded-full px-5 py-2 mb-4 md:mb-6 bg-black/40 backdrop-blur-md">
                  <span className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                    FOR RESEARCH & LABORATORY USE ONLY
                  </span>
                </div>
                
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-white tracking-tighter uppercase font-black drop-shadow-2xl mb-4 shadow-black">
                  Verified-Purity Research Compounds, Sourced for Serious Labs.
                </h1>
                
                <p className="mt-2 md:mt-4 text-white/80 text-sm sm:text-base md:text-xl lg:text-2xl max-w-4xl font-medium leading-relaxed mx-auto">
                  We supply accredited research institutions and laboratories with third-party HPLC/MS-verified compounds, full chain-of-custody documentation, and batch-specific certificates of analysis.
                </p>

                {/* Main Site Search Integration */}
                <HeroSearchComponent />

                <div className="mt-4 pt-4 border-t border-white/20 text-[10px] sm:text-xs text-white/60 max-w-2xl mx-auto uppercase tracking-widest font-bold leading-relaxed">
                  Not for human or veterinary use.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Highlights / Trust Banner */}
        <section className="bg-zinc-900 py-12 px-6 border-y border-white/10 relative z-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 text-center divide-x-0 md:divide-x divide-white/10">
              <div className="flex flex-col items-center justify-center p-4">
                <ShieldCheck className="w-8 h-8 text-primary mb-3 opacity-80" />
                <span className="text-white font-heading font-black tracking-widest uppercase text-sm md:text-base">505A/505B</span>
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-bold">Compliant Facility</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <FlaskConical className="w-8 h-8 text-primary mb-3 opacity-80" />
                <span className="text-white font-heading font-black tracking-widest uppercase text-sm md:text-base">In-House</span>
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-bold">Manufactured</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <MapPin className="w-8 h-8 text-primary mb-3 opacity-80" />
                <span className="text-white font-heading font-black tracking-widest uppercase text-sm md:text-base">USA Made</span>
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-bold">Domestic Supply</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <Beaker className="w-8 h-8 text-primary mb-3 opacity-80" />
                <span className="text-white font-heading font-black tracking-widest uppercase text-sm md:text-base">99.1%+ Pure</span>
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-bold">HPLC/MS Verified</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 md:col-span-1 col-span-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-2">
                  <span className="font-black text-lg">%</span>
                </div>
                <span className="text-white font-heading font-black tracking-widest uppercase text-sm md:text-base">30% Off</span>
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-bold">Research Discount</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Compounds Section */}
        <section className="py-24 px-6 relative bg-cream">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-ink mb-16 text-center uppercase tracking-tight">
              Featured Research Compounds
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((item, i) => {
                const slug = item.product?.slug || item.fallbackSlug;
                const dbImage = item.product?.images?.[0]?.image;
                const imgUrl = typeof dbImage === 'object' && dbImage?.url ? dbImage.url : '/99 Images/vial-closeup.webp';
                
                return (
                  <Link href={`/product/${slug}`} key={i} className="group flex flex-col bg-white border border-border/50 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                    <div className="w-full aspect-square bg-zinc-100 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                      <Image 
                        src={imgUrl} 
                        alt={item.name} 
                        fill 
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imgUrl.includes('vial-closeup') ? 'opacity-60 mix-blend-multiply' : ''}`} 
                      />
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-heading font-black text-ink mb-3 uppercase tracking-wider">{item.name}</h3>
                    
                    <p className="text-ink-muted text-xs leading-relaxed font-medium mt-auto mb-6">
                      For Research Use Only. Not for human or veterinary use. Minimum 99% HPLC/MS purity verified.
                    </p>
                    
                    <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-widest uppercase">
                      View Data <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Research Categories */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-ink mb-6 uppercase tracking-tight">
                Research Areas We Support
              </h2>
              <p className="text-ink-muted text-base md:text-lg font-medium leading-relaxed">
                Explore the categories our laboratory partners most frequently source for. This section is informational only — submit the form below to discuss your specific research requirements with our team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Activity, title: 'Metabolic & Endocrine Research', desc: 'Compounds studied in metabolic signaling and hormone-axis research models.' },
                { icon: Beaker, title: 'Tissue & Recovery Research', desc: 'Compounds used in models of tissue repair, regeneration, and inflammatory response.' },
                { icon: Brain, title: 'Cognitive & Neurological Research', desc: 'Compounds studied in models of neuroprotection, stress response, and cognitive performance.' },
                { icon: Fingerprint, title: 'Dermal & Connective Tissue Research', desc: 'Compounds used in dermal remodeling and connective-tissue research models.' },
                { icon: Dna, title: 'Longevity & Cellular Research', desc: 'Compounds studied in mitochondrial function and cellular aging research.' },
                { icon: FlaskConical, title: 'Custom & Blend Formulations', desc: 'Multi-compound research formulations developed to your lab\'s protocol specifications.' },
              ].map((category, i) => (
                <div key={i} className="group bg-cream border border-border/40 rounded-2xl p-8 transition-all duration-300 hover:bg-white hover:border-primary/40 hover:shadow-md">
                  <category.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-heading font-bold text-ink mb-3 uppercase tracking-wider">{category.title}</h3>
                  <p className="text-ink-muted text-sm font-medium leading-relaxed">{category.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 px-6 bg-cream border-y border-border/50 relative">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-ink mb-20 text-center uppercase tracking-tight">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 max-w-5xl mx-auto relative">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-border border-dashed border-t-2" />
              
              {[
                { step: '1', title: 'Submit Your Requirements', desc: 'Tell us about your institution, research focus, and what you need.' },
                { step: '2', title: 'We Review & Respond', desc: 'Our team confirms availability, documentation, and lead times.' },
                { step: '3', title: 'Documentation-First Fulfillment', desc: 'Every shipment ships with full COA and chain-of-custody records.' },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  <div className="w-14 h-14 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center font-heading font-black text-xl mx-auto mb-8 z-10 relative shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-ink mb-4 uppercase tracking-wider">{item.title}</h3>
                  <p className="text-ink-muted text-sm font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance / RUO Statement */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-sm">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-ink mb-6 uppercase tracking-widest">
              Research Use Only — Please Read
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-xs sm:text-sm text-ink-muted leading-loose text-left md:text-center font-medium">
              The content on this page has not been evaluated or approved by the U.S. Food and Drug Administration (FDA). Products referenced are offered exclusively for research and laboratory purposes and are not intended to diagnose, treat, cure, or prevent any disease. 99 Purity Peptides is not a compounding pharmacy and does not operate as a chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act. Products are not for human or veterinary use and are not intended for ingestion, injection, or any form of administration. By submitting the form below, you confirm you are inquiring on behalf of a laboratory, research institution, or accredited organization for research purposes only.
            </p>
          </div>
        </section>

        {/* Lead Capture Form Section */}
        <section className="py-24 px-6 bg-cream border-t border-border/50" id="inquiry-form">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-ink mb-6 uppercase tracking-tight">
                Tell Us What Your Research Requires
              </h2>
              <p className="text-ink-muted text-lg font-medium">
                Complete the form below to connect with our supply team.
              </p>
            </div>
            
            <div className="bg-white border border-border/50 rounded-[2rem] p-6 md:p-12 shadow-xl max-w-3xl mx-auto">
              <ResearchInquiryForm />
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-border/50 py-12 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-ink font-heading font-black uppercase tracking-widest mb-3">99 Purity Peptides &copy; {new Date().getFullYear()}</p>
            <p className="text-[10px] text-ink-subtle max-w-md uppercase tracking-wider leading-relaxed font-bold">
              For research and laboratory use only. Not for human or veterinary use.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-ink-muted">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/medical-disclaimer" className="hover:text-primary transition-colors">Medical Disclaimer</a>
            <a href="mailto:support@99puritypeptides.com" className="hover:text-primary transition-colors text-primary border-b border-primary/30 pb-0.5">support@99puritypeptides.com</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
