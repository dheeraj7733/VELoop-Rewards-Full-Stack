const User = require('../models/User');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const LevelConfiguration = require('../models/LevelConfiguration');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Withdrawal = require('../models/Withdrawal');
const Referral = require('../models/Referral');
const ActivityLog = require('../models/ActivityLog');

const getProfileMe = async (req, res, next) => {
  try {
    const user = req.user;
    const wallet = await Wallet.findOne({ userId: user.userId }) || {
      ves: 0, sves: 0, gems: 0, tokens: 0, xp: 0
    };

    const levels = await LevelConfiguration.find({ isActive: true }).sort({ levelNumber: 1 });
    let currentLevel = levels[0] || { levelNumber: 1, levelName: 'Novice Earner', minXp: 0, maxXp: 1000 };
    let nextLevel = levels[1] || null;

    for (let i = 0; i < levels.length; i++) {
      if (wallet.xp >= levels[i].minXp) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || null;
      }
    }

    const currentXp = wallet.xp;
    const nextLevelXp = nextLevel ? nextLevel.minXp : currentLevel.maxXp;
    const xpRemaining = Math.max(0, nextLevelXp - currentXp);
    const progressRange = nextLevel ? (nextLevel.minXp - currentLevel.minXp) : (currentLevel.maxXp - currentLevel.minXp);
    const progressWithinLevel = Math.max(0, currentXp - currentLevel.minXp);
    const progressPercentage = progressRange > 0 ? Math.min(100, Math.round((progressWithinLevel / progressRange) * 100)) : 100;

    res.json({
      success: true,
      profile: {
        userId: user.userId, displayName: user.displayName, email: user.email,
        referralCode: user.referralCode, accountStatus: user.accountStatus, isVerified: user.isVerified,
        memberSince: user.memberSince, avatarUrl: user.avatarUrl
      },
      rewards: {
        ves: wallet.ves, sves: wallet.sves, gems: wallet.gems, tokens: wallet.tokens, xp: wallet.xp,
        reservedVes: wallet.reservedVes || 0
      },
      levelProgress: {
        currentLevel: currentLevel.levelNumber, currentLevelName: currentLevel.levelName,
        nextLevel: nextLevel ? nextLevel.levelNumber : null, nextLevelName: nextLevel ? nextLevel.levelName : 'Max Level',
        currentXp, nextLevelXp, xpRemaining, progressPercentage
      }
    });
  } catch (error) { next(error); }
};

const updateProfileMe = async (req, res, next) => {
  try {
    const { displayName } = req.body;
    if (!displayName || displayName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Display name must be at least 2 characters long.' });
    }
    req.user.displayName = displayName.trim();
    await req.user.save();
    res.json({ success: true, message: 'Profile updated successfully', profile: req.user });
  } catch (error) { next(error); }
};

const getRewards = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId }) || { ves: 0, sves: 0, gems: 0, tokens: 0, xp: 0 };
    res.json({ success: true, rewards: wallet });
  } catch (error) { next(error); }
};

const getLevelProgress = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId }) || { xp: 0 };
    const levels = await LevelConfiguration.find({ isActive: true }).sort({ levelNumber: 1 });
    let currentLevel = levels[0];
    let nextLevel = levels[1] || null;

    for (let i = 0; i < levels.length; i++) {
      if (wallet.xp >= levels[i].minXp) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || null;
      }
    }
    const currentXp = wallet.xp;
    const nextLevelXp = nextLevel ? nextLevel.minXp : currentLevel.maxXp;
    res.json({
      success: true,
      levelProgress: {
        currentLevel: currentLevel.levelNumber, currentLevelName: currentLevel.levelName,
        currentXp, nextLevel: nextLevel ? nextLevel.levelNumber : null,
        nextLevelName: nextLevel ? nextLevel.levelName : 'Max Level',
        nextLevelXp, xpRemaining: Math.max(0, nextLevelXp - currentXp),
        progressPercentage: Math.min(100, Math.round(((currentXp - currentLevel.minXp) / (nextLevelXp - currentLevel.minXp || 1)) * 100))
      }
    });
  } catch (error) { next(error); }
};

