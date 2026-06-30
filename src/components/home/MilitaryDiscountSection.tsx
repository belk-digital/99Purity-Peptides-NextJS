'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, IdCard, User, Mail, ChevronsUp, ChevronDown, Upload, CheckCircle2 } from 'lucide-react';
import { FluidButton } from '@/components/ui/fluid-button';

export function MilitaryDiscountSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");

  const branches = [
    { id: 'army', label: 'US Army' },
    { id: 'navy', label: 'US Navy' },
    { id: 'airforce', label: 'US Air Force' },
    { id: 'marines', label: 'US Marine Corps' },
    { id: 'coastguard', label: 'US Coast Guard' },
    { id: 'spaceforce', label: 'US Space Force' },
    { id: 'other', label: 'Other / Veteran' }
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section 
      className="relative z-50 w-full py-24 md:py-32 bg-cream font-sans"
      style={{ cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'%3E%3Cdefs%3E%3CclipPath id='usa'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path='url(%23usa)'%3E%3Crect width='24' height='24' fill='%23FFF'/%3E%3Crect x='3' width='3' height='24' fill='%23B31942'/%3E%3Crect x='9' width='3' height='24' fill='%23B31942'/%3E%3Crect x='15' width='3' height='24' fill='%23B31942'/%3E%3Crect x='21' width='3' height='24' fill='%23B31942'/%3E%3Cpath d='M0 0h24v11H0z' fill='%230A3161'/%3E%3Cpolygon points='12,3 13.2,6.5 17,6.5 14,8.5 15,12 12,10 9,12 10,8.5 7,6.5 10.8,6.5' fill='%23FFF'/%3E%3C/g%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' fill='none' stroke='%23FFF' stroke-width='2'/%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' fill='none' stroke='%230A3161' stroke-width='0.5'/%3E%3C/svg%3E\") 18 18, auto" }}
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/99 Images/millitary-bg-1.webp" 
          alt="Military Background" 
          fill 
          className="object-cover hidden md:block" 
        />
        <Image 
          src="/99 Images/millitary-bg-mobile-1.webp" 
          alt="Military Background" 
          fill 
          className="object-cover object-left md:hidden" 
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/60 md:bg-cream/40 pointer-events-none" />
        
        {/* Seamless Fade Top & Bottom */}
        <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-cream to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-10 max-w-[88rem] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text (Top on Mobile, Right on Desktop) */}
          <div className="w-full flex flex-col text-ink order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
                Honoring Your Service
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase leading-[1.1] tracking-tighter mb-6">
                Exclusive 30% <br /> Military Discount
              </h2>
              <p className="text-ink/80 text-base md:text-lg leading-relaxed font-light mb-8 w-full">
                As a thank you for your service, we are proud to offer an exclusive 30% discount on your order. Please select your branch and upload a copy of your Military ID or Discharge Papers (DD-214) below.
              </p>

              <div className="bg-white border border-black/5 shadow-sm rounded-2xl p-5 md:p-6 w-full group hover:border-black/10 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4 md:gap-5">
                  {/* Icon Container */}
                  <div className="mt-0.5">
                    <div className="bg-cream border border-black/5 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-ink font-black text-sm md:text-base tracking-[0.1em] uppercase mb-1.5 flex items-center gap-2">
                      Privacy & Security Notice
                    </h4>
                    <p className="text-ink/75 text-xs md:text-sm leading-relaxed font-medium">
                      For your protection, please <span className="font-bold text-ink">redact (black out)</span> sensitive information like your SSN. Documents are securely encrypted for review and <span className="font-bold text-primary">permanently destroyed</span> from our servers immediately upon approval.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form (Bottom on Mobile, Left on Desktop) */}
          <div className="w-full xl:w-[85%] order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-4 relative z-10"
                  >
                    <h3 className="text-2xl font-black font-heading text-white uppercase tracking-tighter mb-2 drop-shadow-md">
                      Verify Status
                    </h3>

                    {/* ID Upload */}
                    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-black/5 w-full hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-center w-10 text-primary">
                        <IdCard className="w-6 h-6" />
                      </div>
                      <div className="w-px h-8 bg-black/10"></div>
                      <div className="flex-1 flex justify-between items-center pl-2">
                        <span className="font-bold text-ink text-sm">ID Photo</span>
                        <button type="button" className="flex items-center gap-2 border border-dashed border-ink/30 px-3 md:px-4 py-2 rounded-lg text-ink/70 hover:text-primary hover:border-primary transition-colors text-[10px] md:text-xs font-bold uppercase tracking-wide">
                          <Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Upload</span>
                        </button>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-black/5 w-full focus-within:border-primary/50 transition-colors group">
                      <div className="flex items-center justify-center w-10 text-primary">
                        <User className="w-6 h-6 group-focus-within:scale-110 transition-transform" />
                      </div>
                      <div className="w-px h-8 bg-black/10"></div>
                      <div className="flex-1 flex flex-col justify-center pl-2">
                        <label className="font-bold text-ink text-sm">Full Name</label>
                        <input required type="text" placeholder="Enter your full name" className="bg-transparent border-none outline-none text-ink/70 text-sm placeholder:text-ink/40 w-full mt-0.5" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-black/5 w-full focus-within:border-primary/50 transition-colors group">
                      <div className="flex items-center justify-center w-10 text-primary">
                        <Mail className="w-6 h-6 group-focus-within:scale-110 transition-transform" />
                      </div>
                      <div className="w-px h-8 bg-black/10"></div>
                      <div className="flex-1 flex flex-col justify-center pl-2">
                        <label className="font-bold text-ink text-sm">Email Address</label>
                        <input required type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none text-ink/70 text-sm placeholder:text-ink/40 w-full mt-0.5" />
                      </div>
                    </div>

                    {/* Service Branch Custom Dropdown */}
                    <div className="relative z-[100]" ref={dropdownRef}>
                      <div 
                        className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-black/5 w-full focus-within:border-primary/50 transition-colors group cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <div className="flex items-center justify-center w-10 text-primary">
                          <ChevronsUp className="w-6 h-6 group-focus-within:scale-110 transition-transform" />
                        </div>
                        <div className="w-px h-8 bg-black/10"></div>
                        <div className="flex-1 flex flex-col justify-center pl-2">
                          <label className="font-bold text-ink text-sm cursor-pointer">Service Branch</label>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className={`text-sm ${selectedBranch ? 'text-ink' : 'text-ink/40'}`}>
                              {selectedBranch ? branches.find(b => b.id === selectedBranch)?.label : 'Select your branch'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-ink/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 w-full mt-2 bg-white border border-black/5 shadow-xl rounded-xl overflow-hidden"
                          >
                            <div className="py-2 flex flex-col">
                              {branches.map((branch) => (
                                <button
                                  key={branch.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedBranch(branch.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`text-left px-5 py-3 text-sm transition-colors ${
                                    selectedBranch === branch.id 
                                      ? 'bg-primary/10 text-primary font-bold' 
                                      : 'text-ink/70 hover:bg-black/5 hover:text-ink'
                                  }`}
                                >
                                  {branch.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-4">
                      <FluidButton type="submit" text="Submit for Verification" className="w-full min-w-full" variant="dark" />
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 relative z-10"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black font-heading text-ink uppercase tracking-tighter mb-4">
                      Documents Received
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed mb-8 max-w-sm">
                      Thank you for your service! Your documents have been securely routed for review. We will email your exclusive 30% discount code within 24 hours.
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-bold uppercase tracking-widest text-ink/50 hover:text-primary transition-colors border-b border-ink/20 hover:border-primary pb-1"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
