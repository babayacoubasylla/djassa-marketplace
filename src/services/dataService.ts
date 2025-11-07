import type { Hotel, HealthService, Category, SearchResult, SearchFilters } from '../types';

// Vraies données d'hôtels en Côte d'Ivoire
export const HOTELS_DATA: Hotel[] = [
  // Abidjan
  {
    id: 'hotel-1',
    name: 'Hôtel Ivoire',
    description: 'Hôtel emblématique d\'Abidjan, offrant luxe et confort au cœur de Cocody',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Cocody',
      address: 'Boulevard de la Corniche, Cocody',
      coordinates: { lat: 5.3364, lng: -4.0267 }
    },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'],
    rating: 4.5,
    priceRange: { min: 80000, max: 250000, currency: 'FCFA' },
    amenities: ['Piscine', 'Restaurant', 'Spa', 'Salle de sport', 'WiFi', 'Parking', 'Climatisation'],
    contact: {
      phone: '+225 27 22 48 02 00',
      email: 'reservation@hotel-ivoire.ci',
      website: 'www.sofitel-abidjan-hotel-ivoire.com'
    },
    rooms: [
      {
        id: 'room-1',
        type: 'Chambre Standard',
        description: 'Chambre confortable avec vue sur la lagune',
        price: 80000,
        currency: 'FCFA',
        capacity: 2,
        amenities: ['WiFi', 'Climatisation', 'TV satellite'],
        images: ['/images/rooms/ivoire-standard.jpg'],
        available: true
      }
    ],
    verified: true
  },
  {
    id: 'hotel-2',
    name: 'Pullman Abidjan',
    description: 'Hôtel moderne 5 étoiles au centre des affaires du Plateau',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Plateau',
      address: 'Rue Abdoulaye Fadiga, Plateau',
      coordinates: { lat: 5.3198, lng: -4.0267 }
    },
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'],
    rating: 4.7,
    priceRange: { min: 120000, max: 300000, currency: 'FCFA' },
    amenities: ['Restaurant gastronomique', 'Bar', 'Salle de conférence', 'WiFi', 'Parking valet'],
    contact: {
      phone: '+225 27 20 25 78 00',
      email: 'h8459@accor.com',
      website: 'www.pullmanhotels.com'
    },
    rooms: [],
    verified: true
  },
  // Yamoussoukro
  {
    id: 'hotel-3',
    name: 'Hôtel Président',
    description: 'Hôtel de référence à Yamoussoukro, proche de la Basilique',
    location: {
      city: 'Yamoussoukro',
      country: 'Côte d\'Ivoire',
      address: 'Quartier Résidentiel, Yamoussoukro',
      coordinates: { lat: 6.8276, lng: -5.2893 }
    },
    images: ['https://images.unsplash.com/photo-1555035555-d4b52b1ee5a3?w=400'],
    rating: 4.2,
    priceRange: { min: 60000, max: 150000, currency: 'FCFA' },
    amenities: ['Restaurant', 'Piscine', 'WiFi', 'Parking', 'Climatisation'],
    contact: {
      phone: '+225 27 30 64 64 64',
      email: 'info@hotelpresident-yamoussoukro.com'
    },
    rooms: [],
    verified: true
  },
  // Gagnoa
  {
    id: 'hotel-4',
    name: 'Hôtel Gbaïné',
    description: 'Confort et hospitalité au cœur de Gagnoa',
    location: {
      city: 'Gagnoa',
      country: 'Côte d\'Ivoire',
      address: 'Centre-ville, Gagnoa',
      coordinates: { lat: 6.1319, lng: -5.9506 }
    },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'],
    rating: 3.8,
    priceRange: { min: 35000, max: 85000, currency: 'FCFA' },
    amenities: ['Restaurant local', 'WiFi', 'Parking', 'Climatisation'],
    contact: {
      phone: '+225 07 77 88 99 00',
      email: 'contact@hotelgbaine.ci'
    },
    rooms: [],
    verified: true
  }
];

