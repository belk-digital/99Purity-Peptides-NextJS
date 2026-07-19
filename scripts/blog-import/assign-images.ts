import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// All verified by hand (no visible human faces — hands/equipment/microscopy only) before
// use. Assigned per-post by a deterministic hash of the slug, spreading all 10 images
// across all 88 posts instead of clumping into a handful of category buckets.
const IMAGES: { file: string; alt: string }[] = [
  { file: 'cellular-longevity.jpg', alt: 'Fluorescence microscopy of cell nuclei' },
  { file: 'cognitive-research.jpg', alt: 'Fluorescence microscopy research imaging' },
  { file: 'dna-molecule.jpg', alt: 'DNA molecule 3D model render' },
  { file: 'gloved-pipette-vials.jpg', alt: 'Gloved hands pipetting into laboratory sample vials' },
  { file: 'muscle-fiber-tem.jpg', alt: 'Electron microscopy of skeletal muscle tissue' },
  { file: 'muscle-studies.jpg', alt: 'Modern biotechnology research laboratory' },
  { file: 'petri-dish-glow.jpg', alt: 'Backlit petri dish culture held by a gloved hand' },
  { file: 'pipetting-hands.jpg', alt: 'Gloved hands using a laboratory pipette' },
  { file: 'recovery-protocols.jpg', alt: 'Physical therapy and recovery research lab' },
  { file: 'sample-plate-hands.jpg', alt: 'Hands loading a laboratory sample plate' },
]

function hashSlug(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return hash
}

async function main() {
  const { getPayload } = await import('payload')
  const config = (await import('../../src/payload.config')).default
  const payload = await getPayload({ config })

  const { docs: existingMedia } = await payload.find({ collection: 'blog-media', limit: 100 })
  const wantedAlts = new Set(IMAGES.map((i) => i.alt))
  const altToMediaId = new Map((existingMedia as any[]).map((m) => [m.alt, Number(m.id)]))

  const mediaIds: number[] = []
  for (const { file, alt } of IMAGES) {
    if (altToMediaId.has(alt)) {
      mediaIds.push(altToMediaId.get(alt)!)
      console.log(`Reusing existing media for "${alt}"`)
      continue
    }
    const filePath = path.resolve(process.cwd(), 'scripts/blog-import/category-images', file)
    const buffer = fs.readFileSync(filePath)
    const media = await payload.create({
      collection: 'blog-media',
      data: { alt },
      file: { data: buffer, mimetype: 'image/jpeg', name: file, size: buffer.length },
    })
    mediaIds.push(Number(media.id))
    console.log(`Uploaded ${file} -> media id ${media.id}`)
  }

  const { docs: posts } = await payload.find({ collection: 'blog-posts', limit: 200 })
  let updated = 0
  for (const post of posts as any[]) {
    const mediaId = mediaIds[hashSlug(post.slug) % mediaIds.length]
    await payload.update({ collection: 'blog-posts', id: post.id, data: { featuredImage: mediaId } })
    updated++
  }

  console.log(`Assigned images to ${updated} posts across a pool of ${mediaIds.length} images.`)

  // Now safe to remove stale media from an earlier run (unrelated people photos) since
  // no post references them anymore.
  for (const doc of existingMedia as any[]) {
    if (!wantedAlts.has(doc.alt)) {
      await payload.delete({ collection: 'blog-media', id: doc.id })
      console.log(`Deleted stale media: ${doc.alt} (id ${doc.id})`)
    }
  }

  console.log(`\nDone.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  if (err?.data?.errors) console.error(JSON.stringify(err.data.errors, null, 2))
  process.exit(1)
})
