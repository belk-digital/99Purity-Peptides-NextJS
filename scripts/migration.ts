import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs/promises'
import path from 'path'

// Define interfaces for expected WooCommerce data structures
interface WooCommerceCustomer {
  id: number
  email: string
  first_name: string
  last_name: string
  billing: any
  shipping: any
}

interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  description: string
  price: string
  regular_price: string
  sale_price: string
  stock_quantity: number
  type: string
  categories: { id: number; name: string; slug: string }[]
  meta_data: { key: string; value: any }[]
}

interface WooCommerceCoupon {
  id: number
  code: string
  amount: string
  discount_type: string
  date_expires: string | null
}

interface SliceWPAffiliate {
  id: number
  user_id: number
  payment_email: string
  status: string
  referral_slug: string
}

async function migrateProducts(payload: any, productsData: WooCommerceProduct[]) {
  console.log(`Starting migration for ${productsData.length} products...`)
  for (const product of productsData) {
    console.log(`[Phase 1] Processing product: ${product.name}`)
    
    // Helper to find WooCommerce meta data (like ACF fields for your 4 tabs)
    const getMeta = (key: string) => product.meta_data?.find(m => m.key === key)?.value || ''

    try {
      await payload.create({
        collection: 'products',
        data: {
          // Core
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price: parseFloat(product.price || product.regular_price || '0'),
          salePrice: product.sale_price ? parseFloat(product.sale_price) : undefined,
          stock: product.stock_quantity || 0,
          status: 'active',
          isVisible: true,
          
          // Variants
          hasVariants: product.type === 'variable',
          variants: [], // TODO: Map WooCommerce variations here

          // Categories 
          // Note: You must migrate Categories first and map their IDs here!
          categories: [], 

          // Tabs (Assuming these come from WooCommerce post_meta or ACF)
          productDetailsTitle: getMeta('product_details_title') || 'Product Details',
          productDetailsDescription: getMeta('product_details_desc') || '',
          
          researchFocusTitle: getMeta('research_focus_title') || 'Research Focus & Mechanism Overview',
          researchFocusDescription: getMeta('research_focus_desc') || '',
          
          qualityPurityTitle: getMeta('quality_purity_title') || 'Quality & Purity Standards',
          qualityPurityDescription: getMeta('quality_purity_desc') || '',
          
          complianceNoticeTitle: getMeta('compliance_notice_title') || 'Compliance Notice',
          complianceNoticeDescription: getMeta('compliance_notice_desc') || '',

          // FAQs (Assuming stored as a JSON array in meta)
          faqs: Array.isArray(getMeta('product_faqs')) ? getMeta('product_faqs') : [],

          // SEO
          seoTitle: getMeta('_yoast_wpseo_title') || product.name,
          seoDescription: getMeta('_yoast_wpseo_metadesc') || '',

          // Note: coaFile and images require downloading the files and uploading to Payload Media/Documents first.
        }
      })
    } catch (err: any) {
      console.error(`Failed to migrate product ${product.name}:`, err.message)
    }
  }
}

async function migrateUsers(payload: any, usersData: WooCommerceCustomer[]) {
  console.log(`Starting migration for ${usersData.length} users...`)
  for (const user of usersData) {
    console.log(`[Phase 1] Processing user: ${user.email}`)
    
    // 1. (Optional) Create user in Clerk via Clerk Backend API to get clerkUserId
    // const clerkUserId = await createClerkUser({ email: user.email, ... })
    const dummyClerkId = `migrated_clerk_${user.id}`

    // 2. Map data to Payload Users Collection
    try {
      await payload.create({
        collection: 'users',
        data: {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          clerkUserId: dummyClerkId,
          role: 'customer',
          emailVerified: true,
          password: crypto.randomUUID() + crypto.randomUUID(), // Unusable password, relying on Clerk
          metadata: {
            woocommerce_id: user.id
          }
          // Note: Address linking would go here once Addresses are migrated
        },
      })
    } catch (err: any) {
      console.error(`Failed to migrate user ${user.email}:`, err.message)
    }
  }
}

