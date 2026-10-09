const asyncHandler = require('express-async-handler');
const Offer = require('../models/Offer');

const createOffer = asyncHandler(async (req, res) => {
  const offer = new Offer(req.body);
  await offer.save();
  res.status(201).json(offer);
});

const getActiveOffers = asyncHandler(async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({ isActive: true, startDate: { $lte: now }, endDate: { $gte: now } }).populate('products');
  res.json(offers);
});

module.exports = { createOffer, getActiveOffers };
