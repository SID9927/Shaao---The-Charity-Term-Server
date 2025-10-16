import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
}, { timestamps: true });

counterSchema.statics.getNext = async function(name) {
  const doc = await this.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
};

counterSchema.statics.peekNext = async function(name) {
  const doc = await this.findOne({ name });
  if (!doc) return 1; // if not exists, next will be 1
  return doc.seq + 1;
};

export const Counter = mongoose.model('Counter', counterSchema);