const CK = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8';
const CS = 'cs_259d976093d3af4594cd37d3df8114092e1cb934';
const authHeader = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64');
fetch('https://99puritypeptides.com/staging-v2/wp-json/wc/v3/orders?per_page=1', { headers: { Authorization: authHeader } })
  .then(r => r.json())
  .then(data => console.log(JSON.stringify(data[0], null, 2)))
