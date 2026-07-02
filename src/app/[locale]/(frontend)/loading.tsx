import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomepageLoading() {
  return (
      <div className="flex flex-col w-full min-h-screen relative z-10 bg-black overflow-x-clip">
        
        {/* Hero Section Skeleton Mimic */}
        <div className="relative w-full h-[100dvh] min-h-[500px] md:min-h-[700px] bg-cream p-3 pt-[44px] sm:p-5 sm:pt-[52px] md:p-8 md:pt-16 font-sans overflow-hidden flex">
          <div className="relative w-full h-full bg-zinc-900 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex flex-col justify-center p-8 md:p-16 lg:p-24">
            <Skeleton className="w-[80%] max-w-4xl h-16 md:h-24 lg:h-32 mb-6 bg-white/10" />
            <Skeleton className="w-[60%] max-w-2xl h-6 md:h-8 mb-10 bg-white/10" />
            
            <div className="absolute bottom-0 left-0 bg-cream rounded-tr-[3rem] md:rounded-tr-[4rem] p-3 sm:p-5 md:p-8 pt-6 md:pt-10 pr-6 md:pr-10">
              <Skeleton className="w-[180px] h-[60px] md:w-[220px] md:h-[70px] rounded-full bg-black/10" />
            </div>

            <div className="absolute bottom-10 right-10 flex gap-4">
              <Skeleton className="w-[200px] h-[300px] rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>

        {/* Trust Badges Skeleton Mimic */}
        <div className="w-full bg-black py-8 border-y border-white/10">
          <div className="container mx-auto px-4 flex justify-between items-center opacity-50">
             {[1, 2, 3, 4].map(i => (
               <Skeleton key={i} className="w-24 h-8 md:w-40 md:h-12 bg-white/10" />
             ))}
          </div>
        </div>

      </div>
  )
}
