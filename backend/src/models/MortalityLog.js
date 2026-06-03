import mongoose from 'mongoose';
const mortalitySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'FishBatch', required: true },
  date: { type: Date, required: true },
  deadCount: { type: Number, required: true, min: 1 },
  suspectedReason: { type: String, required: true },
  actionTaken: String,
  staffName: { type: String, required: true },
  notes: String
}, { timestamps: true });
export default mongoose.model('MortalityLog', mortalitySchema);
