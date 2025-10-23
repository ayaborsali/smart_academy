import mongoose from 'mongoose';

const iotOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: String,
    address: String
  },
  packType: {
    type: String,
    enum: ['iot-complete', 'iot-basic', 'iot-premium'],
    default: 'iot-complete'
  },
  items: [{
    name: String,
    description: String,
    quantity: { type: Number, default: 1 },
    price: Number,
    features: [String]
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TND'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'bank_transfer', 'on_site', 'cash'],
    default: 'on_site'
  },
  specialOffer: {
    isActive: { type: Boolean, default: true },
    discount: { type: Number, default: 50 },
    originalPrice: { type: Number, default: 300 },
    finalPrice: { type: Number, default: 150 }
  }
}, {
  timestamps: true
});

// Générer un numéro de commande avant sauvegarde
iotOrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `IOT-${timestamp}-${random}`;
    
    // Définir les items du pack IoT
    this.items = [{
      name: 'Pack IoT Complet RIOT-SYS',
      description: 'Kit complet IoT avec modules IA, automates, connectivité et support',
      quantity: 1,
      price: this.specialOffer.finalPrice,
      features: [
        'Kit matériel IoT complet',
        'Modules d\'Intelligence Artificielle',
        'Automates programmables (PLC)',
        'Connectivité cloud et réseaux',
        'Documentation complète',
        'Support technique 6 mois',
        'Projets pratiques',
        'Certification RIOT-SYS'
      ]
    }];
    
    this.totalAmount = this.specialOffer.finalPrice;
    this.originalPrice = this.specialOffer.originalPrice;
  }
  next();
});

export default mongoose.model('IoTOrder', iotOrderSchema);