import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema(
  {
    registrationEnabled: {
      type: Boolean,
      default: true,
    },
    registrationStartDate: {
      type: Date,
      default: () => new Date('2026-01-01T00:00:00.000Z'),
    },
    registrationEndDate: {
      type: Date,
      default: () => new Date('2026-12-31T23:59:59.000Z'),
    },
    holdDurationSeconds: {
      type: Number,
      default: 900, // 15 minutes
    },
  },
  { timestamps: true }
);

globalSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      registrationEnabled: true,
      registrationStartDate: new Date('2026-01-01T00:00:00.000Z'),
      registrationEndDate: new Date('2026-12-31T23:59:59.000Z'),
      holdDurationSeconds: 900,
    });
  }
  return settings;
};

export const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);
