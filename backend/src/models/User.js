const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  displayName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
  avatarUrl: { type: String, default: '' },
  referralCode: { type: String, required: true, unique: true, uppercase: true, index: true },
  referredBy: { type: String, default: null },
  accountStatus: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'UNDER_REVIEW'], default: 'ACTIVE' },
  isVerified: { type: Boolean, default: false },
  memberSince: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
