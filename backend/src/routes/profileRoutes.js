const express = require('express');
const router = express.Router();
const {
  getProfileMe, updateProfileMe, getRewards, getLevelProgress,
  getAchievements, getWithdrawalSummary, requestWithdrawal, getReferrals, getActivity
} = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.get('/me', getProfileMe);
router.patch('/me', updateProfileMe);
router.get('/rewards', getRewards);
router.get('/level-progress', getLevelProgress);
router.get('/achievements', getAchievements);
router.get('/withdrawal-summary', getWithdrawalSummary);
router.post('/withdraw', requestWithdrawal);
router.get('/referrals', getReferrals);
router.get('/activity', getActivity);

module.exports = router;
