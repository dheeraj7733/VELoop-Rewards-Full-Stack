const mongoose = require('mongoose');
const withdrawalSchema = new mongoose.Schema({
  withdrawalId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: 'INR' },
  payoutMethod: { type: String, default: 'UPI' },
  accountDetails: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], default: 'PENDING' },
  rejectionReason: { type: String, default: '' },
  processedBy: { type: String, default: null },
  processedAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.model('Withdrawal', withdrawalSchema);