async function migrateCoupons(payload: any, couponsData: WooCommerceCoupon[]) {
  console.log(`Starting migration for ${couponsData.length} coupons...`)
  for (const coupon of couponsData) {
    console.log(`[Phase 2] Processing coupon: ${coupon.code}`)
    try {
      await payload.create({
        collection: 'coupons',
        data: {
          code: coupon.code,
          discountType: coupon.discount_type === 'percent' ? 'percentage' : 'fixed_amount',
          discountAmount: parseFloat(coupon.amount),
          usageLimit: 0,
          usageCount: 0,
          isActive: true,
          expiryDate: coupon.date_expires ? new Date(coupon.date_expires).toISOString() : undefined,
        },
      })
    } catch (err: any) {
      console.error(`Failed to migrate coupon ${coupon.code}:`, err.message)
    }
  }
}

async function migrateAffiliates(payload: any, affiliatesData: SliceWPAffiliate[]) {
  console.log(`Starting migration for ${affiliatesData.length} affiliates...`)
  for (const affiliate of affiliatesData) {
    console.log(`[Phase 3] Processing affiliate slug: ${affiliate.referral_slug}`)
    // Find the corresponding Payload user
    const usersResponse = await payload.find({
      collection: 'users',
      where: {
        'metadata.woocommerce_id': {
          equals: affiliate.user_id,
        },
      },
    })

    const payloadUser = usersResponse.docs[0]
    if (!payloadUser) {
      console.log(`Warning: Could not find Payload user for WooCommerce User ID ${affiliate.user_id}`)
      continue
    }

    try {
      await payload.create({
        collection: 'affiliates',
        data: {
          user: payloadUser.id,
          status: affiliate.status === 'active' ? 'approved' : 'pending',
          referralSlug: affiliate.referral_slug,
          payoutCurrency: 'USD',
          // Map other specific fields
        }
      })
    } catch (err: any) {
      console.error(`Failed to migrate affiliate ${affiliate.referral_slug}:`, err.message)
    }
  }
}

async function main() {
  console.log('Initializing Payload Local API...')
  const payload = await getPayload({ config })
  
  // TODO: The user needs to provide the exported JSON files.
  // We will read them from a 'data' directory in the project root.
  const dataDir = path.resolve(process.cwd(), 'migration_data')
  
  try {
    const productsRaw = await fs.readFile(path.join(dataDir, 'products.json'), 'utf-8').catch(() => '[]')
    const usersRaw = await fs.readFile(path.join(dataDir, 'users.json'), 'utf-8').catch(() => '[]')
    const couponsRaw = await fs.readFile(path.join(dataDir, 'coupons.json'), 'utf-8').catch(() => '[]')
    const affiliatesRaw = await fs.readFile(path.join(dataDir, 'affiliates.json'), 'utf-8').catch(() => '[]')

    const productsData: WooCommerceProduct[] = JSON.parse(productsRaw)
    const usersData: WooCommerceCustomer[] = JSON.parse(usersRaw)
    const couponsData: WooCommerceCoupon[] = JSON.parse(couponsRaw)
    const affiliatesData: SliceWPAffiliate[] = JSON.parse(affiliatesRaw)

    console.log('--- Starting Migration ---')
    // Execute Phases
    // await migrateProducts(payload, productsData)
    // await migrateUsers(payload, usersData)
    // await migrateCoupons(payload, couponsData)
    // await migrateAffiliates(payload, affiliatesData)
    // await migrateOrders(payload, ordersData)

    console.log('--- Migration Completed ---')

  } catch (error) {
    console.error('Migration failed. Ensure the migration_data directory and JSON files exist.')
    console.error(error)
  }

  process.exit(0)
}

main()
