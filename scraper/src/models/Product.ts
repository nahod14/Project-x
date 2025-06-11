import mongoose, { Document, Schema } from 'mongoose';

export interface IPriceHistory {
  price: number;
  date: Date;
}

export interface IProduct extends Document {
  url: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  priceHistory: IPriceHistory[];
  targetPrice: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const priceHistorySchema = new Schema<IPriceHistory>({
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new Schema<IProduct>(
  {
    url: {
      type: String,
      required: [true, 'Product URL is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
    },
    priceHistory: [priceHistorySchema],
    targetPrice: {
      type: Number,
      required: [true, 'Target price is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
productSchema.index({ userId: 1, url: 1 }, { unique: true });

export const Product = mongoose.model<IProduct>('Product', productSchema); 