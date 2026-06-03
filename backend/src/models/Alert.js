import mongoose from 'mongoose';
const alertSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
  pond: { type: mongoose.Schema.Types.ObjectId, ref: 'Pond' },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'FishBatch' },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread','Read','Resolved'], default: 'Unread' }
}, { timestamps: true });
export default mongoose.model('Alert', alertSchema);
