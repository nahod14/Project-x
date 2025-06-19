import mongoose, { Document, Schema } from 'mongoose';

export interface ITwoFactorAuth extends Document {
  userId: mongoose.Types.ObjectId;
  secret: string;
  isEnabled: boolean;
  backupCodes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const twoFactorAuthSchema = new Schema<ITwoFactorAuth>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  backupCodes: [{
    type: String
  }],
}, {
  timestamps: true
});

export default mongoose.model<ITwoFactorAuth>('TwoFactorAuth', twoFactorAuthSchema); 