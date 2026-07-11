'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface SmoothScrollProps {
  children: ReactNode
}

function ScrollToTop() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, lenis])

  return null
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  // Lenis re-implements scroll physics in JS, which fights the OS's native touch/momentum
  // scrolling on mobile and is a common source of scroll jank there. Only enable it on
  // non-touch (desktop) viewports; mobile gets native scroll. Defaults to disabled so SSR/
  // first paint never mounts it, avoiding a hydration mismatch.
  const [enableLenis, setEnableLenis] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    setEnableLenis(mq.matches)
    const update = () => setEnableLenis(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!enableLenis) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      <ScrollToTop />
      {children}
    </ReactLenis>
  )
}