const getAchievements = async (req, res, next) => {
  try {
    const all = await Achievement.find({ isActive: true });
    const userAch = await UserAchievement.find({ userId: req.user.userId });
    const userMap = {};
    userAch.forEach(ua => userMap[ua.achievementCode] = ua);

    const items = all.map(ach => ({
      code: ach.code, name: ach.name, description: ach.description, tier: ach.tier,
      icon: ach.icon, xpReward: ach.xpReward,
      status: userMap[ach.code] ? userMap[ach.code].status : 'LOCKED',
      progress: userMap[ach.code] ? userMap[ach.code].progress : 0
    }));

    res.json({
      success: true,
      totalCount: items.length,
      unlockedCount: items.filter(i => i.status === 'UNLOCKED').length,
      achievements: items
    });
  } catch (error) { next(error); }
};

const getWithdrawalSummary = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    const totalRequests = withdrawals.length;
    const pending = withdrawals.filter(w => w.status === 'PENDING').length;
    const approved = withdrawals.filter(w => w.status === 'APPROVED' || w.status === 'COMPLETED').length;
    const rejected = withdrawals.filter(w => w.status === 'REJECTED').length;
    const totalWithdrawn = withdrawals.filter(w => w.status === 'APPROVED' || w.status === 'COMPLETED').reduce((sum, w) => sum + w.amount, 0);

    res.json({
      success: true,
      summary: { totalRequests, pending, approved, rejected, totalWithdrawn },
      recentWithdrawals: withdrawals.slice(0, 5)
    });
  } catch (error) { next(error); }
};

const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, payoutMethod, accountDetails } = req.body;
    const withdrawalAmount = Number(amount);
    if (!withdrawalAmount || withdrawalAmount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is 100 VEs.' });
    }
    const wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet || wallet.ves < withdrawalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient VEs balance.' });
    }

    wallet.ves -= withdrawalAmount;
    wallet.reservedVes = (wallet.reservedVes || 0) + withdrawalAmount;
    await wallet.save();

    const withdrawalId = `WTH${Date.now()}`;
    const withdrawal = await Withdrawal.create({
      withdrawalId, userId: req.user.userId, amount: withdrawalAmount,
      currency: 'INR', payoutMethod: payoutMethod || 'UPI', accountDetails, status: 'PENDING'
    });

    await ActivityLog.create({
      userId: req.user.userId, type: 'REDEMPTION_REQUEST',
      description: `Withdrawal request submitted for Rs. ${withdrawalAmount}`,
      asset: 'VES', amount: withdrawalAmount, status: 'PENDING'
    });

    res.status(201).json({ success: true, message: 'Withdrawal requested successfully', withdrawal });
  } catch (error) { next(error); }
};

const getReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ referrerUserId: req.user.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      referralCode: req.user.referralCode,
      totalReferrals: referrals.length,
      successfulReferrals: referrals.filter(r => r.status === 'SUCCESSFUL').length,
      pendingReferrals: referrals.filter(r => r.status === 'PENDING').length,
      referralRewardsEarned: referrals.filter(r => r.status === 'SUCCESSFUL').reduce((sum, r) => sum + r.rewardVes, 0),
      referralXp: referrals.filter(r => r.status === 'SUCCESSFUL').reduce((sum, r) => sum + r.rewardXp, 0),
      referrals
    });
  } catch (error) { next(error); }
};

const getActivity = async (req, res, next) => {
  try {
    const activities = await ActivityLog.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(15);
    res.json({ success: true, activities });
  } catch (error) { next(error); }
};

module.exports = {
  getProfileMe, updateProfileMe, getRewards, getLevelProgress, getAchievements,
  getWithdrawalSummary, requestWithdrawal, getReferrals, getActivity
};
