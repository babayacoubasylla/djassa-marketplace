import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  accuracy: number;
}

interface NearbyVendor {
  id: string;
  name: string;
  distance: number;
  rating: number;
  products: number;
  location: {
    city: string;
    coordinates: [number, number];
  };
}

const LocationPage: React.FC = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [nearbyVendors, setNearbyVendors] = useState<NearbyVendor[]>([]);

  // Vendeurs simulés proches
  const mockNearbyVendors: NearbyVendor[] = [
    {
      id: '1',
      name: 'Mama Adjoua',
      distance: 0.8,
      rating: 4.8,
      products: 12,
      location: {
        city: 'Cocody, Abidjan',
        coordinates: [5.3364, -4.0267]
      }
    },
    {
      id: '2',
      name: 'Kouassi Textiles',
      distance: 1.2,
      rating: 4.5,
      products: 25,
      location: {
        city: 'Marcory, Abidjan',
        coordinates: [5.2929, -4.0142]
      }
    },
    {
      id: '3',
      name: 'Artisan Bété',
      distance: 2.1,
      rating: 4.9,
      products: 8,
      location: {
        city: 'Treichville, Abidjan',
        coordinates: [5.2719, -4.0153]
      }
    },
    {
      id: '4',
      name: 'Tech Store CI',
      distance: 3.5,
      rating: 4.2,
      products: 45,
      location: {
        city: 'Plateau, Abidjan',
        coordinates: [5.3197, -4.0267]
      }
    }
  ];

  const requestLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par ce navigateur.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Simulation de géocodage inverse
        const locationData: LocationData = {
          latitude,
          longitude,
          city: 'Abidjan, Côte d\'Ivoire', // En production: appel API de géocodage
          accuracy
        };

        setLocation(locationData);
        setNearbyVendors(mockNearbyVendors);
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erreur lors de la récupération de la position.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'L\'accès à la géolocalisation a été refusé.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Les informations de localisation ne sont pas disponibles.';
            break;
          case error.TIMEOUT:
            errorMessage = 'La demande de géolocalisation a expiré.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache 5 minutes
      }
    );
  };

  if (!user) {
    return (
      <div className="location-guest">
        <div className="location-guest-content">
          <h2>📍 Localisation</h2>
          <p>Connectez-vous pour trouver les vendeurs près de vous</p>
          <a href="/login" className="cta-button primary">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="location-page">
      <div className="location-header">
        <h1>📍 Vendeurs Près de Vous</h1>
        <p>Trouvez les meilleurs vendeurs dans votre région</p>
      </div>

      {!location && !loading && (
        <div className="location-request">
          <div className="location-request-content">
            <h2>🗺️ Autoriser la géolocalisation</h2>
            <p>Pour vous montrer les vendeurs les plus proches, nous avons besoin d'accéder à votre position.</p>
            <p>Vos données de localisation restent privées et ne sont pas stockées.</p>
            <button onClick={requestLocation} className="location-button">
              📍 Partager ma position
            </button>
          </div>
        </div>
      )}

      {loading && (
        <LoadingSpinner 
          size="large" 
          text="Recherche de votre position..." 
        />
      )}

      {error && (
        <div className="location-error">
          <div className="error-content">
            <h3>❌ Erreur de géolocalisation</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={requestLocation} className="retry-button">
                🔄 Réessayer
              </button>
              <button onClick={() => setError('')} className="dismiss-button">
                Continuer sans localisation
              </button>
            </div>
          </div>
        </div>
      )}

      {location && (
        <div className="location-results">
          <div className="current-location">
            <h3>📍 Votre position actuelle</h3>
            <p>{location.city}</p>
            <p className="location-coords">
              Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
            </p>
            <p className="location-accuracy">
              Précision: ±{Math.round(location.accuracy)}m
            </p>
          </div>

          <div className="nearby-vendors">
            <h3>🏪 Vendeurs près de vous ({nearbyVendors.length})</h3>
            
            <div className="vendors-list">
              {nearbyVendors.map(vendor => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-info">
                    <h4>{vendor.name}</h4>
                    <div className="vendor-stats">
                      <span className="distance">📍 {vendor.distance} km</span>
                      <span className="rating">⭐ {vendor.rating}/5</span>
                      <span className="products">📦 {vendor.products} produits</span>
                    </div>
                    <p className="vendor-location">{vendor.location.city}</p>
                  </div>
                  
                  <div className="vendor-actions">
                    <button className="view-products-button">
                      👁️ Voir produits
                    </button>
                    <button className="directions-button">
                      🧭 Itinéraire
                    </button>
                    <button className="contact-vendor-button">
                      📞 Contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="location-map-placeholder">
            <div className="map-placeholder">
              <h4>🗺️ Carte interactive</h4>
              <p>Ici s'afficherait une carte interactive avec les vendeurs proches</p>
              <p>(Intégration Google Maps / OpenStreetMap)</p>
            </div>
          </div>

          <div className="location-tips">
            <h3>💡 Conseils</h3>
            <ul>
              <li>📱 Activez votre GPS pour une meilleure précision</li>
              <li>🔄 Actualisez votre position régulièrement</li>
              <li>🚗 Contactez les vendeurs avant de vous déplacer</li>
              <li>⭐ Notez vos expériences pour aider la communauté</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPage;