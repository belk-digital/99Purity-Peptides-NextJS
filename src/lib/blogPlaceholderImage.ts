// Generic editorial imagery for blog posts that don't have a dedicated featured image
// uploaded yet. Deliberately NOT product photography — a research/guide article
// shouldn't read as a product ad. Picked deterministically per-slug so a given post's
// thumbnail stays consistent across the listing page, its own hero, and product pages.
const PLACEHOLDER_IMAGES = [
  '/99 Images/category-1.webp',
  '/99 Images/why-choose-us-1.webp',
  '/99 Images/purity.webp',
  '/99 Images/category-4.webp',
  '/99 Images/identity.webp',
  '/99 Images/coa.webp',
]

export function getBlogPlaceholderImage(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length]
}
