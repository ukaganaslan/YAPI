const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const { log } = require('../middleware/logger');

// ── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, institution, city, country } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email: email?.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role, institution, city, country });

    // Audit log
    req.user = user;
    await log({ action: 'REGISTER', req, targetEntity: user._id, targetType: 'User' });

    const token = signToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        city: user.city,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('[Register Error]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Include password field explicitly (select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // Audit failed login
      req.user = null;
      await log({ action: 'LOGIN_FAILED', req, details: `Unknown email: ${email}`, result: 'FAILURE' });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.user = user;
      await log({ action: 'LOGIN_FAILED', req, targetEntity: user._id, targetType: 'User', result: 'FAILURE' });
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    req.user = user;
    await log({ action: 'LOGIN_SUCCESS', req, targetEntity: user._id, targetType: 'User' });

    const token = signToken(user);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        city: user.city,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ── DELETE /api/auth/me ─────────────────────────────────────────────────────
router.delete('/me', protect, async (req, res) => {
  try {
    await log({ action: 'ACCOUNT_DELETE', req, targetEntity: req.user._id, targetType: 'User' });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted permanently.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
