import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Play, Star, ShieldCheck, FileText, Truck, Sparkles, Menu, X } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import retatrutideImg from './assets/retatrutidre.jpg';
import handImg from './assets/hand.png';
import CatalogueSection from './CatalogueSection';
import CategoriesSection from './CategoriesSection';
import BenefitsSection from './BenefitsSection';
import FaqSection from './FaqSection';
import Footer from './Footer';
import Beams from './Beams';
import StarBorder from './StarBorder';
import DifferenceSection from './DifferenceSection';
import HeroSection from './HeroSection';
import Preloader from './Preloader';
import ScrollNavbar from './ScrollNavbar';

function App() {
  const vialRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // GSAP Floating Animation for the Vial
  useEffect(() => {
    if (vialRef.current) {
      gsap.to(vialRef.current, {
        y: -30,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative font-sans">
      <Preloader />
      <ScrollNavbar isScrolled={isScrolled} />
      <HeroSection isScrolled={isScrolled} />

      <BenefitsSection />
      <CatalogueSection />
      <DifferenceSection />
      <CategoriesSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

export default App;
