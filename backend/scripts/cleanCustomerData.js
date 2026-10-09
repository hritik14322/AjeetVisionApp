const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const LoyaltyCard = require('../models/LoyaltyCard');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const Wishlist = require('../models/Wishlist');

async function clean() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const resUsers = await User.deleteMany({ role: { $ne: 'admin' } });
  console.log('Deleted customer users:', resUsers.deletedCount);

  const resPurchases = await Purchase.deleteMany({});
  console.log('Deleted customer purchases:', resPurchases.deletedCount);

  const resCards = await LoyaltyCard.deleteMany({});
  console.log('Deleted loyalty cards:', resCards.deletedCount);

  const resTxns = await LoyaltyTransaction.deleteMany({});
  console.log('Deleted loyalty transactions:', resTxns.deletedCount);

  const resWish = await Wishlist.deleteMany({});
  console.log('Deleted wishlists:', resWish.deletedCount);

  console.log('Database customer data cleanup complete!');
  process.exit(0);
}

clean().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
