// Types globaux pour l'application Djassa
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  country: string;
  coordinates?: Coordinates;
  address?: string;
  district?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'delivery' | 'driver';
  avatar?: string;
  location?: Location;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sellerId: string;
  seller: {
    name: string;
    rating: number;
  };
  location: Location;
  createdAt: string;
  quantity?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

// Types pour les vendeurs et commandes
export interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description?: string;
  location?: Location;
  phone?: string;
  email?: string;
  isVerified?: boolean;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  location?: Coordinates;
  isAvailable?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  vendor: Vendor;
  items: Product[];
  total: number;
  deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'cancelled';
  estimatedTime: string;
  createdAt: string;
  deliveredAt?: string;
  deliveryPerson?: DeliveryPerson;
  customerLocation?: Coordinates;
  specialInstructions?: string;
}

// Types pour le service taxi
export interface TaxiDriver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  carModel: string;
  plateNumber: string;
  location: Coordinates;
  isAvailable?: boolean;
  licenseNumber?: string;
  yearsExperience?: number;
}

export interface TaxiRide {
  id: string;
  status: 'requesting' | 'driver_assigned' | 'driver_arriving' | 'in_progress' | 'completed' | 'cancelled';
  pickup: {
    address: string;
    location: Coordinates;
  };
  destination: {
    address: string;
    location: Coordinates;
  };
  driver?: TaxiDriver;
  passengers: number;
  fare: number;
  distance: string;
  estimatedTime: string;
  requestedAt: string;
  completedAt?: string;
  isNightRide: boolean;
  rideType?: 'standard' | 'premium' | 'shared';
  paymentMethod?: 'cash' | 'mobile_money' | 'card';
  specialRequests?: string[];
}

// Types pour les services d'hébergement
export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: Location;
  images: string[];
  rating: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  amenities: string[];
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  rooms: Room[];
  verified: boolean;
}

export interface Room {
  id: string;
  type: string;
  description: string;
  price: number;
  currency: string;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

// Types pour les services de santé
export interface HealthService {
  id: string;
  name: string;
  type: 'pharmacy' | 'clinic' | 'hospital' | 'medical_center';
  location: Location;
  contact: {
    phone: string;
    emergency?: string;
    email?: string;
  };
  openingHours: OpeningHours[];
  services: string[];
  specialties?: string[];
  doctors?: Doctor[];
  rating: number;
  verified: boolean;
  insurance: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  education: string;
}

export interface OpeningHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

// Types pour tous les services
export interface Service {
  id: string;
  name: string;
  category: 'hotel' | 'health' | 'restaurant' | 'transport' | 'shopping' | 'education' | 'government' | 'taxi';
  location: Location;
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  rating: number;
  description: string;
  images: string[];
  verified: boolean;
}

// Types pour les notifications
export interface NotificationPayload {
  title: string;
  body: string;
  type: 'order_new' | 'order_update' | 'delivery_update' | 'taxi_update' | 'general';
  data?: Record<string, any>;
  vibrate?: number[];
  sound?: boolean;
  badge?: number;
}

// Types pour les recherches
export interface SearchFilters {
  category?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  distance?: number;
  amenities?: string[];
  openNow?: boolean;
}

export interface SearchResult {
  hotels: Hotel[];
  healthServices: HealthService[];
  products: Product[];
  services: Service[];
  taxiRides?: TaxiRide[];
  orders?: Order[];
  total: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'delivery' | 'driver';
}

// Types pour la géolocalisation
export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  timestamp: number;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}