import mongoose from 'mongoose';

const problemStatementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem statement title is required'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General Techno-Spiritual Innovation',
      trim: true,
    },
    background: {
      type: String,
      required: [true, 'Background context is required'],
    },
    challenge: {
      type: String,
      required: [true, 'Challenge statement is required'],
    },
    keyRequirements: {
      type: [String],
      default: [],
    },
    totalSeats: {
      type: Number,
      default: 5,
      min: 0,
    },
    seatsAvailable: {
      type: Number,
      default: 5,
      min: 0,
    },
    registration_enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const ProblemStatement = mongoose.model('ProblemStatement', problemStatementSchema);
