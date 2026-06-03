import mongoose from 'mongoose';
const waterQualitySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond', required: true },
  recordedAt: { type: Date, required: true },
  ph: { type: Number, required: true, min: 0, max: 14 },
  temperature: { type: Number, required: true, min: 0, max: 50 },
  dissolvedOxygen: { type: Number, required: true, min: 0 },
  ammonia: { type: Number, default: 0, min: 0 },
  turbidity: { type: Number, default: 0, min: 0 },
  salinity: { type: Number, default: 0, min: 0 },
  score: { type: Number, default: 100 },
  status: { type: String, enum: ['Safe','Warning','Critical'], default: 'Safe' },
  notes: String
}, { timestamps: true });
export default mongoose.model('WaterQualityLog', waterQualitySchema);
