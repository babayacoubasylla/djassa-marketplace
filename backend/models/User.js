import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Informations personnelles
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profil
  profileImage: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Type d'utilisateur
  userType: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  
  // Adresses
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: { type: String }, // "Maison", "Bureau", etc.
    street: { type: String, required: true },
    commune: { type: String, required: true },
    quartier: { type: String },
    city: { type: String, default: 'Abidjan' },
    country: { type: String, default: 'Côte d\'Ivoire' },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] } // [longitude, latitude]
    },
    instructions: { type: String }, // Instructions de livraison
    isDefault: { type: Boolean, default: false }
  }],
  
  // Préférences
  preferences: {
    language: { type: String, default: 'fr' },
    currency: { type: String, default: 'FCFA' },
    notifications: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      newProducts: { type: Boolean, default: false },
      deliveryReminders: { type: Boolean, default: true }
    }
  },
  
  // Historique des commandes
  orderHistory: [{
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    completedAt: { type: Date },
    totalAmount: { type: Number },
    rating: { type: Number }
  }],
  
  // Panier actuel
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Favoris
  favorites: {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }]
  },
  
  // Comparaisons sauvegardées
  comparisons: [{
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Évaluations données
  reviews: [{
    target: { type: String, enum: ['product', 'vendor', 'delivery'] },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Méthodes de paiement
  paymentMethods: [{
    type: {
      type: String,
      enum: ['orange_money', 'mtn_money', 'moov_money', 'card', 'cash'],
      required: true
    },
    name: { type: String }, // "Mon Orange Money", etc.
    phoneNumber: { type: String }, // Pour mobile money
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }],
  
  // Points de fidélité
  loyaltyPoints: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    history: [{
      type: { type: String, enum: ['earned', 'spent', 'expired'] },
      amount: { type: Number },
      description: { type: String },
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      date: { type: Date, default: Date.now }
    }]
  },
  
  // Recherches récentes
  recentSearches: [{
    query: { type: String },
    category: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Status du compte
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'inactive', 'banned'],
    default: 'active'
  },
  
  // Vérifications
  verification: {
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    verificationCode: { type: String },
    codeExpiry: { type: Date }
  },
  
  // Dernière activité
  lastSeen: { type: Date, default: Date.now },
  lastOrderDate: { type: Date }
  
}, {
  timestamps: true
});

// Index pour les recherches et requêtes
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'addresses.coordinates': '2dsphere' });
userSchema.index({ userType: 1, accountStatus: 1 });

const User = mongoose.model('User', userSchema);

export default User;