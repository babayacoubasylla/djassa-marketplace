import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    default: () => 'CMD' + Date.now() + Math.floor(Math.random() * 1000)
  },
  
  // Parties prenantes
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPerson'
  },
  
  // Articles commandés
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    specialInstructions: { type: String }
  }],
  
  // Montants
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Statut de la commande
  status: {
    type: String,
    enum: [
      'pending',        // En attente
      'confirmed',      // Confirmée par le vendeur
      'preparing',      // En préparation
      'ready',          // Prête
      'pickup_assigned', // Livreur assigné
      'picked_up',      // Récupérée
      'in_transit',     // En cours de livraison
      'delivered',      // Livrée
      'cancelled',      // Annulée
      'refunded'        // Remboursée
    ],
    default: 'pending'
  },
  
  // Historique des statuts
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: String } // 'customer', 'vendor', 'delivery', 'system'
  }],
  
  // Type de service
  serviceType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  
  // Adresses
  deliveryAddress: {
    street: { type: String },
    district: { type: String },
    city: { type: String, default: 'Abidjan' },
    coordinates: { type: [Number] }, // [longitude, latitude]
    instructions: { type: String },
    contactPerson: { type: String },
    contactPhone: { type: String }
  },
  
  pickupAddress: {
    street: { type: String },
    district: { type: String },
    city: { type: String },
    coordinates: { type: [Number] }
  },
  
  // Horaires
  requestedDeliveryTime: { type: Date },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  
  // Paiement
  payment: {
    method: {
      type: String,
      enum: ['cash', 'orange_money', 'mtn_money', 'moov_money', 'card', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: { type: String },
    paidAt: { type: Date },
    amount: { type: Number }
  },
  
  // Communication
  notes: { type: String },
  customerNotes: { type: String },
  vendorNotes: { type: String },
  deliveryNotes: { type: String },
  
  // Évaluation
  customerRating: {
    vendor: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    ratedAt: { type: Date }
  },
  
  // Tracking
  tracking: {
    estimatedDistance: { type: Number }, // en km
    actualDistance: { type: Number },
    route: [{ // Points GPS du trajet
      coordinates: { type: [Number] },
      timestamp: { type: Date }
    }]
  }
  
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ deliveryPerson: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;