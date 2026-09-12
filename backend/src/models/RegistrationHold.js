import mongoose from 'mongoose';

const registrationHoldSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProblemStatement',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    holdToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      default: 900, // 15 minutes in seconds
    },
    status: {
      type: String,
      enum: ['active', 'consumed', 'expired', 'released'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to quickly find active holds for a specific user and problem
registrationHoldSchema.index({ problemId: 1, userId: 1, status: 1 });
registrationHoldSchema.index({ problemId: 1, status: 1, expiresAt: 1 });

// Helper to verify if hold is currently active
registrationHoldSchema.methods.isCurrentlyActive = function () {
  return this.status === 'active' && new Date(this.expiresAt) > new Date();
};

export const RegistrationHold = mongoose.model('RegistrationHold', registrationHoldSchema);
