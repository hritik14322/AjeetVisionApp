const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ customer: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ customer: req.user._id, products: [{ product: productId }] });
  } else {
    const exists = wishlist.products.find(p => p.product.toString() === productId);
    if (exists) {
      wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId);
    } else {
      wishlist.products.push({ product: productId });
    }
  }

  await wishlist.save();
  res.json(wishlist);
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ customer: req.user._id }).populate('products.product', 'name price images discount isDeal');
  res.json(wishlist || { products: [] });
});

module.exports = { toggleWishlist, getWishlist };
