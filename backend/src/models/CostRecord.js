import mongoose from 'mongoose';
const costSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond' },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'FishBatch' },
  category: { type: String, enum: ['Feed','Fingerlings','Medicine','Labor','Equipment','Maintenance','Other'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, required: true },
  description: String
}, { timestamps: true });
export default mongoose.model('CostRecord', costSchema);
