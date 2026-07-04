const CK = 'ck_t7ArhVAOqHcNEARZaEXJK58YCCwVpL';
const CS = 'cs_3a6ohjTlrEromi3noxN5loPefeJTA0';

Promise.all(['commissions', 'payouts', 'visits'].map(endpoint => 
  fetch(`https://99puritypeptides.com/staging-v2/wp-json/slicewp/v1/${endpoint}?consumer_key=${CK}&consumer_secret=${CS}`)
    .then(r => r.json())
    .then(data => ({ endpoint, data }))
)).then(results => {
  results.forEach(r => {
    console.log(`Endpoint: ${r.endpoint}`);
    console.log(r.data.length ? r.data.slice(0, 2) : r.data);
  });
}).catch(console.error);
