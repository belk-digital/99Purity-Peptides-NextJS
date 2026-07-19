import React from 'react'

export function FaqSection({
  faqs,
  heading = 'Frequently Asked Questions',
}: {
  faqs: { question: string; answer: string }[]
  heading?: string
}) {
  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-ink mt-16 mb-6">{heading}</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-cream-warm p-6 rounded-2xl border border-ink/5">
            <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
            <p className="text-ink/80 text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
