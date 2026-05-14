const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

/**
 * Helper: Check if two users can chat on a given post.
 * They can chat if:
 *   - One of them is the post author AND the other has an "Accepted" meeting request on that post.
 */
async function canChat(postId, userId1, userId2) {
  const post = await Post.findById(postId);
  if (!post) return { allowed: false, reason: 'Post not found.' };

  const authorId = post.author.toString();
  const u1 = userId1.toString();
  const u2 = userId2.toString();

  // One must be the author
  if (authorId !== u1 && authorId !== u2) {
    return { allowed: false, reason: 'Only the post author and accepted partners can chat.' };
  }

  const partnerId = authorId === u1 ? u2 : u1;

  // Check if the partner has an accepted meeting request
  const hasAccepted = post.meetingRequests.some(
    (r) => r.fromUser.toString() === partnerId && r.status === 'Accepted'
  );

  if (!hasAccepted) {
    return { allowed: false, reason: 'Chat is only available after a meeting request is accepted.' };
  }

  return { allowed: true, post };
}

// ── GET /api/messages/conversations ────────────────────────────────────────
// Returns a list of conversations the current user is involved in.
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all posts where user is author with accepted requests, or user has an accepted request
    const postsAsAuthor = await Post.find({
      author: userId,
      'meetingRequests.status': 'Accepted',
    }).select('title meetingRequests author authorName');

    const postsAsPartner = await Post.find({
      'meetingRequests.fromUser': userId,
      'meetingRequests.status': 'Accepted',
    }).select('title meetingRequests author authorName');

    const conversations = [];

    // As author: each accepted requester is a conversation
    for (const post of postsAsAuthor) {
      const acceptedRequests = post.meetingRequests.filter((r) => r.status === 'Accepted');
      for (const req of acceptedRequests) {
        // Get last message
        const lastMessage = await Message.findOne({
          postId: post._id,
          $or: [
            { sender: userId, receiver: req.fromUser },
            { sender: req.fromUser, receiver: userId },
          ],
        }).sort({ createdAt: -1 });

        // Count unread
        const unreadCount = await Message.countDocuments({
          postId: post._id,
          sender: req.fromUser,
          receiver: userId,
          readAt: null,
        });

        conversations.push({
          postId: post._id,
          postTitle: post.title,
          partnerId: req.fromUser,
          partnerName: req.fromName || req.fromEmail,
          partnerEmail: req.fromEmail,
          partnerRole: req.fromRole,
          lastMessage: lastMessage
            ? { content: lastMessage.content, createdAt: lastMessage.createdAt, fromMe: lastMessage.sender.toString() === userId.toString() }
            : null,
          unreadCount,
        });
      }
    }

    // As partner: author is the conversation partner
    for (const post of postsAsPartner) {
      const myAccepted = post.meetingRequests.filter(
        (r) => r.fromUser.toString() === userId.toString() && r.status === 'Accepted'
      );
      if (myAccepted.length > 0) {
        const lastMessage = await Message.findOne({
          postId: post._id,
          $or: [
            { sender: userId, receiver: post.author },
            { sender: post.author, receiver: userId },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          postId: post._id,
          sender: post.author,
          receiver: userId,
          readAt: null,
        });

        conversations.push({
          postId: post._id,
          postTitle: post.title,
          partnerId: post.author,
          partnerName: post.authorName || 'Project Author',
          partnerEmail: null,
          partnerRole: null,
          lastMessage: lastMessage
            ? { content: lastMessage.content, createdAt: lastMessage.createdAt, fromMe: lastMessage.sender.toString() === userId.toString() }
            : null,
          unreadCount,
        });
      }
    }

    // Deduplicate (same postId+partnerId)
    const seen = new Set();
    const unique = conversations.filter((c) => {
      const key = `${c.postId}-${c.partnerId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by last message date, most recent first
    unique.sort((a, b) => {
      const aDate = a.lastMessage?.createdAt || 0;
      const bDate = b.lastMessage?.createdAt || 0;
      return new Date(bDate) - new Date(aDate);
    });

    res.json({ conversations: unique });
  } catch (err) {
    console.error('[GET /messages/conversations Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/messages/unread-count ─────────────────────────────────────────
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      readAt: null,
    });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET /api/messages/:postId/:partnerId ───────────────────────────────────
// Returns the chat history between current user and partner on a specific post.
router.get('/:postId/:partnerId', protect, async (req, res) => {
  try {
    const { postId, partnerId } = req.params;
    const userId = req.user._id;

    const { allowed, reason } = await canChat(postId, userId, partnerId);
    if (!allowed) return res.status(403).json({ message: reason });

    const messages = await Message.find({
      postId,
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { postId, sender: partnerId, receiver: userId, readAt: null },
      { $set: { readAt: new Date() } }
    );

    res.json({ messages });
  } catch (err) {
    console.error('[GET /messages Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── POST /api/messages/:postId/:partnerId ──────────────────────────────────
// Send a message to partner on a specific post.
router.post('/:postId/:partnerId', protect, async (req, res) => {
  try {
    const { postId, partnerId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const { allowed, reason } = await canChat(postId, userId, partnerId);
    if (!allowed) return res.status(403).json({ message: reason });

    const message = await Message.create({
      postId,
      sender: userId,
      senderName: req.user.name,
      senderEmail: req.user.email,
      receiver: partnerId,
      content: content.trim(),
    });

    res.status(201).json({ message: 'Message sent.', data: message });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    console.error('[POST /messages Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE /api/messages/:postId/:partnerId ────────────────────────────────
// Deletes all messages in a conversation for both parties.
router.delete('/:postId/:partnerId', protect, async (req, res) => {
  try {
    const { postId, partnerId } = req.params;
    const userId = req.user._id;

    const { allowed, reason } = await canChat(postId, userId, partnerId);
    if (!allowed) return res.status(403).json({ message: reason });

    await Message.deleteMany({
      postId,
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    });

    res.json({ message: 'Conversation deleted.' });
  } catch (err) {
    console.error('[DELETE /messages Error]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
