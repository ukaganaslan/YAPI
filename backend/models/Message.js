const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String },
    senderEmail: { type: String },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for fast conversation queries
messageSchema.index({ postId: 1, sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, readAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
