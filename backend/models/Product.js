const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    images: [
      {
        type: String, // Cloudinary URLs
        required: true,
      },
    ],
    emiConfig: {
      available: { type: Boolean, default: false },
      interestRate: { type: Number, default: 0 }, // Annual percentage
      tenureOptions: [{ type: Number }], // e.g. [3, 6, 9, 12] months
      minDownPayment: { type: Number, default: 0 },
    },
    isDeal: {
      type: Boolean,
      default: false,
    },
    offerEndDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
