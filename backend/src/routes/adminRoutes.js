const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getUsers, updateUserStatus, adjustWalletBalance,
  getWithdrawals, updateWithdrawalStatus, getAuditLogs, resetDemo
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.post('/adjust-balance', adjustWalletBalance);
router.get('/withdrawals', getWithdrawals);
router.patch('/withdrawals/:id', updateWithdrawalStatus);
router.get('/audit-logs', getAuditLogs);
router.post('/reset-demo', resetDemo);

module.exports = router;
