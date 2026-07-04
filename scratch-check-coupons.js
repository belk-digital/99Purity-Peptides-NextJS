const CK = 'ck_6a84688cd6ab0bb41d1dc3db4a63fb36853434f8';
const CS = 'cs_259d976093d3af4594cd37d3df8114092e1cb934';
const authHeader = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64');
fetch('https://99puritypeptides.com/staging-v2/wp-json/wc/v3/coupons?per_page=100', { headers: { Authorization: authHeader } })
  .then(r => r.json())
  .then(data => {
    const hasProducts = data.filter(c => c.product_ids && c.product_ids.length > 0).map(c => c.code);
    const hasCategories = data.filter(c => c.product_categories && c.product_categories.length > 0).map(c => c.code);
    const notStackable = data.filter(c => c.individual_use === true).length;
    console.log('Products:', hasProducts);
    console.log('Categories:', hasCategories);
    console.log('Not Stackable count:', notStackable);
  })
