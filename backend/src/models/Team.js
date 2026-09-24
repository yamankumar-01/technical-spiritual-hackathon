import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Member name is required'], trim: true },
    phone: { type: String, required: [true, 'Member phone is required'], trim: true },
    email: { type: String, required: [true, 'Member email is required'], lowercase: true, trim: true },
    branch: { type: String, required: [true, 'Member branch is required'], trim: true },
    year: { type: String, required: [true, 'Member year is required'], trim: true },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    teamCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemStatement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProblemStatement',
      required: true,
    },
    leader: {
      name: { type: String, required: [true, 'Leader name is required'], trim: true },
      phone: { type: String, required: [true, 'Leader phone is required'], trim: true },
      email: { type: String, required: [true, 'Leader email is required'], lowercase: true, trim: true },
      branch: { type: String, required: [true, 'Leader branch is required'], trim: true },
      year: { type: String, required: [true, 'Leader academic year is required'], trim: true },
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length === 3;
        },
        message: 'Team must have exactly 3 members in addition to the team leader (Total 4 members).',
      },
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    holdToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['registered', 'payment_pending', 'confirmed', 'rejected', 'ps_not_declared', 'finalized'],
      default: 'payment_pending',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    approved_at: {
      type: Date,
      default: null,
    },
    rejected_at: {
      type: Date,
      default: null,
    },
    seatDecremented: {
      type: Boolean,
      default: false,
    },
    payment: {
      method: {
        type: String,
        enum: ['manual', 'upi', 'src_desk', null],
        default: 'src_desk',
      },
      amount: {
        type: Number,
        default: 400, // INR 400 per team
      },
      manualTxnId: { type: String, default: null },
      manualProofUrl: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },
    venue: {
      roomNumber: {
        type: String,
        trim: true,
        default: null,
      },
      timeSlot: {
        type: String,
        trim: true,
        default: null,
      },
      allocatedAt: {
        type: Date,
        default: null,
      },
    },
    participantEmails: {
      type: [String],
      required: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-set venue.allocatedAt when roomNumber or timeSlot is updated
teamSchema.pre('save', function (next) {
  if (this.isModified('venue.roomNumber') || this.isModified('venue.timeSlot')) {
    if (this.venue?.roomNumber || this.venue?.timeSlot) {
      this.venue.allocatedAt = new Date();
    }
  }
  next();
});

// Unique multikey index enforcing nationwide 1-email = 1-team/PS constraint at the database storage engine level
teamSchema.index({ participantEmails: 1 }, { unique: true });

// Auto-generate readable teamCode and collect all 4 participant emails prior to validation
teamSchema.pre('validate', function (next) {
  if (!this.teamCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.teamCode = `TSH-${randomSuffix}`;
  }
  if (this.leader?.email && Array.isArray(this.members)) {
    this.participantEmails = [
      this.leader.email.trim().toLowerCase(),
      ...this.members.map((m) => m.email?.trim().toLowerCase()),
    ].filter(Boolean);
  }
  next();
});

export const Team = mongoose.model('Team', teamSchema);
