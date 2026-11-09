const mongoose = require('mongoose');
const userAchievementSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  achievementCode: { type: String, required: true },
  status: { type: String, enum: ['LOCKED', 'IN_PROGRESS', 'UNLOCKED'], default: 'LOCKED' },
  unlockedAt: { type: Date, default: null },
  progress: { type: Number, default: 0 }
}, { timestamps: true });
userAchievementSchema.index({ userId: 1, achievementCode: 1 }, { unique: true });
module.exports = mongoose.model('UserAchievement', userAchievementSchema);
