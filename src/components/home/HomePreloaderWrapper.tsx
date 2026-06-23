'use client'

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const PreloaderContext = createContext({ isReady: true })
export const usePreloader = () => useContext(PreloaderContext)

export function HomePreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const maskContainerRef = useRef<HTMLDivElement>(null)
  const liquidRef = useRef<HTMLDivElement>(null)
  const realVialRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const counterContainerRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)

  // Physics Refs
  const engineRef = useRef<any>(null)
  const dropsRef = useRef<{body: any, el: HTMLDivElement}[]>([])
  const dropsContainerRef = useRef<HTMLDivElement>(null)

  // 4. Interactive Cursor Tracking (Parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current || isReady) return
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      gsap.to(wrapperRef.current, { x, y, duration: 0.8, ease: "power2.out" })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isReady])

  // Initialize Matter.js Engine
  useEffect(() => {
    import('matter-js').then((Matter) => {
      engineRef.current = Matter.Engine.create()
      const engine = engineRef.current
      engine.world.gravity.y = 1.2 // slightly floaty liquid feel
      
      const width = dropsContainerRef.current ? dropsContainerRef.current.offsetWidth : 240;
      const height = dropsContainerRef.current ? dropsContainerRef.current.offsetHeight : 528;

      // Ground body: starts at the bottom
      const ground = Matter.Bodies.rectangle(width / 2, height + 20, width * 2, 40, { isStatic: true })
      engine.groundBody = ground // store reference to move it later
      Matter.World.add(engine.world, ground)

      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)

      // Sync Loop: Updates DOM elements to match Matter.js physics bodies
      const syncLoop = () => {
         dropsRef.current.forEach(({body, el}) => {
           // Center the visual div onto the physics body position
           const radius = body.circleRadius || 8
           el.style.transform = `translate(${body.position.x - radius}px, ${body.position.y - radius}px)`
         })
         requestAnimationFrame(syncLoop)
      }
      requestAnimationFrame(syncLoop)
      
      // Collision Events: Dissolve drop exactly when it hits the liquid surface (ground)
      Matter.Events.on(engine, 'collisionStart', (event: any) => {
        event.pairs.forEach((pair: any) => {
          if (pair.bodyA === ground || pair.bodyB === ground) {
            const drop = pair.bodyA === ground ? pair.bodyB : pair.bodyA
            const dropData = dropsRef.current.find(d => d.body === drop)
            
            // If drop found and not already dissolving
            if (dropData && !dropData.el.dataset.dissolving) {
              dropData.el.dataset.dissolving = "true"
              gsap.to(dropData.el, {
                scale: 0,
                duration: 0.2, // Dissolve quickly into the surface
                ease: "power2.in",
                onComplete: () => {
                  Matter.World.remove(engine.world, drop)
                  if (dropData.el.parentNode) dropData.el.parentNode.removeChild(dropData.el)
                  dropsRef.current = dropsRef.current.filter(d => d.body !== drop)
                }
              })
            }
          }
        })
      })

      engine.runner = runner
    }).catch(err => console.error("Failed to load matter-js", err))

    return () => {
      if (engineRef.current && engineRef.current.runner) {
         import('matter-js').then((Matter) => {
           Matter.Runner.stop(engineRef.current.runner)
           Matter.Engine.clear(engineRef.current)
         })
      }
    }
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsReady(true)
        gsap.set(preloaderRef.current, { display: 'none' })
        window.dispatchEvent(new Event('preloader-done'))
      }
    })

    // Initial Fade In
    tl.fromTo([wrapperRef.current, brandRef.current], 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.2 }
    )

    // Start Physics Drop Spawner FIRST
    let spawnInterval: any;
    tl.call(() => {
       spawnInterval = setInterval(() => {
          if (!engineRef.current || !dropsContainerRef.current) return
          import('matter-js').then((Matter) => {
             if (!dropsContainerRef.current || !engineRef.current) return
             const w = dropsContainerRef.current.offsetWidth
             const startX = (w / 2) + (Math.random() * (w * 0.4) - (w * 0.2)) // drop near center
             const radius = 8 + Math.random() * 6

             const dropBody = Matter.Bodies.circle(startX, -40, radius, {
               restitution: 0.2, // slightly bouncy
               friction: 0.1,
               density: 0.05
             })
             Matter.World.add(engineRef.current.world, dropBody)
             
             // Create physical droplet
             const el = document.createElement('div')
             el.className = "absolute bg-[#00ffff]"
             el.style.width = `${radius * 2}px`
             el.style.height = `${radius * 2}px`
             el.style.borderRadius = '50%'
             el.style.left = '0'
             el.style.top = '0'
             dropsContainerRef.current.appendChild(el)
             
             dropsRef.current.push({ body: dropBody, el })
          })
       }, 60) // Spawn drops rapidly
    })

    // The Liquid Fill & Counter (Starts 0.4s later to allow drops to fall!)
    const counterObj = { value: 0 }
    const targetValue = 99.1
    
    tl.to(counterObj, {
      value: targetValue,
      duration: 3.5, // 3.5s for realistic liquid physics to pool up
      ease: "power2.inOut",
      onUpdate: () => {
        if (!counterRef.current) return
        const progress = counterObj.value / targetValue
        counterRef.current.innerText = counterObj.value.toFixed(1) + "%"

        // Move the physics ground up perfectly in sync with the visual liquid line
        if (engineRef.current && engineRef.current.groundBody && dropsContainerRef.current) {
          import('matter-js').then((Matter) => {
             if (!dropsContainerRef.current || !engineRef.current) return
             const h = dropsContainerRef.current.offsetHeight
             const w = dropsContainerRef.current.offsetWidth
             const yPos = h - (progress * h)
             Matter.Body.setPosition(engineRef.current.groundBody, { x: w / 2, y: yPos + 10 })
          })
        }
      }
    }, "+=0.4") // <--- 0.4s delay for falling droplets

    // The liquid rises inside the mask
    tl.fromTo(liquidRef.current, 
      { height: "0%" }, 
      { height: "100%", duration: 3.5, ease: "power2.inOut" }, 
      "<" 
    )

    // Stop spawning drops slightly before the end so they can settle
    tl.call(() => { clearInterval(spawnInterval) }, [], "-=0.8")

    // When liquid hits the top, crossfade to the real photorealistic vial
    tl.to(realVialRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
    
    // Fade out the silhouette mask so it cleanly swaps
    tl.to(maskContainerRef.current, { opacity: 0, duration: 0.8 }, "<")

    // Real vial gets a subtle glow
    tl.fromTo(realVialRef.current, 
      { filter: "drop-shadow(0px 0px 0px rgba(0,255,255,0))" }, 
      { filter: "drop-shadow(0px 0px 30px rgba(0,255,255,0.6))", duration: 0.8 }, 
      "<"
    )

    // Fade out the counter and branding
    tl.to([counterContainerRef.current, brandRef.current], { opacity: 0, duration: 0.6, ease: "power2.in" }, "<+=0.2")

    // The vial shoots completely upwards off the screen
    tl.to(wrapperRef.current, { y: "-150vh", scale: 1.05, duration: 1.2, ease: "power2.in" }, "<")

    // The black background fades out completely
    tl.to(preloaderRef.current, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, "<")

  }, [])

  return (
    <PreloaderContext.Provider value={{ isReady }}>
      {children}

      <div 
        ref={preloaderRef}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      >
         
         {/* SVG Gooey Filter Definition */}
         <svg width="0" height="0" className="absolute pointer-events-none">
           <defs>
             <filter id="goo">
               <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
               <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
               <feBlend in="SourceGraphic" in2="goo" />
             </filter>
           </defs>
         </svg>

         <div ref={wrapperRef} className="relative flex flex-col items-center justify-center z-10 gap-8" style={{ opacity: 0 }}>
           
           <div className="relative w-[140px] sm:w-[180px] lg:w-[240px] aspect-[1/2.2]">
             
             {/* 1. The Mask Container (Silhouette & Liquid) */}
             <div 
               ref={maskContainerRef}
               className="absolute inset-0 z-10 overflow-hidden"
               style={{
                 WebkitMaskImage: `url('/99 Images/transparant-vial.png')`,
                 WebkitMaskSize: 'contain',
                 WebkitMaskRepeat: 'no-repeat',
                 WebkitMaskPosition: 'center',
                 maskImage: `url('/99 Images/transparant-vial.png')`,
                 maskSize: 'contain',
                 maskRepeat: 'no-repeat',
                 maskPosition: 'center',
               }}
             >
               {/* Faint Base Silhouette */}
               <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
               
               {/* Container with the SVG Gooey Filter Applied */}
               <div className="absolute inset-0" style={{ filter: 'url(#goo)' }}>
                 
                 {/* The Rising Cyan Liquid Pool */}
                 <div 
                   ref={liquidRef}
                   className="absolute bottom-0 left-0 right-0 w-full bg-[#00ffff]"
                   style={{ height: '0%', boxShadow: '0 0 40px 10px rgba(0,255,255,0.5)' }} 
                 />

                 {/* The Physics Droplets Container */}
                 <div ref={dropsContainerRef} className="absolute inset-0 pointer-events-none" />

               </div>
             </div>
             
             {/* 2. The Real Vial (Hidden until 99.9%) */}
             <div ref={realVialRef} className="absolute inset-0 z-20 opacity-0">
               <Image 
                 src="/99 Images/transparant-vial.png"
                 alt="99 Purity Peptides"
                 fill
                 className="object-contain"
                 priority
               />
             </div>

           </div>

           {/* Minimalist Purity Counter */}
           <div ref={counterContainerRef} className="flex flex-col items-center gap-2">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium">
                Purity Verified
              </span>
              <span 
                ref={counterRef} 
                className="text-3xl md:text-5xl font-heading uppercase leading-none tracking-wider text-white"
                style={{ textShadow: '0 0 20px rgba(0,255,255,0.4)' }}
              >
                0.0%
              </span>
           </div>

         </div>

         {/* Elegant Branding Footer */}
         <div 
           ref={brandRef}
           className="absolute bottom-12 flex flex-col items-center gap-4 text-white/60 z-20"
           style={{ opacity: 0 }}
         >
           <Image 
             src="/99 Images/99pp-Logo.png" 
             alt="99 Purity Peptides Logo" 
             width={180}
             height={80}
             className="object-contain opacity-70"
           />
         </div>

      </div>
    </PreloaderContext.Provider>
  )
}