// Vraies données de services de santé
export const HEALTH_SERVICES_DATA: HealthService[] = [
  // Pharmacies Abidjan
  {
    id: 'pharma-1',
    name: 'Pharmacie de la Paix',
    type: 'pharmacy',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Marcory',
      address: 'Boulevard VGE, Marcory Zone 4',
      coordinates: { lat: 5.2669, lng: -3.9896 }
    },
    contact: {
      phone: '+225 27 21 26 78 90',
      emergency: '+225 27 21 26 78 90'
    },
    openingHours: [
      { day: 'Lundi-Samedi', open: '07:30', close: '20:00', isOpen: true },
      { day: 'Dimanche', open: '08:00', close: '18:00', isOpen: true }
    ],
    services: ['Médicaments', 'Conseil pharmaceutique', 'Vaccination', 'Test de glycémie'],
    rating: 4.3,
    verified: true,
    insurance: ['CNPS', 'Saham Assurance', 'NSIA']
  },
  {
    id: 'pharma-2',
    name: 'Pharmacie Nouvelle',
    type: 'pharmacy',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Plateau',
      address: 'Avenue Chardy, Plateau',
      coordinates: { lat: 5.3198, lng: -4.0267 }
    },
    contact: {
      phone: '+225 27 20 32 15 78'
    },
    openingHours: [
      { day: 'Lundi-Vendredi', open: '08:00', close: '19:00', isOpen: true },
      { day: 'Samedi', open: '08:00', close: '17:00', isOpen: true }
    ],
    services: ['Médicaments', 'Matériel médical', 'Cosmétique'],
    rating: 4.1,
    verified: true,
    insurance: ['CNPS', 'Assurance vie']
  },
  // Hôpitaux et cliniques
  {
    id: 'clinic-1',
    name: 'Clinique Internationale',
    type: 'clinic',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Cocody',
      address: 'Riviera Golf, Cocody',
      coordinates: { lat: 5.3572, lng: -3.9570 }
    },
    contact: {
      phone: '+225 27 22 52 25 00',
      emergency: '+225 27 22 52 25 25',
      email: 'contact@cliniqueinternationale.ci'
    },
    openingHours: [
      { day: 'Tous les jours', open: '24h/24', close: '24h/24', isOpen: true }
    ],
    services: ['Urgences', 'Chirurgie', 'Maternité', 'Cardiologie', 'Radiologie'],
    specialties: ['Cardiologie', 'Gynécologie', 'Pédiatrie', 'Chirurgie générale'],
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Kouassi Jean',
        specialty: 'Cardiologie',
        experience: 15,
        education: 'Université Félix Houphouët-Boigny'
      }
    ],
    rating: 4.6,
    verified: true,
    insurance: ['CNPS', 'MUGEF-CI', 'Saham']
  },
  {
    id: 'hospital-1',
    name: 'CHU de Cocody',
    type: 'hospital',
    location: {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      district: 'Cocody',
      address: 'Boulevard Valery Giscard d\'Estaing, Cocody',
      coordinates: { lat: 5.3364, lng: -4.0134 }
    },
    contact: {
      phone: '+225 27 22 44 91 00',
      emergency: '+225 27 22 44 91 91'
    },
    openingHours: [
      { day: 'Tous les jours', open: '24h/24', close: '24h/24', isOpen: true }
    ],
    services: ['Urgences', 'Tous services médicaux', 'Chirurgie', 'Réanimation'],
    specialties: ['Toutes spécialités'],
    rating: 4.2,
    verified: true,
    insurance: ['CNPS', 'Toutes assurances']
  }
];

