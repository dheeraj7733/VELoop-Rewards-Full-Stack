const mongoose = require('mongoose');
const referralSchema = new mongoose.Schema({
  referralId: { type: String, required: true, unique: true },
  referrerUserId: { type: String, required: true, index: true },
  referredUserId: { type: String, required: true, unique: true },
  referralCode: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESSFUL'], default: 'SUCCESSFUL' },
  rewardVes: { type: Number, default: 250 },
  rewardXp: { type: Number, default: 500 }
}, { timestamps: true });
module.exports = mongoose.model('Referral', referralSchema);
