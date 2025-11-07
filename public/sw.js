// Service Worker pour Djassa PWA avec notifications push temps réel
const CACHE_NAME = 'djassa-cache-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/src/assets/dj1.png',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installé avec succès');
        return self.skipWaiting();
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activé');
      return self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes spéciales
  if (event.request.url.includes('chrome-extension') || 
      event.request.url.includes('extension') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la ressource mise en cache si disponible
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse pour la mise en cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // En cas d'erreur réseau, retourner une page offline
          return caches.match('/');
        });
      })
  );
});

// 🔔 NOTIFICATIONS PUSH TEMPS RÉEL
self.addEventListener('push', (event) => {
  console.log('Service Worker: Notification push reçue', event);
  
  let notificationData = {
    title: 'Djassa - Mise à jour',
    body: 'Nouvelle notification',
    icon: '/src/assets/dj1.png',
    badge: '/src/assets/dj1.png',
    tag: 'djassa-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200], // Pattern de vibration
    sound: 'default', // Son par défaut du système
    timestamp: Date.now(),
    actions: [
      {
        action: 'view',
        title: '👀 Voir',
        icon: '/src/assets/dj1.png'
      },
      {
        action: 'dismiss',
        title: '❌ Ignorer',
        icon: '/src/assets/dj1.png'
      }
    ]
  };

  // Parser les données push si disponibles
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (e) {
      console.log('Service Worker: Données push en texte simple');
      notificationData.body = event.data.text();
    }
  }

  // 🎯 Personnaliser selon le type de notification
  if (notificationData.type) {
    switch (notificationData.type) {
      case 'order_new':
        notificationData.title = '🛒 Nouvelle commande !';
        notificationData.icon = '🛒';
        notificationData.tag = 'order-new';
        notificationData.vibrate = [300, 100, 300, 100, 300];
        break;
        
      case 'order_confirmed':
        notificationData.title = '✅ Commande confirmée';
        notificationData.icon = '✅';
        notificationData.tag = 'order-confirmed';
        notificationData.vibrate = [200, 100, 200];
        break;
        
      case 'delivery_assigned':
        notificationData.title = '🚚 Livreur assigné';
        notificationData.icon = '🚚';
        notificationData.tag = 'delivery-assigned';
        notificationData.vibrate = [150, 50, 150, 50, 150];
        break;
        
      case 'delivery_pickup':
        notificationData.title = '📦 Commande récupérée';
        notificationData.icon = '📦';
        notificationData.tag = 'delivery-pickup';
        notificationData.vibrate = [200, 100, 200];
        break;
        
      case 'delivery_transit':
        notificationData.title = '🚚 Livreur en route !';
        notificationData.icon = '🚚';
        notificationData.tag = 'delivery-transit';
        notificationData.vibrate = [100, 50, 100, 50, 100, 50, 200];
        break;
        
      case 'delivery_arrived':
        notificationData.title = '📍 Livreur arrivé !';
        notificationData.icon = '📍';
        notificationData.tag = 'delivery-arrived';
        notificationData.vibrate = [300, 200, 300, 200, 300];
        notificationData.requireInteraction = true;
        break;
        
      case 'delivery_completed':
        notificationData.title = '🎉 Livraison terminée !';
        notificationData.icon = '🎉';
        notificationData.tag = 'delivery-completed';
        notificationData.vibrate = [500, 200, 500];
        break;
        
      case 'payment_received':
        notificationData.title = '💰 Paiement reçu';
        notificationData.icon = '💰';
        notificationData.tag = 'payment-received';
        notificationData.vibrate = [200, 100, 200, 100, 200];
        break;
        
      case 'location_update':
        notificationData.title = '📍 Position mise à jour';
        notificationData.icon = '📍';
        notificationData.tag = 'location-update';
        notificationData.vibrate = [100]; // Vibration discrète
        notificationData.silent = true; // Notification silencieuse
        break;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate,
      silent: notificationData.silent || false,
      timestamp: notificationData.timestamp,
      actions: notificationData.actions,
      data: {
        url: notificationData.url || '/',
        orderId: notificationData.orderId,
        deliveryId: notificationData.deliveryId,
        type: notificationData.type,
        timestamp: Date.now()
      }
    })
  );
});

