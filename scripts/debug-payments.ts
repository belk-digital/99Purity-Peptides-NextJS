import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })
dotenvConfig({ path: '.env' })
const SLICEWP_URL = 'https://99puritypeptides.com/staging-v2/wp-json/slicewp/v1'
const CK = 'ck_t7ArhVAOqHcNEARZaEXJK58YCCwVpL'
const CS = 'cs_3a6ohjTlrEromi3noxN5loPefeJTA0'
async function debug() {
  const url = `${SLICEWP_URL}/payments?consumer_key=${CK}&consumer_secret=${CS}&per_page=5`
  const res = await fetch(url)
  const data = await res.json()
  console.log(JSON.stringify(data, null, 2))
}
debug()
