import mongoose from 'mongoose';

const deliveryPersonSchema = new mongoose.Schema({
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
  
  // Documents
  documents: {
    idCard: {
      number: { type: String },
      image: { type: String },
      verified: { type: Boolean, default: false }
    },
    drivingLicense: {
      number: { type: String },
      image: { type: String },
      verified: { type: Boolean, default: false }
    },
    criminalRecord: {
      image: { type: String },
      verified: { type: Boolean, default: false }
    }
  },
  
  // Véhicule
  vehicle: {
    type: {
      type: String,
      enum: ['bicycle', 'motorcycle', 'car', 'scooter', 'walking'],
      required: true
    },
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    plateNumber: { type: String },
    color: { type: String },
    insurance: {
      company: { type: String },
      policyNumber: { type: String },
      expiryDate: { type: Date },
      verified: { type: Boolean, default: false }
    }
  },
  
  // Localisation actuelle
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }, // [longitude, latitude]
    lastUpdated: { type: Date, default: Date.now },
    accuracy: { type: Number } // en mètres
  },
  
  // Zone de travail
  workingZones: [{
    name: { type: String }, // "Cocody", "Plateau", etc.
    coordinates: [[{ type: Number }]], // Polygon
    isActive: { type: Boolean, default: true }
  }],
  
  // Disponibilité
  availability: {
    isOnline: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
    workingHours: {
      monday: { start: String, end: String, off: { type: Boolean, default: false } },
      tuesday: { start: String, end: String, off: { type: Boolean, default: false } },
      wednesday: { start: String, end: String, off: { type: Boolean, default: false } },
      thursday: { start: String, end: String, off: { type: Boolean, default: false } },
      friday: { start: String, end: String, off: { type: Boolean, default: false } },
      saturday: { start: String, end: String, off: { type: Boolean, default: false } },
      sunday: { start: String, end: String, off: { type: Boolean, default: true } }
    }
  },
  
  // Statistiques de performance
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    cancelledDeliveries: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }, // en minutes
    totalDistance: { type: Number, default: 0 }, // en km
    totalEarnings: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 } // pourcentage
  },
  
  // Évaluations
  reviews: [{
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Commande en cours
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Historique des commandes
  orderHistory: [{
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    completedAt: { type: Date },
    earnings: { type: Number },
    rating: { type: Number }
  }],
  
  // Tarification
  pricing: {
    baseRate: { type: Number, default: 500 }, // FCFA
    perKmRate: { type: Number, default: 100 }, // FCFA par km
    minimumFare: { type: Number, default: 300 }, // FCFA
    maximumDistance: { type: Number, default: 20 } // km
  },
  
  // Status du compte
  accountStatus: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'rejected', 'inactive'],
    default: 'pending'
  },
  
  // Vérifications
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
    backgroundCheckPassed: { type: Boolean, default: false }
  },
  
  // Dernière activité
  lastSeen: { type: Date, default: Date.now },
  lastLocationUpdate: { type: Date }
  
}, {
  timestamps: true
});

// Index géospatial pour les requêtes de proximité
deliveryPersonSchema.index({ currentLocation: '2dsphere' });
deliveryPersonSchema.index({ 'workingZones.coordinates': '2dsphere' });
deliveryPersonSchema.index({ 'availability.isOnline': 1, accountStatus: 1 });
deliveryPersonSchema.index({ phone: 1 });

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);

export default DeliveryPerson;