// 👆 GESTION DES CLICS SUR NOTIFICATIONS
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Clic sur notification', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return; // Ne rien faire, juste fermer
  }

  // Déterminer l'URL de redirection selon le type
  let targetUrl = '/';
  const notificationData = event.notification.data;
  
  if (notificationData) {
    if (notificationData.orderId) {
      targetUrl = `/orders/${notificationData.orderId}`;
    } else if (notificationData.deliveryId) {
      targetUrl = `/delivery/${notificationData.deliveryId}`;
    } else if (notificationData.url) {
      targetUrl = notificationData.url;
    }
    
    // URL spécifiques selon le type
    switch (notificationData.type) {
      case 'order_new':
      case 'order_confirmed':
        targetUrl = '/orders';
        break;
      case 'delivery_assigned':
      case 'delivery_pickup':
      case 'delivery_transit':
      case 'delivery_arrived':
      case 'delivery_completed':
        targetUrl = '/delivery';
        break;
      case 'payment_received':
        targetUrl = '/payments';
        break;
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher une fenêtre existante
        for (const client of clientList) {
          if (client.url.includes(targetUrl.split('?')[0]) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Ouvrir une nouvelle fenêtre si aucune trouvée
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// 📱 SYNCHRONISATION EN ARRIÈRE-PLAN
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Sync en arrière-plan', event.tag);
  
  switch (event.tag) {
    case 'delivery-location-sync':
      event.waitUntil(syncDeliveryLocation());
      break;
    case 'order-status-sync':
      event.waitUntil(syncOrderStatus());
      break;
    case 'notification-sync':
      event.waitUntil(syncNotifications());
      break;
  }
});

// 🌐 GESTION DES MESSAGES DE L'APPLICATION
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message reçu', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SHOW_NOTIFICATION':
        showManualNotification(event.data);
        break;
        
      case 'UPDATE_DELIVERY_LOCATION':
        updateDeliveryLocation(event.data);
        break;
        
      case 'ORDER_STATUS_CHANGED':
        handleOrderStatusChange(event.data);
        break;
        
      case 'REGISTER_FOR_PUSH':
        console.log('Service Worker: Enregistrement pour notifications push');
        break;
    }
  }
});

// 🔧 FONCTIONS UTILITAIRES
async function syncDeliveryLocation() {
  try {
    const response = await fetch('/api/delivery/location/sync');
    const data = await response.json();
    
    if (data.notifications) {
      data.notifications.forEach(showLocationNotification);
    }
  } catch (error) {
    console.error('Erreur sync location:', error);
  }
}

async function syncOrderStatus() {
  try {
    const response = await fetch('/api/orders/status/sync');
    const data = await response.json();
    
    if (data.updates) {
      data.updates.forEach(handleOrderUpdate);
    }
  } catch (error) {
    console.error('Erreur sync order status:', error);
  }
}

async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/pending');
    const data = await response.json();
    
    if (data.notifications) {
      data.notifications.forEach(notification => {
        self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          tag: notification.tag,
          data: notification.data
        });
      });
    }
  } catch (error) {
    console.error('Erreur sync notifications:', error);
  }
}

function showManualNotification(data) {
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/src/assets/dj1.png',
    tag: data.tag || 'manual-notification',
    vibrate: data.vibrate || [200, 100, 200],
    data: data.data || {}
  });
}

function updateDeliveryLocation(data) {
  console.log('Service Worker: Mise à jour position livreur', data.location);
  
  // Envoyer notification discrète de mise à jour position
  if (data.notifyCustomer) {
    self.registration.showNotification('📍 Position mise à jour', {
      body: 'Votre livreur se rapproche !',
      icon: '📍',
      tag: 'location-update',
      vibrate: [100],
      silent: true,
      data: {
        type: 'location_update',
        deliveryId: data.deliveryId
      }
    });
  }
}

function handleOrderStatusChange(data) {
  const statusMessages = {
    'confirmed': '✅ Votre commande a été confirmée',
    'preparing': '👨‍🍳 Votre commande est en préparation',
    'ready': '📦 Votre commande est prête !',
    'assigned': '🚚 Un livreur a été assigné',
    'picked_up': '📦 Votre commande a été récupérée',
    'in_transit': '🚚 Votre livreur est en route !',
    'delivered': '🎉 Votre commande a été livrée !',
    'cancelled': '❌ Votre commande a été annulée'
  };

  const message = statusMessages[data.status];
  if (message) {
    self.registration.showNotification('Djassa - Mise à jour commande', {
      body: message,
      icon: '/src/assets/dj1.png',
      tag: 'order-status',
      vibrate: [200, 100, 200],
      requireInteraction: data.status === 'delivered' || data.status === 'cancelled',
      data: {
        type: 'order_status',
        orderId: data.orderId,
        status: data.status
      }
    });
  }
}

console.log('🔔 Service Worker: Prêt pour les notifications push temps réel !');