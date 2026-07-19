import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { accessContent } from '../access/content'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { defaultColumns: ['title', 'author', 'status', 'publishedAt'] },
  access: accessContent,
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'blog-media', label: 'Featured Image' },
    { name: 'excerpt', type: 'textarea', localized: true, admin: { description: 'Short summary shown on blog listing cards and used as the default SEO/social description.' } },
    { name: 'content', type: 'richText', editor: lexicalEditor(), localized: true },
    {
      name: 'relatedProduct',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar', description: 'Product this post is shown on ("Further Reading" section).' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
      admin: { description: 'Overrides the page <title>. Falls back to title if empty.' },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Overrides the meta description. Falls back to excerpt if empty.' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Growth research', value: 'Growth research' },
        { label: 'Muscle studies', value: 'Muscle studies' },
        { label: 'Recovery protocols', value: 'Recovery protocols' },
        { label: 'Metabolic research', value: 'Metabolic research' },
        { label: 'Product Guides', value: 'Product Guides' },
      ],
      defaultValue: 'Product Guides',
    },
    {
      name: 'faqs',
      type: 'array',
      labels: { singular: 'FAQ', plural: 'FAQs' },
      admin: { description: 'Rendered as an on-page FAQ section and as FAQPage JSON-LD schema.' },
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'answer', type: 'textarea', required: true, localized: true },
      ],
    },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.title) {
          data.slug = data.title.toLowerCase().replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
}
