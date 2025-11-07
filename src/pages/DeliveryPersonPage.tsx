import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../services/notificationService';

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    location: { lat: number; lng: number };
  };
  vendor: {
    name: string;
    address: string;
    location: { lat: number; lng: number };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedTime: string;
  distance: string;
  fee: number;
  createdAt: string;
}

interface DeliveryStats {
  todayDeliveries: number;
  todayEarnings: number;
  totalRating: number;
  completionRate: number;
  availableOrders: number;
}

const DeliveryPersonPage: React.FC = () => {
  const { user } = useAuth();
  const notifications = useNotifications();
  const [activeTab, setActiveTab] = useState<'available' | 'current' | 'history' | 'profile'>('available');
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

  // Initialiser les notifications au chargement
  useEffect(() => {
    notifications.init().then(success => {
      if (success) {
        console.log('✅ Notifications initialisées');
      } else {
        console.warn('❌ Échec initialisation notifications');
      }
    });
  }, [notifications]);

  // Statistiques du livreur
  const stats: DeliveryStats = {
    todayDeliveries: 8,
    todayEarnings: 24000,
    totalRating: 4.8,
    completionRate: 96,
    availableOrders: 12
  };

  // Commandes disponibles
  const availableOrders: DeliveryOrder[] = [
    {
      id: '1',
      orderNumber: 'CMD-2024-001',
      customer: {
        name: 'Marie Kouassi',
        phone: '+225 01 23 45 67 89',
        address: 'Cocody, Riviera Golf',
        location: { lat: 5.3364, lng: -4.0267 }
      },
      vendor: {
        name: 'Boutique Tech Plus',
        address: 'Plateau, Immeuble Alpha',
        location: { lat: 5.3198, lng: -4.0267 }
      },
      items: [
        { name: 'Samsung Galaxy A54', quantity: 1, price: 185000 }
      ],
      total: 185000,
      status: 'pending',
      estimatedTime: '25 min',
      distance: '4.2 km',
      fee: 2500,
      createdAt: '10:30'
    },
    {
      id: '2',
      orderNumber: 'CMD-2024-002',
      customer: {
        name: 'Jean Diabaté',
        phone: '+225 05 67 89 01 23',
        address: 'Yopougon, Niangon',
        location: { lat: 5.3364, lng: -4.0867 }
      },
      vendor: {
        name: 'Fashion Store CI',
        address: 'Adjamé, Marché',
        location: { lat: 5.3598, lng: -4.0167 }
      },
      items: [
        { name: 'T-shirt Nike', quantity: 2, price: 15000 },
        { name: 'Casquette', quantity: 1, price: 8000 }
      ],
      total: 38000,
      status: 'pending',
      estimatedTime: '35 min',
      distance: '6.8 km',
      fee: 3000,
      createdAt: '10:45'
    }
  ];

  // Commande en cours
  const currentOrder: DeliveryOrder | null = selectedOrder || {
    id: '3',
    orderNumber: 'CMD-2024-003',
    customer: {
      name: 'Fatou Traoré',
      phone: '+225 07 89 01 23 45',
      address: 'Marcory, Zone 4',
      location: { lat: 5.2864, lng: -3.9767 }
    },
    vendor: {
      name: 'Électro Market',
      address: 'Treichville, Rue 12',
      location: { lat: 5.2998, lng: -4.0067 }
    },
    items: [
      { name: 'iPhone 13', quantity: 1, price: 450000 }
    ],
    total: 450000,
    status: 'in_transit',
    estimatedTime: '15 min',
    distance: '2.1 km',
    fee: 2000,
    createdAt: '11:15'
  };

  // Géolocalisation temps réel
  useEffect(() => {
    if (navigator.geolocation && isOnline) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          // Envoyer position au serveur pour tracking temps réel
          if (selectedOrder && selectedOrder.status === 'in_transit') {
            console.log('Position mise à jour:', {
              orderId: selectedOrder.id,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            });
            
            // Utiliser le service de notifications pour le tracking
            notifications.handleOrderStatusChange(selectedOrder.id, 'location_update', {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline, selectedOrder]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // const getStatusColor = (status: DeliveryOrder['status']) => {
  //   switch (status) {
  //     case 'pending': return 'text-warning';
  //     case 'accepted': return 'text-primary';
  //     case 'picked_up': return 'text-info';
  //     case 'in_transit': return 'text-secondary';
  //     case 'delivered': return 'text-success';
  //     case 'cancelled': return 'text-danger';
  //   }
  // };

  // const getStatusText = (status: DeliveryOrder['status']) => {
  //   switch (status) {
  //     case 'pending': return 'En attente';
  //     case 'accepted': return 'Acceptée';
  //     case 'picked_up': return 'Récupérée';
  //     case 'in_transit': return 'En livraison';
  //     case 'delivered': return 'Livrée';
  //     case 'cancelled': return 'Annulée';
  //   }
  // };

  const handleAcceptOrder = (order: DeliveryOrder) => {
    setSelectedOrder({...order, status: 'accepted'});
    setActiveTab('current');
    
    // Notification au client via le service
    notifications.notifyDeliveryAssigned(order.id, user?.name || 'Livreur');
    
    console.log('Commande acceptée:', order.id);
  };

  const handleUpdateStatus = (newStatus: DeliveryOrder['status']) => {
    if (selectedOrder) {
      setSelectedOrder({...selectedOrder, status: newStatus});
      
      // Utiliser le service de notifications pour les mises à jour
      switch (newStatus) {
        case 'picked_up':
          notifications.showNotification({
            title: 'Commande récupérée',
            body: `Commande ${selectedOrder.id} récupérée avec succès`,
            type: 'delivery_pickup'
          });
          // Démarrer le suivi géolocalisation
          notifications.startLocationTracking(selectedOrder.id);
          break;
        case 'in_transit':
          notifications.notifyDeliveryInTransit(selectedOrder.id, selectedOrder.estimatedTime);
          break;
        case 'delivered':
          notifications.notifyDeliveryCompleted(selectedOrder.id);
          // Arrêter le suivi géolocalisation
          notifications.stopLocationTracking();
          break;
      }
    }
  };

  const renderTabButtons = () => (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container">
        <div className="flex overflow-x-auto">
          {[
            { id: 'available', label: 'Disponibles', icon: '📋', count: stats.availableOrders },
            { id: 'current', label: 'En cours', icon: '🚚', count: selectedOrder ? 1 : 0 },
            { id: 'history', label: 'Historique', icon: '📊', count: null },
            { id: 'profile', label: 'Profil', icon: '👤', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-orange-50'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailableOrders = () => (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">📋 Commandes disponibles</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`btn btn-sm ${isOnline ? 'btn-success' : 'btn-outline'}`}
          >
            {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
          </button>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <p className="text-orange-800 text-center">
            📱 Passez en ligne pour recevoir des commandes
          </p>
        </div>
      )}

      <div className="space-y-3">
        {availableOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
            {/* En-tête commande */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-primary">{order.orderNumber}</div>
                <div className="text-sm text-gray-600">📅 {order.createdAt}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-success text-lg">
                  +{formatPrice(order.fee)} F
                </div>
                <div className="text-xs text-gray-500">{order.distance}</div>
              </div>
            </div>

            {/* Parcours */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">📦 Récupération</div>
                  <div className="text-sm text-gray-600">{order.vendor.name}</div>
                  <div className="text-xs text-gray-500">{order.vendor.address}</div>
                </div>
              </div>
              
              <div className="w-px h-4 bg-gray-300 ml-5"></div>
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">🏠 Livraison</div>
                  <div className="text-sm text-gray-600">{order.customer.name}</div>
                  <div className="text-xs text-gray-500">{order.customer.address}</div>
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium mb-2">📦 Articles ({order.items.length})</div>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatPrice(item.price)} F</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)} F</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={`tel:${order.customer.phone}`}
                className="btn btn-outline flex-1"
              >
                📞 Appeler
              </a>
              <button
                onClick={() => handleAcceptOrder(order)}
                className="btn btn-success flex-1"
              >
                ✅ Accepter ({formatPrice(order.fee)} F)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentOrder = () => {
    if (!currentOrder) {
      return (
        <div className="container py-8 text-center">
          <div className="text-4xl mb-4">🚚</div>
          <h2 className="text-lg font-semibold mb-2">Aucune livraison en cours</h2>
          <p className="text-gray-600 mb-4">
            Acceptez une commande pour commencer
          </p>
          <button
            onClick={() => setActiveTab('available')}
            className="btn btn-primary"
          >
            📋 Voir les commandes disponibles
          </button>
        </div>
      );
    }

    return (
      <div className="container py-4 space-y-4">
        {/* Progression temps réel */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">🚚 Livraison en cours</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Suivi temps réel</span>
            </div>
          </div>
          
          {/* Timeline de livraison */}
          <div className="space-y-4">
            {[
              { status: 'accepted', label: 'Commande acceptée', icon: '✅', time: '11:15', active: true },
              { status: 'picked_up', label: 'Récupération chez le vendeur', icon: '📦', time: currentOrder.status === 'picked_up' ? 'En cours...' : '11:25', active: ['picked_up', 'in_transit', 'delivered'].includes(currentOrder.status) },
              { status: 'in_transit', label: 'En route vers le client', icon: '🚚', time: currentOrder.status === 'in_transit' ? 'En cours...' : '11:35', active: ['in_transit', 'delivered'].includes(currentOrder.status) },
              { status: 'delivered', label: 'Livraison effectuée', icon: '🎉', time: currentOrder.status === 'delivered' ? 'Terminé !' : '', active: currentOrder.status === 'delivered' }
            ].map((step) => (
              <div key={step.status} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                  step.active
                    ? step.status === currentOrder.status
                      ? 'bg-primary text-white animate-pulse shadow-lg'
                      : 'bg-success text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium transition-colors ${
                    step.active ? 'text-gray-800' : 'text-gray-500'
                  } ${step.status === currentOrder.status ? 'text-primary' : ''}`}>
                    {step.label}
                  </div>
                  {step.time && (
                    <div className={`text-xs ${
                      step.status === currentOrder.status ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {step.time}
                    </div>
                  )}
                </div>
                {step.status === currentOrder.status && (
                  <div className="text-primary text-sm animate-pulse">
                    ⚡ En cours
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Informations commande */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-3">📋 Détails de la commande</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                👤
              </div>
              <div className="flex-1">
                <div className="font-medium">{currentOrder.customer.name}</div>
                <div className="text-sm text-gray-600">{currentOrder.customer.address}</div>
                <div className="text-xs text-gray-500">{currentOrder.customer.phone}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                🏪
              </div>
              <div className="flex-1">
                <div className="font-medium">{currentOrder.vendor.name}</div>
                <div className="text-sm text-gray-600">{currentOrder.vendor.address}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                💰
              </div>
              <div className="flex-1">
                <div className="font-medium">Rémunération</div>
                <div className="text-success font-semibold text-lg">+{formatPrice(currentOrder.fee)} F</div>
                <div className="text-xs text-gray-500">{currentOrder.distance} • {currentOrder.estimatedTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions selon le statut */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
          <h3 className="font-semibold">🎯 Actions</h3>
          
          {currentOrder.status === 'accepted' && (
            <button
              onClick={() => handleUpdateStatus('picked_up')}
              className="w-full btn btn-primary"
            >
              📦 J'ai récupéré la commande
            </button>
          )}
          
          {currentOrder.status === 'picked_up' && (
            <button
              onClick={() => handleUpdateStatus('in_transit')}
              className="w-full btn btn-primary"
            >
              🚚 Je suis en route vers le client
            </button>
          )}
          
          {currentOrder.status === 'in_transit' && (
            <button
              onClick={() => handleUpdateStatus('delivered')}
              className="w-full btn btn-success"
            >
              🎉 Livraison effectuée
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${currentOrder.customer.phone}`}
              className="btn btn-outline"
            >
              📞 Client
            </a>
            <button 
              onClick={() => {
                const url = `https://www.google.com/maps/dir/${currentLocation?.lat},${currentLocation?.lng}/${currentOrder.customer.location.lat},${currentOrder.customer.location.lng}`;
                window.open(url, '_blank');
              }}
              className="btn btn-outline"
            >
              📍 Navigation GPS
            </button>
          </div>
        </div>

        {/* Position temps réel - Visible par le client */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            📍 Position partagée en temps réel
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            Le client peut suivre votre position sur la carte
          </p>
          <div className="text-xs text-blue-600">
            {currentLocation ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Position: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>🔄 Acquisition de la position...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="container py-4">
      <h2 className="text-lg font-semibold mb-4">📊 Statistiques du jour</h2>
      
      {/* Stats du jour */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-success">
            {stats.todayDeliveries}
          </div>
          <div className="text-sm text-gray-600">Livraisons</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(stats.todayEarnings)} F
          </div>
          <div className="text-sm text-gray-600">Gains</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-warning">
            ⭐ {stats.totalRating}
          </div>
          <div className="text-sm text-gray-600">Note</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-info">
            {stats.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Réussite</div>
        </div>
      </div>

      {/* Historique récent */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">📝 Livraisons récentes</h3>
        </div>
        <div className="divide-y">
          {[
            { time: '16:30', customer: 'Ahmed Kone', amount: 2500, status: 'delivered' },
            { time: '15:45', customer: 'Sarah Bamba', amount: 3000, status: 'delivered' },
            { time: '14:20', customer: 'Moussa Diallo', amount: 2000, status: 'delivered' }
          ].map((delivery, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{delivery.time}</div>
                <div className="text-sm text-gray-600">{delivery.customer}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-success">
                  +{formatPrice(delivery.amount)} F
                </div>
                <div className="text-xs text-success">✅ Livrée</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="container py-4 space-y-6">
      <h2 className="text-lg font-semibold">👤 Mon Profil Livreur</h2>
      
      {/* Informations personnelles */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            🚚
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-600">Livreur professionnel</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-success">⭐ {stats.totalRating}</span>
              <span className="text-xs text-gray-500">(127 avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres notifications */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">🔔 Notifications</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span>🔊 Notifications sonores</span>
            <button className="btn btn-success btn-sm">
              ✅ Activé
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>📳 Vibrations</span>
            <button className="btn btn-success btn-sm">
              ✅ Activé
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>📱 Notifications push</span>
            <button className="btn btn-success btn-sm">
              ✅ Activé
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>📍 Partage de localisation</span>
            <button className="btn btn-success btn-sm">
              ✅ Actif
            </button>
          </div>
        </div>
      </div>

      {/* Paramètres livreur */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">⚙️ Paramètres</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span>🚚 Mode de transport</span>
            <button className="btn btn-outline btn-sm">
              🏍️ Moto
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>🕐 Disponibilité</span>
            <button className="btn btn-outline btn-sm">
              ⏰ 8h-20h
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>📍 Zone de livraison</span>
            <button className="btn btn-outline btn-sm">
              🗺️ Abidjan Centre
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => notifications.testNotification()}
          className="w-full btn btn-outline"
        >
          🧪 Tester notifications
        </button>
        <button
          onClick={() => notifications.testLocationTracking()}
          className="w-full btn btn-outline"
        >
          📍 Tester géolocalisation
        </button>
        <button className="w-full btn btn-outline">
          📊 Voir mes statistiques détaillées
        </button>
        <button className="w-full btn btn-outline">
          💰 Historique des paiements
        </button>
        <button className="w-full btn btn-outline">
          📞 Support technique
        </button>
        <button className="w-full btn btn-danger">
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                🚚 Livraisons
              </h1>
              <p className="text-sm text-gray-600">
                Gérez vos livraisons en temps réel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {renderTabButtons()}

      {activeTab === 'available' && renderAvailableOrders()}
      {activeTab === 'current' && renderCurrentOrder()}
      {activeTab === 'history' && renderHistory()}
      {activeTab === 'profile' && renderProfile()}
    </div>
  );
};

export default DeliveryPersonPage;