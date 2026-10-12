const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });

async function cleanDB(uri, label) {
  try {
    const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 3000 }).asPromise();
    const uRes = await conn.collection('users').deleteMany({ role: { $ne: 'admin' } });
    const pRes = await conn.collection('purchases').deleteMany({});
    const oRes = await conn.collection('otps').deleteMany({});
    console.log(`[${label}] Deleted customers: ${uRes.deletedCount}, purchases: ${pRes.deletedCount}, otps: ${oRes.deletedCount}`);
    await conn.close();
  } catch (e) {
    console.log(`[${label}] Skipped/Error: ${e.message}`);
  }
}

async function main() {
  await cleanDB(process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/new-ajeet-vision', 'Local MongoDB');
  if (process.env.MONGO_URI) {
    await cleanDB(process.env.MONGO_URI, 'Atlas MongoDB');
  }
  console.log('Customer data cleanup complete.');
  process.exit(0);
}

main();
