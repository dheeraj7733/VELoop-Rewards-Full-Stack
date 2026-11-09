const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Withdrawal = require('../models/Withdrawal');
const AdminAuditLog = require('../models/AdminAuditLog');
const seedDatabase = require('../utils/seedFunction');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ accountStatus: 'ACTIVE' });
    const suspendedUsers = await User.countDocuments({ accountStatus: 'SUSPENDED' });
    const wallets = await Wallet.find();
    const withdrawals = await Withdrawal.find();

    res.json({
      success: true,
      stats: {
        totalUsers, activeUsers, suspendedUsers,
        walletTotals: {
          ves: wallets.reduce((a, b) => a + (b.ves || 0), 0),
          sves: wallets.reduce((a, b) => a + (b.sves || 0), 0),
          gems: wallets.reduce((a, b) => a + (b.gems || 0), 0),
          tokens: wallets.reduce((a, b) => a + (b.tokens || 0), 0),
          xp: wallets.reduce((a, b) => a + (b.xp || 0), 0)
        },
        withdrawals: {
          totalRequests: withdrawals.length,
          pending: withdrawals.filter(w => w.status === 'PENDING').length,
          approved: withdrawals.filter(w => w.status === 'APPROVED' || w.status === 'COMPLETED').length,
          completed: withdrawals.filter(w => w.status === 'COMPLETED').length,
          totalAmountWithdrawn: withdrawals.filter(w => w.status === 'APPROVED' || w.status === 'COMPLETED').reduce((a, b) => a + b.amount, 0)
        }
      }
    });
  } catch (error) { next(error); }
};

const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    const wallets = await Wallet.find();
    const walletMap = {};
    wallets.forEach(w => walletMap[w.userId] = w);

    const userList = users.map(u => ({ ...u.toObject(), wallet: walletMap[u.userId] || { ves: 0, xp: 0 } }));
    res.json({ success: true, users: userList });
  } catch (error) { next(error); }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.accountStatus = status;
    await user.save();
    await AdminAuditLog.create({
      auditId: `AUD${Date.now()}`, adminUserId: req.user.userId, adminEmail: req.user.email,
      action: 'UPDATE_USER_STATUS', targetType: 'USER', targetId: user.userId, reason, ipAddress: req.ip || ''
    });
    res.json({ success: true, message: `Status updated to ${status}`, user });
  } catch (error) { next(error); }
};

const adjustWalletBalance = async (req, res, next) => {
  try {
    const { userId, asset, action, amount, reason } = req.body;
    const adjAmount = Number(amount);
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ success: false, message: 'Wallet not found' });

    const key = asset.toLowerCase();
    const balanceBefore = wallet[key] || 0;
    const balanceAfter = action === 'CREDIT' ? balanceBefore + adjAmount : Math.max(0, balanceBefore - adjAmount);
    wallet[key] = balanceAfter;
    await wallet.save();

    await AdminAuditLog.create({
      auditId: `AUD${Date.now()}`, adminUserId: req.user.userId, adminEmail: req.user.email,
      action: `WALLET_${action}`, targetType: 'WALLET', targetId: userId, reason, ipAddress: req.ip || ''
    });

    res.json({ success: true, message: 'Balance adjusted successfully', wallet });
  } catch (error) { next(error); }
};

const getWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.json({ success: true, withdrawals });
  } catch (error) { next(error); }
};

const updateWithdrawalStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const withdrawal = await Withdrawal.findOne({ withdrawalId: req.params.id });
    if (!withdrawal) return res.status(404).json({ success: false, message: 'Not found' });

    withdrawal.status = status;
    if (reason) withdrawal.rejectionReason = reason;
    await withdrawal.save();

    if (status === 'REJECTED') {
      const wallet = await Wallet.findOne({ userId: withdrawal.userId });
      if (wallet) {
        wallet.ves += withdrawal.amount;
        wallet.reservedVes = Math.max(0, (wallet.reservedVes || 0) - withdrawal.amount);
        await wallet.save();
      }
    }

    res.json({ success: true, message: `Withdrawal ${status}`, withdrawal });
  } catch (error) { next(error); }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AdminAuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, logs });
  } catch (error) { next(error); }
};

const resetDemo = async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Demo database reset successfully' });
  } catch (error) { next(error); }
};

module.exports = {
  getDashboardStats, getUsers, updateUserStatus, adjustWalletBalance,
  getWithdrawals, updateWithdrawalStatus, getAuditLogs, resetDemo
};
