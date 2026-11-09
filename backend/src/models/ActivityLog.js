const mongoose = require('mongoose');
const activityLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['DAILY_BONUS', 'WATCH_ADS', 'REFERRAL_REWARD', 'GEM_REWARD', 'XP_EARNED', 'REDEMPTION_REQUEST', 'COMPLETED_WITHDRAWAL', 'PROFILE_UPDATE'], required: true },
  description: { type: String, required: true },
  asset: { type: String, enum: ['VES', 'SVES', 'GEMS', 'TOKENS', 'XP', 'INR', 'NONE'], default: 'NONE' },
  amount: { type: Number, default: 0 },
  status: { type: String, default: 'SUCCESS' }
}, { timestamps: true });
module.exports = mongoose.model('ActivityLog', activityLogSchema);
