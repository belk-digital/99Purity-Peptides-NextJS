import React from 'react'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'

// Mirrors the Tailwind classes hand-authored in src/data/blog-posts.tsx so
// Payload-sourced posts render pixel-consistent with the static ones.
const HEADING_CLASSES: Record<string, string> = {
  h1: 'text-3xl font-semibold text-ink mt-16 mb-6',
  h2: 'text-2xl font-semibold text-ink mt-16 mb-6',
  h3: 'text-xl font-semibold text-ink mt-10 mb-4',
  h4: 'text-lg font-semibold text-ink mt-8 mb-3',
  h5: 'text-base font-semibold text-ink mt-6 mb-2',
  h6: 'text-base font-semibold text-ink mt-6 mb-2',
}

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag as keyof typeof HEADING_CLASSES
    return React.createElement(Tag, { className: HEADING_CLASSES[Tag] }, children)
  },
  paragraph: ({ node, nodesToJSX, childIndex }) => {
    const children = nodesToJSX({ nodes: node.children })
    const isFirst = childIndex === 0
    return (
      <p
        className={
          isFirst
            ? 'first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-4 first-letter:text-ink first-letter:mt-2'
            : undefined
        }
      >
        {children}
      </p>
    )
  },
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const Tag = node.tag as 'ul' | 'ol'
    return React.createElement(
      Tag,
      { className: `${node.listType === 'number' ? 'list-decimal' : 'list-disc'} pl-6 space-y-4 my-6` },
      children,
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const rel = node.fields.newTab ? 'noopener noreferrer' : undefined
    const target = node.fields.newTab ? '_blank' : undefined
    return (
      <a className="text-primary underline hover:text-primary-dark" href={node.fields.url ?? '#'} rel={rel} target={target}>
        {children}
      </a>
    )
  },
  upload: ({ node }) => {
    const uploadDoc = node.value as { url?: string; alt?: string } | string
    if (typeof uploadDoc !== 'object' || !uploadDoc?.url) return null
    return (
      <div className="my-12 overflow-hidden rounded-2xl border border-ink/10 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={uploadDoc.url}
          alt={uploadDoc.alt || ''}
          className="w-full h-auto object-cover"
        />
      </div>
    )
  },
})

export function PayloadRichText({ data }: { data: any }) {
  return (
    <div className="text-body-lg text-ink leading-loose space-y-8">
      <RichText data={data} converters={converters} />
    </div>
  )
}
