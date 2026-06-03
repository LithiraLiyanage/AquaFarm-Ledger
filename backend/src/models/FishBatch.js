import mongoose from 'mongoose';
const fishBatchSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond', required: true },
  batchName: { type: String, required: true },
  species: { type: String, required: true },
  initialStock: { type: Number, required: true, min: 1 },
  currentStock: { type: Number, required: true, min: 0 },
  averageWeight: { type: Number, default: 0.05, min: 0 },
  stockingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  supplier: String,
  costPerFingerling: { type: Number, default: 0, min: 0 },
  totalBatchCost: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['Growing','Ready to Harvest','Harvested','Closed'], default: 'Growing' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
fishBatchSchema.virtual('survivalRate').get(function(){ return this.initialStock ? Math.round((this.currentStock / this.initialStock) * 1000) / 10 : 0; });
fishBatchSchema.virtual('biomassKg').get(function(){ return Math.round(this.currentStock * this.averageWeight * 100) / 100; });
export default mongoose.model('FishBatch', fishBatchSchema);
