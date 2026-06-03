import mongoose from 'mongoose';
const feedLogSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'FishBatch', required: true },
  feedType: { type: String, required: true },
  feedBrand: String,
  quantityKg: { type: Number, required: true, min: 0.01 },
  costPerKg: { type: Number, default: 0, min: 0 },
  feedingTime: { type: String, required: true },
  feedingDate: { type: Date, required: true },
  staffName: { type: String, required: true },
  scheduled: { type: Boolean, default: false },
  completed: { type: Boolean, default: true },
  notes: String
}, { timestamps: true });
export default mongoose.model('FeedLog', feedLogSchema);
