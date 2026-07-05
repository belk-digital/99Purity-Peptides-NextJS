import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

const REQUIRED_ENV = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`)
    process.exit(1)
  }
}

const BUCKET = process.env.R2_BUCKET as string

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
})

async function deletePrefix(prefix: string) {
  console.log(`\n--- Deleting all objects under "${prefix}" ---`)
  let continuationToken: string | undefined
  let totalDeleted = 0

  do {
    const listRes = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    }))

    const keys = (listRes.Contents || []).map(o => o.Key).filter((k): k is string => Boolean(k))

    if (keys.length > 0) {
      // DeleteObjects supports max 1000 keys per request
      for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000)
        await s3.send(new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: batch.map(Key => ({ Key })) },
        }))
        totalDeleted += batch.length
        console.log(`  Deleted batch of ${batch.length} (total: ${totalDeleted})`)
      }
    }

    continuationToken = listRes.IsTruncated ? listRes.NextContinuationToken : undefined
  } while (continuationToken)

  console.log(`Finished deleting "${prefix}" — ${totalDeleted} objects removed.`)
}

function contentTypeFor(filename: string) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.pdf') return 'application/pdf'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  return 'application/octet-stream'
}

async function uploadDir(localDir: string, prefix: string) {
  console.log(`\n--- Uploading files from "${localDir}" to prefix "${prefix}" ---`)
  const files = fs.readdirSync(localDir).filter(f => fs.statSync(path.join(localDir, f)).isFile())
  let uploaded = 0

  for (const filename of files) {
    const filePath = path.join(localDir, filename)
    const body = fs.readFileSync(filePath)
    const key = `${prefix}${filename}`

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentTypeFor(filename),
    }))

    uploaded++
    if (uploaded % 20 === 0) console.log(`  Uploaded ${uploaded}/${files.length}...`)
  }

  console.log(`Finished uploading "${localDir}" — ${uploaded} files uploaded.`)
}

async function run() {
  console.log(`Target bucket: ${BUCKET}`)
  console.log(`Endpoint: ${process.env.R2_ENDPOINT}`)

  await deletePrefix('Product Images/')
  await deletePrefix('COA/')

  await uploadDir(
    path.resolve(process.cwd(), 'public/99pp Products images'),
    'Product Images/'
  )
  await uploadDir(
    path.resolve(process.cwd(), 'public/BioTide COA/BioTide COA'),
    'COA/'
  )

  console.log('\nAll done.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
