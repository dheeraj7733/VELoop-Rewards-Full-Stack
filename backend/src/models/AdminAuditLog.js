const mongoose = require('mongoose');
const adminAuditLogSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true },
  adminUserId: { type: String, required: true },
  adminEmail: { type: String, required: true },
  action: { type: String, required: true },
  targetType: { type: String, enum: ['USER', 'WALLET', 'WITHDRAWAL', 'LEVEL', 'ACHIEVEMENT', 'SECURITY', 'SYSTEM'], required: true },
  targetId: { type: String, required: true },
  previousValue: { type: mongoose.Schema.Types.Mixed, default: null },
  newValue: { type: mongoose.Schema.Types.Mixed, default: null },
  reason: { type: String, required: true },
  ipAddress: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
