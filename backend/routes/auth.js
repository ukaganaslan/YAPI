const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { signToken, protect } = require('../middleware/auth');
const { log } = require('../middleware/logger');

// ── POST /api/auth/register ─────────────────────────────────────────────────
const universities = require('../data/university-domains.json');
const knownEduDomains = new Set(universities.flatMap(u => u.domains.map(d => d.toLowerCase())));

function isKnownEduDomain(email) {
  const domain = email?.split('@')[1]?.toLowerCase();
  return domain ? knownEduDomains.has(domain) : false;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, institution, city, country } = req.body;

    if (!isKnownEduDomain(email)) {
      return res.status(400).json({ message: 'Email domain not recognized as a valid institution. Please use your official university email.' });
    }

    const existing = await User.findOne({ email: email?.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role, institution, city, country });

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

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
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
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ── PUT /api/auth/me ────────────────────────────────────────────────────────
router.put('/me', protect, async (req, res) => {
  try {
    const { name, institution, city, country, bio, expertiseTags } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (institution !== undefined) user.institution = institution;
    if (city !== undefined) user.city = city;
    if (country !== undefined) user.country = country;
    if (bio !== undefined) user.bio = bio;
    if (expertiseTags !== undefined) user.expertiseTags = expertiseTags;

    await user.save({ validateBeforeSave: false });
    await log({ action: 'PROFILE_UPDATE', req, targetEntity: user._id, targetType: 'User' });

    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    console.error('[Profile Update Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/auth/me/export ─────────────────────────────────────────────────
router.get('/me/export', protect, async (req, res) => {
  try {
    const user = req.user.toJSON();
    const posts = await Post.find({ author: req.user._id }).select('-meetingRequests');

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: user,
      posts,
    };

    await log({ action: 'DATA_EXPORT', req, targetEntity: req.user._id, targetType: 'User' });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="healthai-my-data.json"');
    res.json(exportData);
  } catch (err) {
    console.error('[Data Export Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
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
