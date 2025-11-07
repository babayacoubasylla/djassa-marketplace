import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'FCFA' },
  category: { type: String, required: true },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  
  // Vendeur
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  // Localisation
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String }
  },
  
  // Métadonnées
  tags: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  
  // Scraping
  scrapedFrom: { type: String },
  lastScrapedAt: { type: Date },
  
  // Disponibilité
  availableHours: {
    start: { type: String }, // "08:00"
    end: { type: String }    // "18:00"
  },
  availableDays: [{ type: String }], // ["lundi", "mardi", ...]
  
}, {
  timestamps: true
});

// Index géospatial pour les requêtes de proximité
productSchema.index({ location: '2dsphere' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ vendor: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;