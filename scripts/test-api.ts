const SLICEWP_URL = 'https://99puritypeptides.com/staging-v2/wp-json/slicewp/v1'
const CK = 'ck_t7ArhVAOqHcNEARZaEXJK58YCCwVpL'
const CS = 'cs_3a6ohjTlrEromi3noxN5loPefeJTA0'

async function main() {
  const url = `${SLICEWP_URL}/payments?consumer_key=${CK}&consumer_secret=${CS}&per_page=100&offset=0`
  const res = await fetch(url)
  const data = await res.json()
  console.log(JSON.stringify(data, null, 2))
}
main()
