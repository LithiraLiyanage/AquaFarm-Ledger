import mongoose from 'mongoose';
const harvestSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'FishBatch', required: true },
  expectedHarvestDate: { type: Date, required: true },
  estimatedAverageWeight: { type: Number, required: true, min: 0.01 },
  estimatedBiomass: { type: Number, default: 0 },
  sellingPricePerKg: { type: Number, required: true, min: 0.01 },
  estimatedRevenue: { type: Number, default: 0 },
  estimatedProfit: { type: Number, default: 0 },
  status: { type: String, enum: ['Planned','Ready','Harvested','Cancelled'], default: 'Planned' }
}, { timestamps: true });
export default mongoose.model('HarvestPlan', harvestSchema);
