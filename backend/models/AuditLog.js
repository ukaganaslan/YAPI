const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: { type: String, default: 'anonymous' },
    userRole: { type: String, default: 'unknown' },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'REGISTER',
        'POST_CREATE',
        'POST_UPDATE',
        'POST_DELETE',
        'POST_CLOSE',
        'MEETING_REQUEST_SENT',
        'MEETING_REQUEST_ACCEPTED',
        'MEETING_REQUEST_DECLINED',
        'MEETING_REQUEST_CANCELLED',
        'ADMIN_SUSPEND_USER',
        'ADMIN_DELETE_POST',
        'ADMIN_VIEW_LOGS',
        'PROFILE_UPDATE',
        'ACCOUNT_DELETE',
        'DATA_EXPORT',
        'SECURITY_EVENT',
      ],
    },
    targetEntity: String,   // e.g. post ID or user ID
    targetType: String,     // 'Post' | 'User' | 'MeetingRequest'
    result: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      default: 'SUCCESS',
    },
    details: String,        // extra context
    ipAddress: String,      // optional, GDPR compliant (stored anonymized)
  },
  {
    timestamps: true,       // createdAt used as timestamp
  }
);

// Retention: auto-delete logs older than 24 months (720 days)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 62208000 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
