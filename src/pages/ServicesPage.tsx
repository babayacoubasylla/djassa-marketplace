import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { locationService } from '../services/locationService';
import { searchServices, HOTELS_DATA, HEALTH_SERVICES_DATA, MAJOR_CITIES } from '../services/dataService';
import type { SearchResult, SearchFilters, Hotel, Coordinates } from '../types';

const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Catégories de services
  const serviceCategories = [
    { id: 'all', name: 'Tous les services', icon: '🏢', color: '#1976D2' },
    { id: 'hotels', name: 'Hôtels & Hébergement', icon: '🏨', color: '#dc2626' },
    { id: 'health', name: 'Santé & Médical', icon: '🏥', color: '#059669' },
    { id: 'restaurants', name: 'Restaurants', icon: '🍽️', color: '#ef4444' },
    { id: 'education', name: 'Éducation', icon: '🎓', color: '#7c2d12' },
    { id: 'government', name: 'Services publics', icon: '🏛️', color: '#374151' },
    { id: 'transport', name: 'Transport', icon: '🚌', color: '#1f2937' }
  ];

  const healthTypes = [
    { id: 'pharmacy', name: 'Pharmacies', icon: '💊' },
    { id: 'clinic', name: 'Cliniques', icon: '🏥' },
    { id: 'hospital', name: 'Hôpitaux', icon: '🏥' },
    { id: 'medical_center', name: 'Centres médicaux', icon: '⚕️' }
  ];

  // Effectuer une recherche
  const handleSearch = async () => {
    if (!searchTerm.trim() && selectedCategory === 'all') return;

    setIsSearching(true);
    try {
      const filters: SearchFilters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        location: selectedCity || undefined
      };

      const results = await searchServices(searchTerm, filters, userLocation || undefined);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Obtenir la localisation de l'utilisateur
  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await locationService.getCurrentPosition();
      setUserLocation(position.coordinates);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la géolocalisation');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Recherche automatique quand les filtres changent
  useEffect(() => {
    if (selectedCategory !== 'all' || searchTerm || selectedCity) {
      handleSearch();
    }
  }, [selectedCategory, selectedCity]);

  // Contacter un établissement
  const handleContact = (phone: string, name: string, type: string) => {
    const message = `Bonjour, je souhaiterais avoir des informations sur ${name} (${type}).`;
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Réserver un hôtel
  const handleBookHotel = (hotel: Hotel) => {
    const message = `Bonjour, je souhaiterais réserver une chambre à ${hotel.name} à ${hotel.location.city}. Pouvez-vous me donner les disponibilités et tarifs ?`;
    const cleanPhone = hotel.contact.phone.replace(/[^0-9+]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <h2 className="auth-title">🏢 Services en Côte d'Ivoire</h2>
            <p className="auth-subtitle">Connectez-vous pour accéder à tous les services</p>
          </div>
          <div className="mt-6">
            <a href="/login" className="btn btn-primary btn-lg btn-full">
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span>Se connecter</span>
              </div>
            </a>
          </div>
          <div className="mt-4">
            <a href="/register" className="btn btn-outline btn-lg btn-full">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>Créer un compte</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-8 mb-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">🏢 Services en Côte d'Ivoire</h1>
        <p className="text-lg text-text-secondary">
          Trouvez tous les services dont vous avez besoin : hôtels, santé, restaurants et plus encore
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="card mb-8">
        <div className="grid gap-4">
          {/* Recherche principale */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Rechercher un service, hôtel, pharmacie..."
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn btn-primary"
            >
              {isSearching ? '⏳ Recherche...' : '🔍 Rechercher'}
            </button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Catégorie */}
            <div>
              <label className="form-label">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
                title="Sélectionner une catégorie"
              >
                {serviceCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ville */}
            <div>
              <label className="form-label">Ville</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="form-select"
                title="Sélectionner une ville"
              >
                <option value="">Toutes les villes</option>
                {MAJOR_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Localisation */}
            <div>
              <label className="form-label">Position</label>
              <button
                onClick={handleGetLocation}
                disabled={isLoadingLocation}
                className={`btn btn-outline btn-full ${userLocation ? 'btn-success' : ''}`}
              >
                {isLoadingLocation ? '📍 Localisation...' : 
                 userLocation ? '📍 Position obtenue' : '📍 Utiliser ma position'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {serviceCategories.slice(1).map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`card text-center p-4 transition-all hover:shadow-md ${
              selectedCategory === category.id ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="font-medium text-sm">{category.name}</div>
          </button>
        ))}
      </div>

      {/* Résultats de recherche */}
      {searchResults && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Résultats de recherche ({searchResults.total})
            </h2>
            {searchTerm && (
              <p className="text-text-muted">
                Résultats pour "{searchTerm}"
                {selectedCity && ` à ${selectedCity}`}
              </p>
            )}
          </div>

          {/* Hôtels */}
          {searchResults.hotels.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🏨 Hôtels & Hébergement ({searchResults.hotels.length})
              </h3>
              <div className="grid gap-4">
                {searchResults.hotels.map(hotel => (
                  <div key={hotel.id} className="card">
                    <div className="flex gap-4">
                      <img
                        src={hotel.images[0] || '/api/placeholder/200/150'}
                        alt={hotel.name}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-primary">{hotel.name}</h4>
                          <div className="flex items-center gap-1">
                            <span className="text-warning">⭐</span>
                            <span className="font-medium">{hotel.rating}</span>
                            {hotel.verified && <span className="text-success">✅</span>}
                          </div>
                        </div>
                        <p className="text-text-muted mb-2">{hotel.description}</p>
                        <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                          <span>📍 {hotel.location.address || hotel.location.city}</span>
                          <span>💰 {hotel.priceRange.min.toLocaleString()} - {hotel.priceRange.max.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {hotel.amenities.slice(0, 4).map(amenity => (
                            <span key={amenity} className="badge badge-success text-xs">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookHotel(hotel)}
                            className="btn btn-primary btn-sm"
                          >
                            📞 Réserver
                          </button>
                          <button
                            onClick={() => handleContact(hotel.contact.phone, hotel.name, 'hôtel')}
                            className="btn btn-outline btn-sm"
                          >
                            💬 Contacter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services de santé */}
          {searchResults.healthServices.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🏥 Services de Santé ({searchResults.healthServices.length})
              </h3>
              <div className="grid gap-4">
                {searchResults.healthServices.map(service => (
                  <div key={service.id} className="card">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-primary">{service.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <span>
                            {service.type === 'pharmacy' && '💊 Pharmacie'}
                            {service.type === 'clinic' && '🏥 Clinique'}
                            {service.type === 'hospital' && '🏥 Hôpital'}
                            {service.type === 'medical_center' && '⚕️ Centre médical'}
                          </span>
                          <span>📍 {service.location.address || service.location.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-warning">⭐</span>
                        <span className="font-medium">{service.rating}</span>
                        {service.verified && <span className="text-success">✅</span>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">Services proposés:</h5>
                        <div className="flex flex-wrap gap-1">
                          {service.services.map(svc => (
                            <span key={svc} className="badge bg-secondary text-xs">
                              {svc}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Horaires:</h5>
                        {service.openingHours.map(hours => (
                          <div key={hours.day} className="text-sm text-text-muted">
                            {hours.day}: {hours.open} - {hours.close}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContact(service.contact.phone, service.name, 'service de santé')}
                        className="btn btn-primary btn-sm"
                      >
                        📞 Appeler
                      </button>
                      {service.contact.emergency && (
                        <button
                          onClick={() => handleContact(service.contact.emergency!, service.name, 'urgence')}
                          className="btn btn-secondary btn-sm"
                        >
                          🚨 Urgence
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aucun résultat */}
          {searchResults.total === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold mb-2">Aucun service trouvé</h3>
              <p className="text-text-muted mb-4">
                Essayez avec d'autres mots-clés ou changez de ville
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCity('');
                  setSearchResults(null);
                }}
                className="btn btn-outline"
              >
                🔄 Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* Services populaires par défaut */}
      {!searchResults && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">🌟 Services populaires</h2>
          
          {/* Hôtels populaires */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">🏨 Hôtels recommandés</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {HOTELS_DATA.slice(0, 4).map(hotel => (
                <div key={hotel.id} className="card">
                  <img
                    src={hotel.images[0] || '/api/placeholder/300/200'}
                    alt={hotel.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-primary mb-1">{hotel.name}</h4>
                  <p className="text-sm text-text-muted mb-2">📍 {hotel.location.city}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">
                      {hotel.priceRange.min.toLocaleString()} - {hotel.priceRange.max.toLocaleString()} FCFA
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-warning">⭐</span>
                      <span className="text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookHotel(hotel)}
                    className="btn btn-primary btn-sm btn-full"
                  >
                    📞 Voir les disponibilités
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Services de santé essentiels */}
          <div>
            <h3 className="text-xl font-semibold mb-4">🏥 Services de santé essentiels</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {healthTypes.map(type => {
                const services = HEALTH_SERVICES_DATA.filter(s => s.type === type.id);
                return (
                  <div key={type.id} className="card text-center">
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h4 className="font-semibold mb-2">{type.name}</h4>
                    <p className="text-sm text-text-muted mb-3">
                      {services.length} établissement{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}
                    </p>
                    <button
                      onClick={() => setSelectedCategory('health')}
                      className="btn btn-outline btn-sm"
                    >
                      Voir la liste
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;