import mongoose from 'mongoose';

const contactQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      trim: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);
