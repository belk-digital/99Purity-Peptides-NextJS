'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { FluidButton } from '@/components/ui/fluid-button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const inquirySchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  requirements: z.string().min(1, 'Requirements description is required'),
  attestation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the attestation',
  }),
})

type InquiryFormData = z.infer<typeof inquirySchema>



export function ResearchInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/research-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSuccess(true)
      toast.success('Inquiry submitted successfully.')

      // Fire Google Tag Manager Lead Event
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'generate_lead',
          form_name: 'research_inquiry'
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl font-heading font-black text-ink mb-4 uppercase tracking-tight">Inquiry Received</h3>
        <p className="text-ink-muted text-lg font-medium max-w-lg mx-auto leading-relaxed mb-10">
          Thank you. A member of our research supply team will follow up with you shortly to confirm details and documentation.
        </p>
        <Link href="/">
          <FluidButton variant="dark" text={<>Explore Our Catalog</>} />
        </Link>
      </div>
    )
  }

  const inputClasses = "w-full bg-cream border border-border/50 rounded-xl px-5 py-4 text-ink font-medium placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-border"
  const labelClasses = "block text-xs font-bold text-ink-muted uppercase tracking-widest mb-3"
  const errorClasses = "text-red-500 text-xs font-bold uppercase tracking-wider mt-2"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" id="inquiry-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClasses}>Full Name *</label>
          <input
            {...register('fullName')}
            className={inputClasses}
            placeholder="Dr. Jane Doe"
          />
          {errors.fullName && <p className={errorClasses}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Email Address *</label>
          <input
            {...register('email')}
            type="email"
            className={inputClasses}
            placeholder="jane.doe@university.edu"
          />
          {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Phone Number</label>
        <input
          {...register('phone')}
          type="tel"
          className={inputClasses}
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label className={labelClasses}>Describe Your Requirements *</label>
        <textarea
          {...register('requirements')}
          rows={5}
          className={`${inputClasses} resize-none leading-relaxed`}
          placeholder="Tell us about your research protocol, quantities, timeline, or documentation needs."
        />
        {errors.requirements && <p className={errorClasses}>{errors.requirements.message}</p>}
      </div>

      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
        <label className="flex items-start space-x-4 cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              {...register('attestation')}
              className="peer appearance-none w-5 h-5 border-2 border-primary/40 rounded bg-white checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 transition-all cursor-pointer"
            />
            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-ink-muted font-medium leading-relaxed group-hover:text-ink transition-colors">
            I confirm I am 21 years of age or older and am submitting this inquiry on behalf of a laboratory, research institution, or accredited organization for research use only.
          </span>
        </label>
        {errors.attestation && <p className={errorClasses}>{errors.attestation.message}</p>}
      </div>

      <div className="flex justify-center pt-6">
        <FluidButton 
          type="submit" 
          variant="dark" 
          disabled={isSubmitting} 
          text={isSubmitting ? "SUBMITTING..." : "SUBMIT REQUIREMENTS"} 
          className="w-full sm:w-auto"
        />
      </div>
    </form>
  )
}
