import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema({
  title: {
    fr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    fr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['ai', 'iot', 'automates'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé'],
    required: true
  },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'EUR' }
  },
  features: [{
    fr: String,
    en: String,
    ar: String
  }],
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Formation', formationSchema);