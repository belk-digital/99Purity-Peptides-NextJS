import 'dotenv/config';
import { getPayload } from 'payload';
import config from './src/payload.config';
import fs from 'fs';

async function run() {
  const p = await getPayload({ config });
  const docs = await p.find({ collection: 'orders', limit: 1000 });
  const migrated = docs.docs.find(d => d.total === 12450 || d.total === 1245000 || d.total === 4880 || d.total === 488000 || d.orderNumber === '3050' || d.orderNumber === '4029' || d.id == 3050 || d.id == 4029);
  fs.writeFileSync('migrated-order.json', JSON.stringify(migrated, null, 2));
  console.log('done');
  process.exit(0);
}
run();
