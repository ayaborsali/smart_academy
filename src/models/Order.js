import mongoose  from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    phone: String
  },
  items: [{
    formation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Formation',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'bank_transfer', 'on_site']
  },
  stripePaymentIntentId: String,
  billingAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  }
}, {
  timestamps: true
});

// Générer un numéro de commande avant sauvegarde
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `CMD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);