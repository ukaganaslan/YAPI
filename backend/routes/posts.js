const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect, optionalAuth } = require('../middleware/auth');
const { log } = require('../middleware/logger');

// ── GET /api/posts ──────────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { domain, stage, status, city, country, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (!status) filter.status = { $in: ['Active', 'Meeting Scheduled'] };
    else if (status !== 'All') filter.status = status;

    if (domain && domain !== 'All') filter.domain = domain;
    if (stage && stage !== 'All Stages') filter.stage = stage;
    if (city) filter.city = new RegExp(city, 'i');
    if (country) filter.country = new RegExp(country, 'i');

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { expertiseRequired: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-meetingRequests');

    res.json({ total, page: Number(page), posts });
  } catch (err) {
    console.error('[GET /posts Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/posts/mine ─────────────────────────────────────────────────────
router.get('/mine', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select('-meetingRequests');

    res.json({ total: posts.length, posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/posts/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ post });
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Post not found.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/posts ─────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const {
      title, domain, expertiseRequired, description, stage,
      commitmentLevel, collaborationType, confidentiality,
      country, city, expiresAt, autoClose, status,
    } = req.body;

    const post = await Post.create({
      title, domain, expertiseRequired, description, stage,
      commitmentLevel, collaborationType, confidentiality,
      country, city, expiresAt, autoClose,
      author: req.user._id,
      authorEmail: req.user.email,
      authorRole: req.user.role,
      authorName: req.user.name,
      status: status === 'Draft' ? 'Draft' : 'Active',
    });

    await log({ action: 'POST_CREATE', req, targetEntity: post._id, targetType: 'Post' });

    res.status(201).json({ message: 'Post created successfully.', post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('[POST /posts Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PUT /api/posts/:id ──────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to edit this post.' });
    }

    const allowedFields = [
      'title', 'domain', 'expertiseRequired', 'description', 'stage',
      'commitmentLevel', 'collaborationType', 'confidentiality',
      'country', 'city', 'status', 'expiresAt', 'autoClose',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    await post.save();
    await log({ action: 'POST_UPDATE', req, targetEntity: post._id, targetType: 'Post' });

    res.json({ message: 'Post updated.', post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PATCH /api/posts/:id/close ──────────────────────────────────────────────
router.patch('/:id/close', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only the post owner can close this post.' });
    }

    post.status = 'Partner Found';
    await post.save();
    await log({ action: 'POST_CLOSE', req, targetEntity: post._id, targetType: 'Post' });

    res.json({ message: 'Post closed. Status set to Partner Found.', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/posts/:id ───────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await post.deleteOne();
    await log({ action: 'POST_DELETE', req, targetEntity: req.params.id, targetType: 'Post' });

    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/posts/:id/meeting-request ────────────────────────────────────
router.post('/:id/meeting-request', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.status !== 'Active') {
      return res.status(400).json({ message: 'This post is no longer accepting meeting requests.' });
    }
    if (post.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a meeting request to your own post.' });
    }

    const alreadySent = post.meetingRequests.some(
      (r) => r.fromUser.toString() === req.user._id.toString() && r.status === 'Pending'
    );
    if (alreadySent) {
      return res.status(400).json({ message: 'You already have a pending meeting request for this post.' });
    }

    const { message, ndaAccepted, proposedSlots } = req.body;

    if (!ndaAccepted) {
      return res.status(400).json({ message: 'You must accept the NDA before sending a meeting request.' });
    }

    post.meetingRequests.push({
      fromUser: req.user._id,
      fromName: req.user.name,
      fromEmail: req.user.email,
      fromRole: req.user.role,
      message,
      ndaAccepted,
      proposedSlots: proposedSlots || [],
    });

    await post.save();
    await log({ action: 'MEETING_REQUEST_SENT', req, targetEntity: post._id, targetType: 'Post' });

    res.status(201).json({ message: 'Meeting request sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── PATCH /api/posts/:id/meeting-request/:requestId ────────────────────────
router.patch('/:id/meeting-request/:requestId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: 'Only the post owner can respond to meeting requests.' });
    }

    const request = post.meetingRequests.id(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Meeting request not found.' });

    const { status, confirmedSlot } = req.body;
    if (!['Accepted', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Accepted or Declined.' });
    }

    request.status = status;
    if (status === 'Accepted') {
      request.confirmedSlot = confirmedSlot;
      post.status = 'Meeting Scheduled';
    }

    await post.save();

    const action = status === 'Accepted' ? 'MEETING_REQUEST_ACCEPTED' : 'MEETING_REQUEST_DECLINED';
    await log({ action, req, targetEntity: post._id, targetType: 'Post' });

    res.json({ message: `Meeting request ${status.toLowerCase()}.`, post });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
