import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCompare } from '../contexts/CompareContext';
import { locationService } from '../services/locationService';
import { EXTENDED_CATEGORIES } from '../services/dataService';
import type { Product, Category, Coordinates } from '../types';

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const { addToCompare, isInCompare } = useCompare();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);

  // Catégories étendues avec les nouveaux services
  const categories: Category[] = [
    { id: 'all', name: 'Tous', icon: '🏪', color: '#1976D2' },
    ...EXTENDED_CATEGORIES
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Attiéké traditionnel',
      description: 'Attiéké frais préparé selon la tradition ivoirienne',
      price: 2500,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'food',
      sellerId: 'seller1',
      seller: { name: 'Mama Adjoua', rating: 4.8 },
      location: { 
        city: 'Abidjan', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 5.3599, lng: -4.0083 } // Abidjan Plateau
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Pagne Baoulé authentique',
      description: 'Pagne tissé à la main par les artisans Baoulé',
      price: 25000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'fashion',
      sellerId: 'seller2',
      seller: { name: 'Kouassi Textiles', rating: 4.5 },
      location: { 
        city: 'Bouaké', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 7.6898, lng: -5.0306 } // Bouaké centre
      },
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Masque Dan sculpté',
      description: 'Masque traditionnel Dan sculpté dans du bois d\'ébène',
      price: 45000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'crafts',
      sellerId: 'seller3',
      seller: { name: 'Artisan Bété', rating: 4.9 },
      location: { 
        city: 'Man', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 7.4122, lng: -7.5539 } // Man
      },
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      name: 'Smartphone Samsung Galaxy',
      description: 'Samsung Galaxy A54 neuf avec garantie',
      price: 180000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'electronics',
      sellerId: 'seller4',
      seller: { name: 'Tech Store CI', rating: 4.2 },
      location: { 
        city: 'Abidjan', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 5.3600, lng: -4.0000 } // Abidjan Cocody
      },
      createdAt: '2024-01-12'
    },
    {
      id: '5',
      name: 'Foutou banane',
      description: 'Foutou banane fraîchement préparé avec sauce accompagnement',
      price: 1500,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'food',
      sellerId: 'seller5',
      seller: { name: 'Restaurant Chez Tantine', rating: 4.6 },
      location: { 
        city: 'Abidjan', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 5.3550, lng: -4.0050 } // Abidjan Treichville
      },
      createdAt: '2024-01-11'
    },
    {
      id: '6',
      name: 'Robe en wax',
      description: 'Belle robe traditionnelle en tissu wax coloré',
      price: 15000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'fashion',
      sellerId: 'seller6',
      seller: { name: 'Couture Moderne', rating: 4.4 },
      location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-10'
    },
    {
      id: '7',
      name: 'Djembé artisanal',
      description: 'Djembé traditionnel fait à la main avec peau de chèvre',
      price: 35000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'crafts',
      sellerId: 'seller7',
      seller: { name: 'Atelier Musique Traditionnelle', rating: 4.7 },
      location: { city: 'Korhogo', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-09'
    },
    {
      id: '8',
      name: 'Ordinateur portable HP',
      description: 'HP Pavilion 15 pouces, 8GB RAM, 256GB SSD',
      price: 350000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'electronics',
      sellerId: 'seller8',
      seller: { name: 'Computer World', rating: 4.3 },
      location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-08'
    },
    {
      id: '9',
      name: 'Bangui (poisson braisé)',
      description: 'Poisson bangui braisé avec attiéké et légumes',
      price: 3500,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'food',
      sellerId: 'seller9',
      seller: { name: 'Maquis du Coin', rating: 4.5 },
      location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-07'
    },
    {
      id: '10',
      name: 'Tabouret Sénoufo',
      description: 'Tabouret traditionnel Sénoufo en bois sculpté',
      price: 28000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'home',
      sellerId: 'seller10',
      seller: { name: 'Mobilier Traditionnel', rating: 4.6 },
      location: { city: 'Korhogo', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-06'
    },
    {
      id: '11',
      name: 'Casque audio Bluetooth',
      description: 'Casque sans fil Bluetooth avec réduction de bruit',
      price: 45000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'electronics',
      sellerId: 'seller11',
      seller: { name: 'Électronique Plus', rating: 4.1 },
      location: { city: 'Abidjan', country: 'Côte d\'Ivoire' },
      createdAt: '2024-01-05'
    },
    {
      id: '12',
      name: 'Alloco (banane plantain)',
      description: 'Alloco croustillant avec sauce pimentée et œuf dur',
      price: 1000,
      currency: 'FCFA',
      images: ['/api/placeholder/300/200'],
      category: 'food',
      sellerId: 'seller12',
      seller: { name: 'Alloco Express', rating: 4.8 },
      location: { 
        city: 'Abidjan', 
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 5.3620, lng: -4.0120 } // Abidjan Adjamé
      },
      createdAt: '2024-01-04'
    }
  ];

  const handleContactSeller = (product: Product) => {
    const message = `Bonjour, je suis intéressé(e) par votre produit "${product.name}" au prix de ${product.price} ${product.currency}.`;
    const phoneNumber = '22500000000'; // Numéro ivoirien
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNearbySearch = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await locationService.getCurrentPosition();
      setUserLocation(position.coordinates);
      setShowNearbyOnly(true);
      setSelectedCategory('all'); // Reset category filter
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la géolocalisation');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Filtrer les produits par proximité si activé
  const getFilteredProducts = () => {
    let products = mockProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Si "Près de moi" est activé et qu'on a la position de l'utilisateur
    if (showNearbyOnly && userLocation) {
      products = products
        .filter(product => product.location.coordinates) // Seuls les produits avec coordonnées
        .map(product => ({
          ...product,
          distance: locationService.calculateDistance(
            userLocation,
            product.location.coordinates!
          )
        }))
        .filter(product => product.distance <= 10) // Dans un rayon de 10km
        .sort((a, b) => a.distance - b.distance); // Trier par distance
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (!user) {
    return (
      <div className="explore-guest">
        <div className="explore-guest-content">
          <h2>🛍️ Explorer les Produits</h2>
          <p>Connectez-vous pour découvrir tous les produits disponibles</p>
          <a href="/login" className="cta-button primary">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>🛍️ Explorer les Produits</h1>
        <p>Découvrez les meilleurs produits locaux de Côte d'Ivoire</p>
      </div>

      <div className="explore-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="action-buttons">
          <button
            onClick={handleNearbySearch}
            disabled={isLoadingLocation}
            className={`nearby-button ${showNearbyOnly ? 'active' : ''}`}
          >
            {isLoadingLocation ? '📍 Localisation...' : showNearbyOnly ? '📍 Près de moi ✓' : '📍 Près de moi'}
          </button>
          
          {showNearbyOnly && (
            <button
              onClick={() => {
                setShowNearbyOnly(false);
                setUserLocation(null);
              }}
              className="reset-nearby-button"
            >
              🌍 Voir tout
            </button>
          )}
        </div>

        <div className="categories-filter">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              data-category-color={category.color}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="results-summary">
        <p>
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` dans ${categories.find(c => c.id === selectedCategory)?.name}`}
          {searchTerm && ` pour "${searchTerm}"`}
        </p>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="product-image"
              />
              <div className="product-actions">
                <button 
                  onClick={() => addToCompare(product)}
                  className={`compare-button ${isInCompare(product.id) ? 'active' : ''}`}
                  disabled={isInCompare(product.id)}
                >
                  {isInCompare(product.id) ? '✅' : '⚖️'}
                </button>
              </div>
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-price">{product.price.toLocaleString()} {product.currency}</div>
              
              <div className="product-meta">
                <div className="product-seller">
                  👤 {product.seller.name}
                  <span className="rating">⭐ {product.seller.rating}</span>
                </div>
                <div className="product-location">
                  📍 {product.location.city}
                  {showNearbyOnly && userLocation && product.location.coordinates && (
                    <span className="distance">
                      {' '}- {locationService.calculateDistance(userLocation, product.location.coordinates).toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>

              <div className="product-buttons">
                <button
                  onClick={() => handleContactSeller(product)}
                  className="contact-button"
                >
                  � Contacter
                </button>
                <button className="details-button">
                  👁️ Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <div className="no-results-content">
            <h3>😕 Aucun produit trouvé</h3>
            <p>Essayez avec d'autres mots-clés ou changez de catégorie</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="reset-filters-button"
            >
              🔄 Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
