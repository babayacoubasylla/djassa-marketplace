// Service de notifications push pour Djassa
export interface NotificationData {
  title: string;
  body: string;
  type: 'order_new' | 'order_confirmed' | 'delivery_assigned' | 'delivery_pickup' | 'delivery_transit' | 'delivery_arrived' | 'delivery_completed' | 'payment_received' | 'location_update';
  orderId?: string;
  deliveryId?: string;
  url?: string;
  icon?: string;
  vibrate?: number[];
  sound?: boolean;
  requireInteraction?: boolean;
}

export interface LocationUpdate {
  lat: number;
  lng: number;
  deliveryId: string;
  timestamp: string;
  speed?: number;
  heading?: number;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private locationWatchId: number | null = null;
  private isTrackingLocation = false;

  async init(): Promise<boolean> {
    try {
      // Vérifier le support des notifications
      if (!('Notification' in window)) {
        console.warn('Ce navigateur ne supporte pas les notifications');
        return false;
      }

      if (!('serviceWorker' in navigator)) {
        console.warn('Ce navigateur ne supporte pas les Service Workers');
        return false;
      }

      // Enregistrer le service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker enregistré:', this.registration);

      // Demander permission pour les notifications
      const permission = await this.requestNotificationPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notifications autorisées');
        return true;
      } else {
        console.warn('❌ Notifications refusées');
        return false;
      }

    } catch (error) {
      console.error('Erreur initialisation notifications:', error);
      return false;
    }
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // 🔔 ENVOYER NOTIFICATION LOCALE
  async showNotification(data: NotificationData): Promise<void> {
    try {
      if (!this.registration) {
        console.warn('Service Worker non enregistré');
        return;
      }

      if (Notification.permission !== 'granted') {
        console.warn('Permission notifications non accordée');
        return;
      }

      // Envoyer message au service worker
      if (this.registration.active) {
        this.registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          title: data.title,
          body: data.body,
          icon: data.icon,
          tag: data.type,
          vibrate: data.vibrate,
          data: {
            type: data.type,
            orderId: data.orderId,
            deliveryId: data.deliveryId,
            url: data.url
          }
        });
      }

