/**
 * Return (item disposal event) schema
 * Fraud basics: record device/user context for risk scoring.
 */

const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barcode: { type: String, required: true },
  deviceId: { type: String, required: true },
  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  photoHash: { type: String, required: true }, // Perceptual hash of the submitted photo
  createdAt: { type: Date, default: Date.now },
  scanTimestamp: { type: Date, required: true }, // When scanned by the user
  rewardAmount: { type: Number, required: true },
  fraudReview: { type: Boolean, default: false },
  fraudScore: { type: Number, default: 0 }, // 0-100; >50 triggers review
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

ReturnSchema.methods.computeFraudScore = function (recentReturns = []) {
  // Simple MVP scoring: high risk if rapid-fire, duplicate device/photo, location mismatch
  let score = 0;
  // 1. Rapid-fire: If <10s since last return from same user/device
  if (recentReturns.length > 0) {
    const lastReturn = recentReturns[0];
    const delta = (this.createdAt - lastReturn.createdAt) / 1000;
    if (delta < 10) score += 50;
  }
  // 2. Duplicate photo hash from same device
  if (recentReturns.some(r => r.photoHash === this.photoHash)) score += 40;
  // 3. Location mismatch (e.g., >1km from collection point - check in route)
  // Placeholder: assume location check elsewhere
  // 4. Bonus: If all clean, score stays 0
  this.fraudScore = score;
  this.fraudReview = score >= 50;
  return this.fraudScore;
};

module.exports = mongoose.model('Return', ReturnSchema);