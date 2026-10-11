const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Purchase = require('./models/Purchase');

async function seed() {
  await connectDB();
  
  await User.deleteMany({ email: 'hritik@gmail.com' });
  await Purchase.deleteMany({ invoiceNumber: 'NAV-2024-001' });

  const user = await User.create({
    name: 'Hritik Kumar',
    email: 'hritik@gmail.com',
    mobile: '+91 99318 42478',
    password: 'password123',
    role: 'customer',
    vipMembership: {
      isActive: true,
      expiryDate: new Date('2027-12-31'),
    },
    loyaltyPoints: 950,
    rewardProgress: {
      currentAmount: 48990,
      targetAmount: 100000,
      isUnlocked: false,
      claimStatus: 'locked',
    },
  });

  const purchase = await Purchase.create({
    customer: user._id,
    invoiceNumber: 'NAV-2024-001',
    products: [
      {
        name: 'Sony Bravia 50" 4K Smart Google TV',
        quantity: 1,
        price: 48990,
      },
    ],
    totalAmount: 48990,
    amountPaid: 48990,
    remainingAmount: 0,
    paymentHistory: [
      {
        amount: 48990,
        method: 'UPI / Online',
      },
    ],
  });

  console.log('Seeded demo customer Hritik Kumar successfully:', user._id);
  console.log('Created sample bill:', purchase.invoiceNumber);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
