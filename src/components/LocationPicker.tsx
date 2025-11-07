import React, { useState } from 'react';
import { locationService, type LocationResult } from '../services/locationService';

interface LocationPickerProps {
  onLocationSelect: (location: LocationResult) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialValue = '',
  placeholder = 'Entrez votre adresse ou utilisez votre position',
  className = ''
}) => {
  const [address, setAddress] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeoAvailable] = useState(locationService.isGeolocationAvailable());

  const handleGetCurrentLocation = async () => {
    if (!isGeoAvailable) {
      setError('La géolocalisation n\'est pas disponible sur cet appareil');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const location = await locationService.getCurrentPosition();
      
      if (location.address) {
        setAddress(location.address);
      } else {
        setAddress(`${location.coordinates.lat}, ${location.coordinates.lng}`);
      }
      
      onLocationSelect(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la géolocalisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setError(null);
  };

  const handleGeocode = async () => {
    if (!address.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await locationService.geocodeAddress(address);
      
      if (coordinates.length > 0) {
        const location: LocationResult = {
          coordinates: coordinates[0],
          address: address
        };
        onLocationSelect(location);
      } else {
        setError('Adresse non trouvée. Vérifiez l\'orthographe.');
      }
    } catch (err) {
      setError('Erreur lors de la recherche d\'adresse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGeocode();
    }
  };

  return (
    <div className={`location-picker ${className}`}>
      <div className="location-input-group">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="location-input"
          disabled={isLoading}
        />
        
        <div className="location-buttons">
          {isGeoAvailable && (
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="location-gps-button"
              title="Utiliser ma position actuelle"
            >
              {isLoading ? '📍' : '🎯'}
            </button>
          )}
          
          <button
            type="button"
            onClick={handleGeocode}
            disabled={isLoading || !address.trim()}
            className="location-search-button"
            title="Rechercher cette adresse"
          >
            {isLoading ? '⏳' : '🔍'}
          </button>
        </div>
      </div>

      {error && (
        <div className="location-error">
          ⚠️ {error}
        </div>
      )}

      {isLoading && (
        <div className="location-loading">
          📍 Obtention de votre position...
        </div>
      )}
    </div>
  );
};

export default LocationPicker;