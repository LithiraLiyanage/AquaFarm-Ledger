import mongoose from 'mongoose';
const pondSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  location: { type: String, default: 'Main Farm' },
  pondType: { type: String, enum: ['Earthen','Concrete','Tank','Cage','Raceway'], default: 'Earthen' },
  waterType: { type: String, enum: ['Freshwater','Brackish','Marine'], default: 'Freshwater' },
  area: { type: Number, required: true, min: 1 },
  depth: { type: Number, required: true, min: 0.1 },
  capacity: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Active','Maintenance','Empty','Harvested'], default: 'Active' },
  notes: String
}, { timestamps: true });
pondSchema.index({ owner: 1, code: 1 }, { unique: true });
export default mongoose.model('Pond', pondSchema);
