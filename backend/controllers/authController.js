import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000
});

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

function issueSession(user, res) {
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', issuer: 'veloop-rewards' }
  );
  res.cookie('accessToken', token, cookieOptions());
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    // Public registration always creates a regular user. Never accept role from the client.
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    issueSession(user, res);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
    return res.status(500).json({ message: 'Unable to create account' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const valid = user && await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    issueSession(user, res);
    return res.json({ user: publicUser(user) });
  } catch {
    return res.status(500).json({ message: 'Unable to sign in' });
  }
}

export function logout(_req, res) {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  return res.json({ message: 'Signed out successfully' });
}

export function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}
