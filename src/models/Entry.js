import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  ackId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true, min: 0 },
  mobile: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  address: { type: String, required: true, trim: true },
  referralCode : {type: String},
  amount: { type: Number, required: true, enum: [10, 30, 50] },
  transactionId: { type: String, required: true, trim: true },
  paid: { type: Boolean, default: true }, // placeholder for future payment recon
}, { timestamps: true });

entrySchema.index({ ackId: 1 }, { unique: true });

export const Entry = mongoose.model('Entry', entrySchema);