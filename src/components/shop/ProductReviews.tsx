'use client'

import React, { useState } from 'react'
import { Star, X, Loader2, Edit3, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  title: string
  content: string
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const { data: session } = useSession()
  const [visibleCount, setVisibleCount] = useState(5)
  const [sort, setSort] = useState('recent')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(5)
  const [comment, setComment] = useState('')

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0
  
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'highest') return b.rating - a.rating
    if (sort === 'lowest') return a.rating - b.rating
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const visibleReviews = sortedReviews.slice(0, visibleCount)

  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 
      : 0
  }))

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      toast.error('Please log in to leave a review.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: isNaN(Number(productId)) ? productId : Number(productId),
          user: isNaN(Number(session.user.id)) ? session.user.id : Number(session.user.id),
          rating,
          comment
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.errors?.[0]?.message || 'Failed to submit review.')
      }

      toast.success('Review submitted successfully! It will appear once approved.')
      setIsModalOpen(false)
      setComment('')
      setRating(5)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 w-full relative max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Left: Summary Card */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="sticky top-32 bg-white/70 backdrop-blur-2xl border border-white rounded-[32px] p-8 sm:p-10 shadow-[0_8px_48px_-12px_rgba(0,0,0,0.06)] flex flex-col gap-8">
          
          <div>
            <div className="flex items-center gap-3 text-primary-dark/60 uppercase tracking-[0.2em] font-bold text-[10px] mb-4">
              <MessageSquare size={14} />
              <span>Customer Reviews</span>
            </div>
            
            <div className="flex items-end gap-5">
              <span className="font-heading text-6xl lg:text-7xl font-black text-black leading-none tracking-tighter">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col pb-1.5 gap-1.5">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={18} fill={i <= Math.round(averageRating) ? "currentColor" : "none"} strokeWidth={1} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-black/40 uppercase tracking-widest">
                  {reviews.length} Reviews
                </span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

          <div className="flex flex-col gap-4">
            {distribution.map((dist, i) => (
              <motion.div 
                key={dist.stars} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className="flex items-center gap-1.5 w-12 text-[11px] font-bold text-black/60">
                  <span>{dist.stars}</span>
                  <Star size={10} className="text-amber-400" fill="currentColor" strokeWidth={0} />
                </div>
                <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${dist.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  />
                </div>
                <span className="w-8 text-right text-[11px] font-bold text-black/40 group-hover:text-black/80 transition-colors">
                  {dist.count}
                </span>
              </motion.div>
            ))}
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full h-14 mt-2 rounded-2xl bg-black text-white hover:bg-black/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold uppercase tracking-[0.15em] text-[11px] group flex items-center justify-center gap-2"
          >
            <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
            Write a Review
          </Button>
        </div>
      </div>

      {/* Right: Review List */}
      <div className="flex-1 flex flex-col pt-4 lg:pt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 pb-4 border-b border-black/[0.05]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-black/40">
            {reviews.length} Reviews
          </span>
          <div className="w-40">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 rounded-xl border border-black/10 bg-white/50 backdrop-blur-md shadow-sm hover:border-black/20 focus:ring-0 focus:ring-offset-0 text-[11px] font-bold uppercase tracking-widest text-black/70">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-black/10 shadow-xl bg-white/90 backdrop-blur-xl">
                <SelectItem value="recent" className="text-[11px] font-bold uppercase tracking-widest cursor-pointer focus:bg-black/5">Most Recent</SelectItem>
                <SelectItem value="highest" className="text-[11px] font-bold uppercase tracking-widest cursor-pointer focus:bg-black/5">Highest Rating</SelectItem>
                <SelectItem value="lowest" className="text-[11px] font-bold uppercase tracking-widest cursor-pointer focus:bg-black/5">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleReviews.map((review) => (
              <motion.div 
                key={review.id} 
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/60 backdrop-blur-md border border-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-black uppercase tracking-widest text-black">{review.author}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex text-amber-400 drop-shadow-sm">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} strokeWidth={1} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-[14px] sm:text-[15px] leading-[1.8] text-black/70">{review.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {visibleReviews.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/40 border border-white border-dashed rounded-[32px]"
            >
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-6 text-black/20">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-lg font-black uppercase tracking-wider text-black mb-2">No Reviews Yet</h4>
              <p className="text-[14px] text-black/50 max-w-md">Be the first to share your experience with this product and help other researchers!</p>
            </motion.div>
          )}
        </motion.div>

        {visibleCount < reviews.length && (
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => setVisibleCount(v => v + 5)}
              className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[11px] border-black/10 hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Load More Reviews
            </Button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white/90 backdrop-blur-2xl border border-white rounded-[32px] p-8 sm:p-10 w-full max-w-lg shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)] relative z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <div className="flex items-center gap-3 text-primary-dark/60 uppercase tracking-[0.2em] font-bold text-[10px] mb-2">
                  <Star size={14} />
                  <span>Share Your Experience</span>
                </div>
                <h3 className="font-heading text-3xl font-black text-black uppercase tracking-tighter">Write a Review</h3>
              </div>
              
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/50 mb-3">Your Rating</label>
                  <div className="flex gap-2 text-amber-400 cursor-pointer" onMouseLeave={() => setHoverRating(rating)}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={i}>
                        <Star 
                          size={36} 
                          fill={i <= hoverRating ? "currentColor" : "none"} 
                          strokeWidth={1}
                          onMouseEnter={() => setHoverRating(i)}
                          onClick={() => setRating(i)}
                          className="drop-shadow-sm transition-colors"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black/50 mb-3">Your Review</label>
                  <Textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you think about this product?"
                    className="min-h-[140px] resize-none rounded-2xl border-black/10 bg-white/50 focus:bg-white text-[15px] p-5 shadow-inner transition-all focus-visible:ring-1 focus-visible:ring-black"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[11px] h-12 px-6 hover:bg-black/5">
                    Cancel
                  </Button>
                  <Button type="submit" variant="dark" disabled={isSubmitting} className="rounded-xl font-bold uppercase tracking-widest text-[11px] h-12 px-8 bg-black text-white hover:bg-black/80 hover:-translate-y-0.5 transition-all shadow-md">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Submit Review
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
