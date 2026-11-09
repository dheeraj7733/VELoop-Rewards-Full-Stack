const mongoose = require('mongoose');
const levelConfigurationSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true, unique: true, index: true },
  levelName: { type: String, required: true },
  minXp: { type: Number, required: true },
  maxXp: { type: Number, required: true },
  badgeUrl: { type: String, default: '' },
  perks: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('LevelConfiguration', levelConfigurationSchema);
