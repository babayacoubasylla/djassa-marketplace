import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['pharmacy', 'supermarket', 'traditional_market', 'restaurant', 'individual'],
    required: true 
  },
  
  // Authentification
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  
  // Profil
  description: { type: String },
  specialty: { type: String },
  profileImage: { type: String },
  coverImage: { type: String },
  
  // Localisation
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String }
  },
  
  // Horaires
  schedule: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
  },
  
  // Évaluations
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Services
  services: {
    delivery: { type: Boolean, default: false },
    takeaway: { type: Boolean, default: true },
    onlinePayment: { type: Boolean, default: false },
    cashPayment: { type: Boolean, default: true },
    mobileMoney: { type: Boolean, default: false }
  },
  
  // Livraison
  deliveryZones: [{
    name: { type: String },
    coordinates: [[{ type: Number }]], // Polygon
    deliveryFee: { type: Number },
    minOrder: { type: Number },
    estimatedTime: { type: String } // "30-45 min"
  }],
  
  // Statistiques
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    repeatCustomers: { type: Number, default: 0 }
  },
  
  // Scraping
  scrapedFrom: { type: String },
  lastScrapedAt: { type: Date },
  
  // Statut
  isActive: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
  
}, {
  timestamps: true
});

// Index géospatial
vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ type: 1, isActive: 1 });
vendorSchema.index({ 'deliveryZones.coordinates': '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;