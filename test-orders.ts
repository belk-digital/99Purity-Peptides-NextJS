import 'dotenv/config';
import { getPayload } from 'payload';
import config from './src/payload.config';

async function run() {
  const p = await getPayload({
    config,
  });

  const o1 = await p.find({
    collection: 'orders',
    where: {
      orderNumber: { equals: '3050' }
    }
  });

  const o2 = await p.find({
    collection: 'orders',
    where: {
      orderNumber: { equals: '7013' }
    }
  });

  console.log("Migrated Order:", JSON.stringify(o1.docs[0], null, 2));
  console.log("New Order:", JSON.stringify(o2.docs[0], null, 2));
  process.exit(0);
}

run();
