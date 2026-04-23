const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const AuditLog = require('../models/AuditLog');
const { protect, restrictTo } = require('../middleware/auth');
const { log } = require('../middleware/logger');

// All admin routes require Admin role
router.use(protect, restrictTo('Admin'));

// ── GET /api/admin/users ────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { role, suspended, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (suspended !== undefined) filter.isSuspended = suspended === 'true';

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, users });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PATCH /api/admin/users/:id/suspend ─────────────────────────────────────
router.patch('/users/:id/suspend', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.isSuspended = !user.isSuspended;
    await user.save({ validateBeforeSave: false });

    await log({
      action: 'ADMIN_SUSPEND_USER',
      req,
      targetEntity: user._id,
      targetType: 'User',
      details: `Suspended: ${user.isSuspended}`,
    });

    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'reactivated'}.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/posts ────────────────────────────────────────────────────
router.get('/posts', async (req, res) => {
  try {
    const { domain, status, city, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (domain) filter.domain = domain;
    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, 'i');

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/admin/posts/:id ─────────────────────────────────────────────
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    await post.deleteOne();
    await log({ action: 'ADMIN_DELETE_POST', req, targetEntity: req.params.id, targetType: 'Post' });

    res.json({ message: 'Post removed by admin.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/logs ─────────────────────────────────────────────────────
router.get('/logs', async (req, res) => {
  try {
    const { userEmail, action, from, to, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (userEmail) filter.userEmail = new RegExp(userEmail, 'i');
    if (action) filter.action = action;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    await log({ action: 'ADMIN_VIEW_LOGS', req });

    res.json({ total, logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/logs/export ──────────────────────────────────────────────
router.get('/logs/export', async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(5000);

    // Build CSV
    const header = 'timestamp,userId,userEmail,userRole,action,targetEntity,targetType,result,details,ipAddress\n';
    const rows = logs.map((l) =>
      [
        l.createdAt.toISOString(),
        l.userId || '',
        l.userEmail,
        l.userRole,
        l.action,
        l.targetEntity || '',
        l.targetType || '',
        l.result,
        (l.details || '').replace(/,/g, ';'),
        l.ipAddress || '',
      ].join(',')
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="healthai-audit-logs.csv"');
    res.send(header + rows.join('\n'));
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/admin/stats ────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalPosts, activePosts, closedPosts, engineers, healthProfs] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: 'Active' }),
      Post.countDocuments({ status: 'Partner Found' }),
      User.countDocuments({ role: 'Engineer' }),
      User.countDocuments({ role: 'Healthcare Professional' }),
    ]);

    res.json({ totalUsers, totalPosts, activePosts, closedPosts, engineers, healthProfs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
