'use client'

import { useState } from 'react'
import { submitAffiliateApplication } from './actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function ApplyForm() {
  const t = useTranslations('affiliate.applyForm')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitAffiliateApplication(formData)

    if (!result.success) {
      setError(result.error || t('genericError'))
      setIsSubmitting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('displayNameLabel')}
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder={t('displayNamePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('websiteUrlLabel')}
          </label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label htmlFor="promotionMethods" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('promotionMethodsLabel')}
          </label>
          <textarea
            id="promotionMethods"
            name="promotionMethods"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder={t('promotionMethodsPlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="estimatedMonthlyReach" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('reachLabel')}
          </label>
          <select
            id="estimatedMonthlyReach"
            name="estimatedMonthlyReach"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="<1k">{t('reachLess1k')}</option>
            <option value="1k-10k">{t('reach1k10k')}</option>
            <option value="10k-100k">{t('reach10k100k')}</option>
            <option value="100k+">{t('reach100kPlus')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('nicheLabel')}
          </label>
          <input
            type="text"
            id="niche"
            name="niche"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder={t('nichePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="whyJoin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('whyJoinLabel')}
          </label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            rows={2}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">{t('socialLinksTitle')}</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="social_instagram" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('instagramUrlLabel')}</label>
              <input type="text" id="social_instagram" name="social_instagram" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_youtube" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('youtubeUrlLabel')}</label>
              <input type="text" id="social_youtube" name="social_youtube" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_tiktok" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('tiktokUrlLabel')}</label>
              <input type="text" id="social_tiktok" name="social_tiktok" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="social_twitter" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('twitterUrlLabel')}</label>
              <input type="text" id="social_twitter" name="social_twitter" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-start pt-4">
          <div className="flex h-5 items-center">
            <input
              id="agreedToTerms"
              name="agreedToTerms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreedToTerms" className="font-medium text-gray-700 dark:text-gray-300">
              {t('agreeTermsLabel')}
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              {t('agreeTermsDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-900"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('submittingButton')}
            </>
          ) : (
            t('submitButton')
          )}
        </button>
      </div>
    </form>
  )
}
