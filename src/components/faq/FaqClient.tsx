'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useScroll, useMotionValueEvent } from 'framer-motion'
import { faqData } from '@/data/faqs'
import { FaqCategorySection } from './FaqCategorySection'
import { FaqHero } from './FaqHero'

export function FaqClient() {
  const [activeCategory, setActiveCategory] = useState<string>(faqData[0]?.category || '');
  const [isHoveringFaq, setIsHoveringFaq] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(115); // default fallback
  
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Dynamically calculate the header height so tabs sit exactly below it
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector('.fixed.top-0.inset-x-0.z-sticky');
      if (headerEl) {
        // We add a little buffer (10px) to give it some breathing room below the floating pill
        setHeaderHeight(headerEl.getBoundingClientRect().height + 10);
      }
    };
    
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    // Observe body class changes in case the announcement bar is closed
    const observer = new MutationObserver(updateHeaderHeight);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 20) {
      if (difference > 0 && y > 150) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      lastYRef.current = y;
    }
  });

  // Smooth cursor tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      cursorX.set(e.clientX - 50);
      cursorY.set(e.clientY - 50);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  // Intersection Observer for highlighting active tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section that is closest to the top
        let visibleSection = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSection = entry.target.getAttribute('data-category');
            break; // Just take the first one that intersects well
          }
        }
        if (visibleSection) {
          setActiveCategory(visibleSection);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the top 20-40% of the screen
        threshold: 0
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`faq-category-${category.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      // Add a bit of offset for the sticky header/mobile tabs
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-cream min-h-screen relative font-sans text-ink">
      
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

      {/* Hero Header */}
      <FaqHero />

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row relative">
        
        {/* Mobile Tabs (Sticky) */}
        <div 
          className="md:hidden sticky z-40 bg-cream/90 backdrop-blur-md border-b border-ink/10 shadow-sm w-full transition-all duration-300 ease-out"
          style={{ top: headerHidden ? '0px' : `${headerHeight}px` }}
        >
          <div className="flex overflow-x-auto no-scrollbar py-4 px-4 gap-3 items-center">
            {faqData.map((categoryData) => (
              <button
                key={categoryData.category}
                onClick={() => scrollToCategory(categoryData.category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === categoryData.category
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-transparent text-ink/60 border-ink/10 hover:border-ink/30'
                }`}
              >
                {categoryData.category}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar (Sticky) */}
        <aside 
          className="hidden md:block w-1/3 lg:w-1/4 pt-16 pr-2 pl-10 border-r border-ink/10 sticky self-start overflow-y-auto pb-10 transition-all duration-300 ease-out"
          style={{ 
            top: headerHidden ? '0px' : `${headerHeight}px`,
            height: `calc(100vh - ${headerHidden ? 0 : headerHeight}px)` 
          }}
          data-lenis-prevent="true"
        >
          <div className="pr-6">
            <h3 className="font-heading text-xl font-bold uppercase tracking-tight mb-8 text-ink/40">
              Categories
            </h3>
            <ul className="flex flex-col gap-2">
              {faqData.map((categoryData) => (
                <li key={categoryData.category}>
                  <button
                    onClick={() => scrollToCategory(categoryData.category)}
                    className={`w-full text-left py-3 px-4 rounded-xl text-sm md:text-base font-medium transition-all duration-300 relative group overflow-hidden ${
                      activeCategory === categoryData.category
                        ? 'text-cream'
                        : 'text-ink/60 hover:text-ink hover:bg-ink/5'
                    }`}
                  >
                    {activeCategory === categoryData.category && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute inset-0 bg-ink z-0 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 leading-tight block">
                      {categoryData.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-10 lg:p-16">
          <div className="max-w-4xl mx-auto">
            {faqData.map((categoryData, i) => (
              <div 
                key={categoryData.category}
                id={`faq-category-${categoryData.category.replace(/\s+/g, '-').toLowerCase()}`}
                data-category={categoryData.category}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className="pt-8 scroll-mt-[120px] md:scroll-mt-16"
              >
                <FaqCategorySection 
                  category={categoryData} 
                  onHoverStart={() => setIsHoveringFaq(true)}
                  onHoverEnd={() => setIsHoveringFaq(false)}
                />
              </div>
            ))}
            
            {/* Research Disclaimer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="mt-24 pt-8 border-t border-ink/10"
            >
              <div className="relative overflow-hidden rounded-3xl bg-ink/10 p-[1px] group transition-all duration-500 hover:shadow-2xl">
                {/* Premium Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative bg-ink h-full w-full rounded-[23px] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden">
                  {/* Premium SVG Noise */}
                  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-screen z-0">
                    <filter id="faq-noise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#faq-noise)" />
                  </svg>
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10 text-cream/70 text-sm md:text-base font-light leading-relaxed">
                    <span className="font-heading font-bold text-primary tracking-[0.15em] uppercase text-xs block mb-1.5">
                      Research Disclaimer
                    </span>
                    All products across every category are <strong className="text-white font-medium">for research use only</strong> and <strong className="text-white font-medium">not for human or veterinary use, diagnosis or treatment</strong>.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        
      </div>
    </div>
  )
}
