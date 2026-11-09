const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true, ref: 'User' },
  ves: { type: Number, default: 0, min: 0 },
  sves: { type: Number, default: 0, min: 0 },
  gems: { type: Number, default: 0, min: 0 },
  tokens: { type: Number, default: 0, min: 0 },
  xp: { type: Number, default: 0, min: 0 },
  reservedVes: { type: Number, default: 0, min: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Wallet', walletSchema);