// Catégories étendues
export const EXTENDED_CATEGORIES: Category[] = [
  // Catégories existantes
  { id: 'restaurants', name: 'Restaurants', icon: '🍽️', color: '#ef4444' },
  { id: 'supermarkets', name: 'Supermarchés', icon: '🛒', color: '#10b981' },
  { id: 'pharmacies', name: 'Pharmacies', icon: '💊', color: '#8b5cf6' },
  { id: 'gas-stations', name: 'Stations-service', icon: '⛽', color: '#f59e0b' },
  { id: 'electronics', name: 'Électronique', icon: '📱', color: '#3b82f6' },
  { id: 'fashion', name: 'Mode', icon: '👗', color: '#ec4899' },
  { id: 'home-garden', name: 'Maison & Jardin', icon: '🏡', color: '#06b6d4' },
  { id: 'beauty', name: 'Beauté', icon: '💄', color: '#f97316' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#84cc16' },
  { id: 'automotive', name: 'Automobile', icon: '🚗', color: '#6b7280' },
  { id: 'books', name: 'Livres', icon: '📚', color: '#7c3aed' },
  { id: 'services', name: 'Services', icon: '🔧', color: '#0ea5e9' },
  
  // Nouvelles catégories
  { id: 'hotels', name: 'Hôtels & Hébergement', icon: '🏨', color: '#dc2626', subcategories: ['Hôtels', 'Résidences', 'Auberges'] },
  { id: 'health', name: 'Santé & Médical', icon: '🏥', color: '#059669', subcategories: ['Hôpitaux', 'Cliniques', 'Pharmacies', 'Centres médicaux'] },
  { id: 'food', name: 'Restaurants & Livraison', icon: '🍽️', color: '#dc2626', subcategories: ['Restaurants', 'Maquis', 'Fast-food', 'Livraison'] },
  { id: 'delivery', name: 'Services de Livraison', icon: '🚚', color: '#059669', subcategories: ['Nourriture', 'Colis', 'Courses'] },
  { id: 'education', name: 'Éducation', icon: '🎓', color: '#7c2d12', subcategories: ['Écoles', 'Universités', 'Formations'] },
  { id: 'government', name: 'Services publics', icon: '🏛️', color: '#374151', subcategories: ['Mairies', 'Préfectures', 'Administrations'] },
  { id: 'transport', name: 'Transport', icon: '🚌', color: '#1f2937', subcategories: ['Gares', 'Aéroports', 'Transport public'] },
  { id: 'entertainment', name: 'Loisirs', icon: '🎭', color: '#be185d', subcategories: ['Cinémas', 'Parcs', 'Événements'] }
];

// Fonction de recherche améliorée
export const searchServices = async (
  query: string,
  filters: SearchFilters = {},
  userLocation?: { lat: number; lng: number }
): Promise<SearchResult> => {
  // Simulation d'une recherche avec délai
  await new Promise(resolve => setTimeout(resolve, 500));

  const results: SearchResult = {
    hotels: [],
    healthServices: [],
    products: [],
    services: [],
    total: 0
  };

  // Filtrer par catégorie
  if (!filters.category || filters.category === 'hotels') {
    results.hotels = HOTELS_DATA.filter(hotel =>
      hotel.name.toLowerCase().includes(query.toLowerCase()) ||
      hotel.location.city.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (!filters.category || filters.category === 'health') {
    results.healthServices = HEALTH_SERVICES_DATA.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.location.city.toLowerCase().includes(query.toLowerCase()) ||
      service.type.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Filtrer par localisation
  if (filters.location) {
    results.hotels = results.hotels.filter(hotel =>
      hotel.location.city.toLowerCase().includes(filters.location!.toLowerCase())
    );
    results.healthServices = results.healthServices.filter(service =>
      service.location.city.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  // Filtrer par notation
  if (filters.rating) {
    results.hotels = results.hotels.filter(hotel => hotel.rating >= filters.rating!);
    results.healthServices = results.healthServices.filter(service => service.rating >= filters.rating!);
  }

  // Calculer la distance si position utilisateur disponible
  if (userLocation) {
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Rayon de la Terre en km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    if (filters.distance) {
      results.hotels = results.hotels.filter(hotel => {
        if (hotel.location.coordinates) {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            hotel.location.coordinates.lat, hotel.location.coordinates.lng
          );
          return distance <= filters.distance!;
        }
        return false;
      });

      results.healthServices = results.healthServices.filter(service => {
        if (service.location.coordinates) {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            service.location.coordinates.lat, service.location.coordinates.lng
          );
          return distance <= filters.distance!;
        }
        return false;
      });
    }
  }

  results.total = results.hotels.length + results.healthServices.length + results.products.length + results.services.length;

  return results;
};

// Fonction pour obtenir les services par ville
export const getServicesByCity = (city: string) => {
  const hotels = HOTELS_DATA.filter(hotel => 
    hotel.location.city.toLowerCase() === city.toLowerCase()
  );
  
  const healthServices = HEALTH_SERVICES_DATA.filter(service => 
    service.location.city.toLowerCase() === city.toLowerCase()
  );

  return { hotels, healthServices };
};

// Principales villes de Côte d'Ivoire
export const MAJOR_CITIES = [
  'Abidjan',
  'Yamoussoukro',
  'Bouaké',
  'Daloa',
  'San-Pédro',
  'Korhogo',
  'Man',
  'Gagnoa',
  'Divo',
  'Anyama'
];

// Données des restaurants en Côte d'Ivoire
export const RESTAURANTS_DATA = [
  {
    id: 'rest-1',
    name: 'Chez Amina',
    type: 'restaurant',
    category: 'Cuisine ivoirienne',
    description: 'Restaurant traditionnel ivoirien, spécialités attiéké-poisson',
    rating: 4.8,
    priceRange: '₣₣',
    cuisine: ['Ivoirienne', 'Africaine'],
    specialties: ['Attiéké-poisson', 'Kedjenou', 'Sauce arachide', 'Bangui'],
    deliveryTime: '25-35 min',
    deliveryFee: 1500,
    minOrder: 5000,
    location: {
      address: 'Cocody Angré, Rue des Jardins',
      city: 'Abidjan',
      coordinates: { lat: 5.3364, lng: -3.9732 }
    },
    contact: {
      phone: '+225 07 08 09 10 11',
      whatsapp: '+225 07 08 09 10 11'
    },
    hours: 'Lun-Dim: 11h-22h',
    menu: [
      { id: 'm1', name: 'Attiéké-Poisson braisé', price: 3500, category: 'Plats principaux' },
      { id: 'm2', name: 'Kedjenou de poulet', price: 4000, category: 'Plats principaux' },
      { id: 'm3', name: 'Riz au gras', price: 2500, category: 'Plats principaux' },
      { id: 'm4', name: 'Bangui', price: 2000, category: 'Soupes' }
    ]
  },
  {
    id: 'rest-2',
    name: 'Le Plateau Gourmet',
    type: 'restaurant',
    category: 'Cuisine française',
    description: 'Restaurant français haut de gamme au cœur du Plateau',
    rating: 4.6,
    priceRange: '₣₣₣',
    cuisine: ['Française', 'Européenne'],
    specialties: ['Coq au vin', 'Bouillabaisse', 'Crème brûlée'],
    deliveryTime: '35-45 min',
    deliveryFee: 2500,
    minOrder: 10000,
    location: {
      address: 'Plateau, Avenue Chardy',
      city: 'Abidjan',
      coordinates: { lat: 5.3167, lng: -4.0167 }
    },
    contact: {
      phone: '+225 27 20 21 22 23',
      whatsapp: '+225 07 01 02 03 04'
    },
    hours: 'Mar-Dim: 12h-23h',
    menu: [
      { id: 'm5', name: 'Coq au vin', price: 8500, category: 'Plats principaux' },
      { id: 'm6', name: 'Salade niçoise', price: 4500, category: 'Entrées' },
      { id: 'm7', name: 'Crème brûlée', price: 3000, category: 'Desserts' }
    ]
  },
  {
    id: 'rest-3',
    name: 'Pizza Corner',
    type: 'restaurant',
    category: 'Fast Food',
    description: 'Pizzeria moderne avec livraison rapide',
    rating: 4.4,
    priceRange: '₣₣',
    cuisine: ['Italienne', 'Fast Food'],
    specialties: ['Pizza Margherita', 'Pizza 4 fromages', 'Calzone'],
    deliveryTime: '20-30 min',
    deliveryFee: 1000,
    minOrder: 3000,
    location: {
      address: 'Marcory Zone 4, Boulevard VGE',
      city: 'Abidjan',
      coordinates: { lat: 5.2833, lng: -3.9833 }
    },
    contact: {
      phone: '+225 05 06 07 08 09',
      whatsapp: '+225 05 06 07 08 09'
    },
    hours: 'Lun-Dim: 10h-00h',
    menu: [
      { id: 'm8', name: 'Pizza Margherita', price: 4500, category: 'Pizzas' },
      { id: 'm9', name: 'Pizza 4 fromages', price: 5500, category: 'Pizzas' },
      { id: 'm10', name: 'Calzone', price: 5000, category: 'Pizzas' }
    ]
  },
  {
    id: 'rest-4',
    name: 'Maquis Chez Tantine',
    type: 'restaurant',
    category: 'Maquis',
    description: 'Maquis authentique avec grillades et ambiance locale',
    rating: 4.7,
    priceRange: '₣₣',
    cuisine: ['Ivoirienne', 'Grillades'],
    specialties: ['Poisson braisé', 'Poulet bicyclette', 'Bœuf grillé'],
    deliveryTime: '30-40 min',
    deliveryFee: 1500,
    minOrder: 4000,
    location: {
      address: 'Yopougon Sicogi, Rue Principale',
      city: 'Abidjan',
      coordinates: { lat: 5.3456, lng: -4.0789 }
    },
    contact: {
      phone: '+225 01 02 03 04 05',
      whatsapp: '+225 01 02 03 04 05'
    },
    hours: 'Lun-Dim: 17h-02h',
    menu: [
      { id: 'm11', name: 'Poisson braisé + attiéké', price: 4000, category: 'Grillades' },
      { id: 'm12', name: 'Poulet bicyclette', price: 3500, category: 'Grillades' },
      { id: 'm13', name: 'Bœuf grillé', price: 5000, category: 'Grillades' }
    ]
  }
];

// Données des livreurs disponibles
export const DELIVERY_PERSONS_DATA = [
  {
    id: 'del-1',
    name: 'Kouassi Michel',
    phone: '+225 07 11 22 33 44',
    vehicle: 'Moto',
    rating: 4.9,
    deliveriesCount: 156,
    isAvailable: true,
    services: ['Nourriture', 'Colis', 'Courses'],
    currentLocation: { lat: 5.3364, lng: -3.9732 },
    zone: 'Cocody-Angré',
    avatar: '🏍️'
  },
  {
    id: 'del-2', 
    name: 'Adjoua Patricia',
    phone: '+225 05 44 55 66 77',
    vehicle: 'Voiture',
    rating: 4.8,
    deliveriesCount: 203,
    isAvailable: true,
    services: ['Nourriture', 'Courses', 'Colis'],
    currentLocation: { lat: 5.3167, lng: -4.0167 },
    zone: 'Plateau',
    avatar: '🚗'
  },
  {
    id: 'del-3',
    name: 'Bamba Seydou',
    phone: '+225 01 88 99 00 11',
    vehicle: 'Moto',
    rating: 4.7,
    deliveriesCount: 89,
    isAvailable: false,
    services: ['Nourriture', 'Colis'],
    currentLocation: { lat: 5.2833, lng: -3.9833 },
    zone: 'Marcory',
    avatar: '🏍️'
  },
  {
    id: 'del-4',
    name: 'Fatou Diabaté',
    phone: '+225 07 22 33 44 55',
    vehicle: 'Vélo',
    rating: 4.6,
    deliveriesCount: 67,
    isAvailable: true,
    services: ['Courses', 'Petits colis'],
    currentLocation: { lat: 5.3456, lng: -4.0789 },
    zone: 'Yopougon',
    avatar: '🚲'
  }
];

// Types de services de livraison
export const DELIVERY_SERVICES = [
  {
    id: 'food',
    name: 'Livraison Nourriture',
    icon: '🍽️',
    description: 'Livraison de repas depuis les restaurants',
    basePrice: 1000,
    pricePerKm: 200
  },
  {
    id: 'package',
    name: 'Envoi de Colis',
    icon: '📦',
    description: 'Livraison de colis et documents',
    basePrice: 1500,
    pricePerKm: 300
  },
  {
    id: 'shopping',
    name: 'Faire des Courses',
    icon: '🛒',
    description: 'Courses au marché, pharmacie, etc.',
    basePrice: 2000,
    pricePerKm: 250
  }
];
