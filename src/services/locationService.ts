import type { Coordinates } from '../types';

export interface LocationResult {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  country?: string;
}

export class LocationService {
  private static instance: LocationService;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Obtenir la position actuelle de l'utilisateur
   */
  public async getCurrentPosition(): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          try {
            // Tentative de géocodage inverse pour obtenir l'adresse
            const address = await this.reverseGeocode(coordinates);
            resolve({
              coordinates,
              ...address
            });
          } catch (error) {
            // Si le géocodage inverse échoue, on retourne juste les coordonnées
            resolve({ coordinates });
          }
        },
        (error) => {
          let errorMessage = 'Erreur de géolocalisation';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'L\'accès à la géolocalisation a été refusé';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Les informations de localisation ne sont pas disponibles';
              break;
            case error.TIMEOUT:
              errorMessage = 'Délai d\'attente dépassé pour obtenir la localisation';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Géocodage inverse : obtenir l'adresse à partir des coordonnées
   */
  private async reverseGeocode(coordinates: Coordinates): Promise<{address?: string, city?: string, country?: string}> {
    try {
      // Utilisation de l'API de géocodage inverse gratuite de Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Djassa-CI/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du géocodage inverse');
      }

      const data = await response.json();
      
      return {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village || data.address?.suburb,
        country: data.address?.country || 'Côte d\'Ivoire'
      };
    } catch (error) {
      console.warn('Géocodage inverse échoué:', error);
      return {};
    }
  }

  /**
   * Géocodage : obtenir les coordonnées à partir d'une adresse
   */
  public async geocodeAddress(address: string): Promise<Coordinates[]> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=ci`,
        {
          headers: {
            'User-Agent': 'Djassa-CI/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du géocodage');
      }

      const data = await response.json();
      
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));
    } catch (error) {
      console.error('Géocodage échoué:', error);
      return [];
    }
  }

  /**
   * Calculer la distance entre deux points (en kilomètres)
   */
  public calculateDistance(
    point1: Coordinates,
    point2: Coordinates
  ): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLon = this.deg2rad(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.lat)) * Math.cos(this.deg2rad(point2.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Arrondi à 2 décimales
  }

  /**
   * Trouver les vendeurs à proximité
   */
  public findNearbyVendors(
    userLocation: Coordinates,
    vendors: Array<{id: string, location: Coordinates, name: string}>,
    radiusKm: number = 10
  ): Array<{id: string, name: string, distance: number, location: Coordinates}> {
    return vendors
      .map(vendor => ({
        ...vendor,
        distance: this.calculateDistance(userLocation, vendor.location)
      }))
      .filter(vendor => vendor.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Demander la permission de géolocalisation
   */
  public async requestPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      return false;
    }

    try {
      await this.getCurrentPosition();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Vérifier si la géolocalisation est disponible
   */
  public isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
  }
}

export const locationService = LocationService.getInstance();
