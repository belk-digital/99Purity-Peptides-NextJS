import 'dotenv/config';
import { getPayload } from 'payload';
import config from './src/payload.config';

async function run() {
  const p = await getPayload({ config });
  
  // get orders where total is > 4000 
  const o1 = await p.find({
    collection: 'orders',
    where: { total: { greater_than: 4000 } },
    limit: 50
  });

  const migrated = o1.docs.find(d => d.total === 4880 || d.total === 488000 || d.total === 12450 || d.total === 1245000 || d.id == 3050 || d.orderNumber === '3050');
  console.log("Migrated Order:", JSON.stringify(migrated, null, 2));
  process.exit(0);
}
run();