      // Afficher aussi une notification locale en backup
      await this.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: data.type,
        requireInteraction: data.requireInteraction || false,
        data: {
          type: data.type,
          orderId: data.orderId,
          deliveryId: data.deliveryId,
          url: data.url
        }
      });

    } catch (error) {
      console.error('Erreur affichage notification:', error);
    }
  }

  // 🛒 NOTIFICATIONS COMMANDES
  async notifyOrderPlaced(orderId: string, customerName: string): Promise<void> {
    await this.showNotification({
      title: '🛒 Nouvelle commande !',
      body: `Commande reçue de ${customerName}`,
      type: 'order_new',
      orderId,
      url: `/orders/${orderId}`,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300]
    });
  }

  async notifyOrderConfirmed(orderId: string): Promise<void> {
    await this.showNotification({
      title: '✅ Commande confirmée',
      body: 'Votre commande a été confirmée par le vendeur',
      type: 'order_confirmed',
      orderId,
      url: `/orders/${orderId}`,
      vibrate: [200, 100, 200]
    });
  }

  // 🚚 NOTIFICATIONS LIVRAISON
  async notifyDeliveryAssigned(orderId: string, deliveryPersonName: string): Promise<void> {
    await this.showNotification({
      title: '🚚 Livreur assigné',
      body: `${deliveryPersonName} va livrer votre commande`,
      type: 'delivery_assigned',
      orderId,
      url: `/delivery/${orderId}`,
      vibrate: [150, 50, 150, 50, 150]
    });
  }

  async notifyDeliveryPickedUp(orderId: string): Promise<void> {
    await this.showNotification({
      title: '📦 Commande récupérée',
      body: 'Votre livreur a récupéré votre commande',
      type: 'delivery_pickup',
      orderId,
      url: `/delivery/${orderId}`,
      vibrate: [200, 100, 200]
    });
  }

  async notifyDeliveryInTransit(orderId: string, estimatedTime?: string): Promise<void> {
    const body = estimatedTime 
      ? `Votre livreur est en route ! Arrivée estimée: ${estimatedTime}`
      : 'Votre livreur est en route !';
      
    await this.showNotification({
      title: '🚚 Livraison en cours',
      body,
      type: 'delivery_transit',
      orderId,
      url: `/delivery/${orderId}`,
      vibrate: [100, 50, 100, 50, 100, 50, 200]
    });
  }

  async notifyDeliveryArrived(orderId: string): Promise<void> {
    await this.showNotification({
      title: '📍 Livreur arrivé !',
      body: 'Votre livreur est arrivé à destination',
      type: 'delivery_arrived',
      orderId,
      url: `/delivery/${orderId}`,
      requireInteraction: true,
      vibrate: [300, 200, 300, 200, 300]
    });
  }

  async notifyDeliveryCompleted(orderId: string): Promise<void> {
    await this.showNotification({
      title: '🎉 Livraison terminée !',
      body: 'Votre commande a été livrée avec succès',
      type: 'delivery_completed',
      orderId,
      url: `/orders/${orderId}`,
      requireInteraction: true,
      vibrate: [500, 200, 500]
    });
  }

  // 💰 NOTIFICATIONS PAIEMENT
  async notifyPaymentReceived(amount: number, orderId: string): Promise<void> {
    await this.showNotification({
      title: '💰 Paiement reçu',
      body: `Paiement de ${amount.toLocaleString()} F reçu`,
      type: 'payment_received',
      orderId,
      url: `/payments`,
      vibrate: [200, 100, 200, 100, 200]
    });
  }

  // 📍 SUIVI GÉOLOCALISATION TEMPS RÉEL
  async startLocationTracking(deliveryId: string, onLocationUpdate?: (location: LocationUpdate) => void): Promise<boolean> {
    try {
      if (!navigator.geolocation) {
        console.warn('Géolocalisation non supportée');
        return false;
      }

      if (this.isTrackingLocation) {
        console.log('Suivi de position déjà actif');
        return true;
      }

      // Demander permission géolocalisation
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      console.log('✅ Permission géolocalisation accordée');

      // Démarrer le suivi continu
      this.locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          const locationUpdate: LocationUpdate = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            deliveryId,
            timestamp: new Date().toISOString(),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined
          };

          console.log('📍 Position mise à jour:', locationUpdate);

          // Envoyer au service worker
          if (this.registration?.active) {
            this.registration.active.postMessage({
              type: 'UPDATE_DELIVERY_LOCATION',
              location: locationUpdate,
              deliveryId,
              notifyCustomer: true
            });
          }

          // Callback personnalisé
          if (onLocationUpdate) {
            onLocationUpdate(locationUpdate);
          }

          // Envoyer au serveur (simulation)
          this.sendLocationToServer(locationUpdate);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000
        }
      );

      this.isTrackingLocation = true;
      console.log('🎯 Suivi géolocalisation démarré');
      return true;

    } catch (error) {
      console.error('Erreur démarrage suivi position:', error);
      return false;
    }
  }

  stopLocationTracking(): void {
    if (this.locationWatchId !== null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
      this.isTrackingLocation = false;
      console.log('🛑 Suivi géolocalisation arrêté');
    }
  }

  private async sendLocationToServer(location: LocationUpdate): Promise<void> {
    try {
      // Simulation envoi au serveur
      console.log('📡 Envoi position au serveur:', location);
      
      // Dans une vraie app, envoyer au backend:
      // await fetch('/api/delivery/location', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(location)
      // });
      
    } catch (error) {
      console.error('Erreur envoi position:', error);
    }
  }

  // 🔄 GESTION CHANGEMENTS STATUT COMMANDE
  async handleOrderStatusChange(orderId: string, newStatus: string, additionalData?: any): Promise<void> {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'ORDER_STATUS_CHANGED',
        orderId,
        status: newStatus,
        data: additionalData
      });
    }

    // Notifications spécifiques selon le statut
    switch (newStatus) {
      case 'confirmed':
        await this.notifyOrderConfirmed(orderId);
        break;
      case 'delivery_assigned':
        if (additionalData?.deliveryPersonName) {
          await this.notifyDeliveryAssigned(orderId, additionalData.deliveryPersonName);
        }
        break;
      case 'picked_up':
        await this.notifyDeliveryPickedUp(orderId);
        break;
      case 'in_transit':
        await this.notifyDeliveryInTransit(orderId, additionalData?.estimatedTime);
        break;
      case 'arrived':
        await this.notifyDeliveryArrived(orderId);
        break;
      case 'delivered':
        await this.notifyDeliveryCompleted(orderId);
        break;
    }
  }

  // 🔧 UTILITAIRES
  isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  getNotificationPermission(): NotificationPermission {
    return Notification.permission;
  }

  isLocationTrackingActive(): boolean {
    return this.isTrackingLocation;
  }

  // 🧪 FONCTIONS DE TEST
  async testNotification(): Promise<void> {
    await this.showNotification({
      title: '🧪 Test Notification',
      body: 'Ceci est un test de notification Djassa',
      type: 'order_new',
      vibrate: [200, 100, 200]
    });
  }

  async testLocationTracking(): Promise<void> {
    const success = await this.startLocationTracking('test-delivery', (location) => {
      console.log('📍 Test position:', location);
      
      // Arrêter après 30 secondes
      setTimeout(() => {
        this.stopLocationTracking();
        console.log('✅ Test suivi terminé');
      }, 30000);
    });

    if (success) {
      console.log('✅ Test suivi démarré');
    } else {
      console.log('❌ Échec test suivi');
    }
  }
}

