import mongoose from 'mongoose';

const brochureRequestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    unique: true,
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  brochureType: {
    type: String,
    enum: ['digital', 'physical'],
    default: 'digital'
  },
  status: {
    type: String,
    enum: ['new', 'sent', 'downloaded'],
    default: 'new'
  },
  downloadCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

brochureRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.requestNumber = `BRO-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('BrochureRequest', brochureRequestSchema);