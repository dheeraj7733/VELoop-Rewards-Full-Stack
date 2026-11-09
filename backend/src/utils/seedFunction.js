const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const LevelConfiguration = require('../models/LevelConfiguration');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Withdrawal = require('../models/Withdrawal');
const Referral = require('../models/Referral');
const ActivityLog = require('../models/ActivityLog');

const seedDatabase = async () => {
  console.log('Seeding VELoop Rewards database...');
  await User.deleteMany({});
  await Wallet.deleteMany({});
  await LevelConfiguration.deleteMany({});
  await Achievement.deleteMany({});
  await UserAchievement.deleteMany({});
  await Withdrawal.deleteMany({});
  await Referral.deleteMany({});
  await ActivityLog.deleteMany({});

  await LevelConfiguration.insertMany([
    { levelNumber: 1, levelName: 'Novice Earner', minXp: 0, maxXp: 1000 },
    { levelNumber: 2, levelName: 'Reward Seeker', minXp: 1000, maxXp: 2500 },
    { levelNumber: 3, levelName: 'Token Master', minXp: 2500, maxXp: 5000 },
    { levelNumber: 4, levelName: 'Reward Explorer', minXp: 5000, maxXp: 8000 },
    { levelNumber: 5, levelName: 'Apex Champion', minXp: 8000, maxXp: 12000 }
  ]);

  await Achievement.insertMany([
    { code: 'ACH_FIRST_STEP', name: 'First Milestone', description: 'Complete registration', tier: 'BRONZE' },
    { code: 'ACH_GOLD_HUNTER', name: 'Gold Reward Hunter', description: 'Accumulate 2,500+ VEs', tier: 'GOLD' },
    { code: 'ACH_SILVER_STACKER', name: 'Silver Stacker', description: 'Hold 1,000+ SVEs', tier: 'SILVER' }
  ]);

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@12345', salt);
  const userPassword = await bcrypt.hash('User@12345', salt);

  await User.create({
    userId: 'VLRADM202600001', displayName: 'VELoop Administrator',
    email: 'demo-admin@example.com', password: adminPassword, role: 'SUPER_ADMIN',
    referralCode: 'VLADMIN01', isVerified: true
  });

  const demoUser = await User.create({
    userId: 'VLRUSR202600123', displayName: 'Demo User',
    email: 'demo-user@example.com', password: userPassword, role: 'USER',
    referralCode: 'VELOOP123', isVerified: true
  });

  await Wallet.create({
    userId: demoUser.userId, ves: 3850, sves: 1240, gems: 240, tokens: 5000, xp: 6420, reservedVes: 200
  });

  await Withdrawal.insertMany([
    { withdrawalId: 'WTH1001', userId: demoUser.userId, amount: 1200, currency: 'INR', status: 'COMPLETED', accountDetails: 'demo@upi' },
    { withdrawalId: 'WTH1002', userId: demoUser.userId, amount: 1250, currency: 'INR', status: 'COMPLETED', accountDetails: 'demo@upi' },
    { withdrawalId: 'WTH1003', userId: demoUser.userId, amount: 100, currency: 'INR', status: 'PENDING', accountDetails: 'demo@upi' },
    { withdrawalId: 'WTH1004', userId: demoUser.userId, amount: 100, currency: 'INR', status: 'PENDING', accountDetails: 'demo@upi' }
  ]);

  await Referral.create([
    { referralId: 'REF01', referrerUserId: demoUser.userId, referredUserId: 'VLRUSR202', referralCode: 'VELOOP123', status: 'SUCCESSFUL', rewardVes: 250, rewardXp: 500 }
  ]);

  await ActivityLog.create([
    { userId: demoUser.userId, type: 'DAILY_BONUS', description: 'Daily check-in reward', asset: 'VES', amount: 50 },
    { userId: demoUser.userId, type: 'WATCH_ADS', description: 'Watched video ad', asset: 'GEMS', amount: 15 }
  ]);

  console.log('Seeding complete!');
};

module.exports = seedDatabase;
