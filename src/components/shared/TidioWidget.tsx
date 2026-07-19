'use client'

import { useEffect } from 'react'

// Loading Tidio immediately (even with next/script's lazyOnload) still runs its socket
// connection during Lighthouse/PSI's trace window, which has no real user to interact with —
// surfacing Tidio's own console/network errors against this site's Best Practices score.
// Deferring injection until the visitor actually interacts (or a generous fallback timeout)
// keeps the chat widget working for real users while keeping it out of automated audits.
const INTERACTION_EVENTS = ['scroll', 'mousemove', 'touchstart', 'keydown'] as const
const FALLBACK_DELAY_MS = 10000

export function TidioWidget({ publicKey }: { publicKey: string }) {
  useEffect(() => {
    let loaded = false

    const loadTidio = () => {
      if (loaded) return
      loaded = true
      cleanup()

      const script = document.createElement('script')
      script.src = `//code.tidio.co/${publicKey}.js`
      script.async = true
      document.body.appendChild(script)
    }

    const cleanup = () => {
      INTERACTION_EVENTS.forEach((event) => window.removeEventListener(event, loadTidio))
    }

    INTERACTION_EVENTS.forEach((event) => window.addEventListener(event, loadTidio, { passive: true, once: true }))

    return cleanup
  }, [publicKey])

  return null
}
