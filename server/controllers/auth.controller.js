import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const safeEqual = (a = '', b = '') => {
  const hashA = crypto.createHash('sha256').update(String(a)).digest();
  const hashB = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

export function authStatus(req, res) {
  const missing = [];
  if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) missing.push('JWT_SECRET (at least 32 characters)');
  res.json({ configured: missing.length === 0, missing });
}

export function login(req, res) {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({ message: 'Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and a JWT_SECRET of at least 32 characters.' });
  }
  const { email, password } = req.body || {};
  const validEmail = safeEqual(email, process.env.ADMIN_EMAIL);
  const validPassword = safeEqual(password, process.env.ADMIN_PASSWORD);
  if (!validEmail || !validPassword) return res.status(401).json({ message: 'Email or password is incorrect.' });
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
}
