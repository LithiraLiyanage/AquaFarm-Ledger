import mongoose from 'mongoose';
const farmSettingsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  farmName: { type: String, default: 'AquaFarm Ledger Demo Farm' },
  ownerName: String,
  location: String,
  contactNumber: String,
  email: String,
  currency: { type: String, default: 'LKR' },
  thresholds: {
    mortalityDaily: { type: Number, default: 20 },
    minOxygen: { type: Number, default: 5 },
    maxTemperature: { type: Number, default: 32 },
    minPh: { type: Number, default: 6.5 },
    maxPh: { type: Number, default: 8.5 }
  },
  defaultFeedSchedule: { type: String, default: '08:00,17:00' },
  theme: { type: String, enum: ['light','dark'], default: 'light' }
}, { timestamps: true });
export default mongoose.model('FarmSettings', farmSettingsSchema);