// Instance singleton
export const notificationService = new NotificationService();

// Hook React pour utiliser le service de notifications
export const useNotifications = () => {
  return {
    init: () => notificationService.init(),
    showNotification: (data: NotificationData) => notificationService.showNotification(data),
    startLocationTracking: (deliveryId: string, callback?: (location: LocationUpdate) => void) => 
      notificationService.startLocationTracking(deliveryId, callback),
    stopLocationTracking: () => notificationService.stopLocationTracking(),
    handleOrderStatusChange: (orderId: string, status: string, data?: any) => 
      notificationService.handleOrderStatusChange(orderId, status, data),
    
    // Notifications spécifiques
    notifyOrderPlaced: (orderId: string, customerName: string) => 
      notificationService.notifyOrderPlaced(orderId, customerName),
    notifyOrderConfirmed: (orderId: string) => 
      notificationService.notifyOrderConfirmed(orderId),
    notifyDeliveryAssigned: (orderId: string, deliveryPersonName: string) => 
      notificationService.notifyDeliveryAssigned(orderId, deliveryPersonName),
    notifyDeliveryInTransit: (orderId: string, estimatedTime?: string) => 
      notificationService.notifyDeliveryInTransit(orderId, estimatedTime),
    notifyDeliveryCompleted: (orderId: string) => 
      notificationService.notifyDeliveryCompleted(orderId),
    notifyPaymentReceived: (amount: number, orderId: string) => 
      notificationService.notifyPaymentReceived(amount, orderId),
    
    // Tests
    testNotification: () => notificationService.testNotification(),
    testLocationTracking: () => notificationService.testLocationTracking(),
    
    // États
    isSupported: () => notificationService.isNotificationSupported(),
    permission: () => notificationService.getNotificationPermission(),
    isTrackingLocation: () => notificationService.isLocationTrackingActive()
  };
};

export default notificationService;