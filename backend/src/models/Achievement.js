const mongoose = require('mongoose');
const achievementSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  tier: { type: String, enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'], default: 'BRONZE' },
  icon: { type: String, default: 'Trophy' },
  xpReward: { type: Number, default: 100 },
  requiredXp: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Achievement', achievementSchema);
