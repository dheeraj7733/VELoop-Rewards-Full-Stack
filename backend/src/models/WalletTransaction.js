const mongoose = require('mongoose');
const walletTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  asset: { type: String, enum: ['VES', 'SVES', 'GEMS', 'TOKENS', 'XP'], required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT', 'ADJUSTMENT', 'WITHDRAWAL_HOLD', 'WITHDRAWAL_REFUND', 'BONUS'], required: true },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  reference: { type: String, default: '' },
  reason: { type: String, default: '' },
  performedBy: { type: String, default: 'SYSTEM' }
}, { timestamps: true });
module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
