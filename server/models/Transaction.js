import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be at least 0.01'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: { type: String, trim: true, default: '' },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for efficient per-user filtering by date and type
transactionSchema.index({ user: 1, date: -1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
