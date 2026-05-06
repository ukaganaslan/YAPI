const mongoose = require('mongoose');

const meetingRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromName: String,
    fromEmail: String,
    fromRole: String,
    message: { type: String, maxlength: 1000 },
    ndaAccepted: { type: Boolean, default: false },
    proposedSlots: [String], // ISO date strings
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Cancelled'],
      default: 'Pending',
    },
    confirmedSlot: String,
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      enum: [
        'Cardiology',
        'Radiology',
        'Neurology',
        'General Surgery',
        'Software Development',
        'Genomics',
        'Oncology',
        'Orthopedics',
        'Ophthalmology',
        'Psychiatry',
        'Other',
      ],
    },
    expertiseRequired: {
      type: String,
      required: [true, 'Required expertise is required'],
      maxlength: [300, 'Expertise field cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    stage: {
      type: String,
      enum: ['Idea', 'Concept Validation', 'Prototype', 'Pilot Testing', 'Pre-Deployment', 'MVP'],
      required: [true, 'Stage is required'],
    },
    commitmentLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Full-Time'],
    },
    collaborationType: {
      type: String,
      enum: ['Advisor', 'Co-Founder', 'Research Partner', 'Contractor'],
    },
    confidentiality: {
      type: String,
      enum: ['Public', 'Details in Meeting'],
      default: 'Public',
    },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Meeting Scheduled', 'Partner Found', 'Expired'],
      default: 'Active',
    },
    expiresAt: Date,
    autoClose: { type: Boolean, default: false },

    // Author info
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorEmail: { type: String, required: true },
    authorRole: { type: String, required: true },
    authorName: String,

    // Meeting requests embedded
    meetingRequests: [meetingRequestSchema],
  },
  {
    timestamps: true,
  }
);

// Auto-expire posts
postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Post', postSchema);
