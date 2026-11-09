const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const ActivityLog = require('../models/ActivityLog');
const AdminAuditLog = require('../models/AdminAuditLog');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_veloop_2026_change_in_production',
    { expiresIn: '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { displayName, email, password, referralCode } = req.body;
    if (!displayName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const count = await User.countDocuments();
    const newUserId = `VLRUSR${new Date().getFullYear()}${String(count + 101).padStart(5, '0')}`;
    const generatedReferralCode = `VL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const user = await User.create({
      userId: newUserId,
      displayName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'USER',
      referralCode: generatedReferralCode,
      referredBy: referrer ? referrer.userId : null,
      accountStatus: 'ACTIVE',
      isVerified: false
    });

    await Wallet.create({
      userId: user.userId,
      ves: 100, sves: 50, gems: 10, tokens: 250, xp: 200, reservedVes: 0
    });

    await ActivityLog.create({
      userId: user.userId,
      type: 'DAILY_BONUS',
      description: 'Welcome bonus credited on account registration',
      asset: 'VES',
      amount: 100,
      status: 'SUCCESS'
    });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        userId: user.userId, displayName: user.displayName, email: user.email,
        role: user.role, referralCode: user.referralCode, accountStatus: user.accountStatus, isVerified: user.isVerified
      }
    });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Please contact administrator.' });
    }

    const token = generateToken(user);
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      await AdminAuditLog.create({
        auditId: `AUD${Date.now()}`,
        adminUserId: user.userId,
        adminEmail: user.email,
        action: 'ADMIN_LOGIN',
        targetType: 'SECURITY',
        targetId: user.userId,
        reason: 'Administrator authenticated successfully',
        ipAddress: req.ip || '127.0.0.1'
      });
    }

    res.json({
      success: true,
      token,
      user: {
        userId: user.userId, displayName: user.displayName, email: user.email,
        role: user.role, referralCode: user.referralCode, accountStatus: user.accountStatus, isVerified: user.isVerified
      }
    });
  } catch (error) { next(error); }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      userId: req.user.userId, displayName: req.user.displayName, email: req.user.email,
      role: req.user.role, referralCode: req.user.referralCode, accountStatus: req.user.accountStatus,
      isVerified: req.user.isVerified, memberSince: req.user.memberSince
    }
  });
};

const getDemoCredentials = async (req, res) => {
  res.json({
    success: true,
    demoAdmin: {
      email: process.env.ADMIN_SEED_EMAIL || 'demo-admin@example.com',
      password: process.env.ADMIN_SEED_PASSWORD || 'Admin@12345',
      role: 'SUPER_ADMIN'
    },
    demoUser: {
      email: process.env.USER_SEED_EMAIL || 'demo-user@example.com',
      password: process.env.USER_SEED_PASSWORD || 'User@12345',
      role: 'USER'
    }
  });
};

module.exports = { register, login, getMe, getDemoCredentials };
