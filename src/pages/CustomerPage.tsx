import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import Logo from '../components/Logo';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Vendor {
  id: string;
  name: string;
  logo: string;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
}

interface Order {
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
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface TaxiDriver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  carModel: string;
  plateNumber: string;
  location: Coordinates;
}

interface TaxiRide {
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
  isNightRide: boolean;
}

type TabType = 'home' | 'orders' | 'taxi' | 'profile';

const CustomerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);

  const [user] = useState<User>({
    id: 'user-1',
    name: 'Kouame Jean',
    email: 'kouame.jean@example.com',
    phone: '+225 07 12 34 56 78'
  });

  const [orders] = useState<Order[]>([
    {
      id: 'order-1',
      orderNumber: 'CMD-2024-001',
      vendor: {
        id: 'vendor-1',
        name: 'Chez Fatou',
        logo: '/api/placeholder/50/50',
        rating: 4.8
      },
      items: [
        {
          id: 'item-1',
          name: 'Attiéké Poisson',
          price: 2500,
          image: '/api/placeholder/60/60',
          quantity: 2
        },
        {
          id: 'item-2',
          name: 'Alloco',
          price: 1500,
          image: '/api/placeholder/60/60',
          quantity: 1
        }
      ],
      total: 6500,
      deliveryFee: 1500,
      status: 'in_delivery',
      estimatedTime: '15 min',
      createdAt: '2024-11-07T18:30:00Z',
      deliveryPerson: {
        id: 'delivery-1',
        name: 'Koffi Paul',
        phone: '+225 07 98 76 54 32',
        photo: '/api/placeholder/40/40',
        rating: 4.9
      }
    },
    {
      id: 'order-2',
      orderNumber: 'CMD-2024-002',
      vendor: {
        id: 'vendor-2',
        name: 'TechStore CI',
        logo: '/api/placeholder/50/50',
        rating: 4.9
      },
      items: [
        {
          id: 'item-3',
          name: 'Chargeur Samsung',
          price: 15000,
          image: '/api/placeholder/60/60',
          quantity: 1
        },
        {
          id: 'item-4',
          name: 'Écouteurs Bluetooth',
          price: 25000,
          image: '/api/placeholder/60/60',
          quantity: 1
        }
      ],
      total: 40000,
      deliveryFee: 2000,
      status: 'delivered',
      estimatedTime: '25 min',
      createdAt: '2024-11-06T15:20:00Z',
      deliveredAt: '2024-11-06T15:45:00Z'
    }
  ]);

  const [currentTaxiRide, setCurrentTaxiRide] = useState<TaxiRide | null>({
    id: 'TAXI-001',
    status: 'driver_arriving',
    pickup: {
      address: 'Cocody, Riviera Golf, Villa 123',
      location: { lat: 5.3364, lng: -4.0267 }
    },
    destination: {
      address: 'Plateau, Avenue Chardy',
      location: { lat: 5.3167, lng: -4.0167 }
    },
    driver: {
      id: 'driver-1',
      name: 'Mamadou Traore',
      phone: '+225 07 89 01 23 45',
      photo: '/api/placeholder/40/40',
      rating: 4.9,
      carModel: 'Toyota Corolla 2020',
      plateNumber: 'AB 1234 CI',
      location: { lat: 5.3300, lng: -4.0200 }
    },
    passengers: 2,
    fare: 3500,
    distance: '5.2 km',
    estimatedTime: '3 min',
    requestedAt: '2024-11-07T22:30:00Z',
    isNightRide: true
  });

  // Initialiser géolocalisation et notifications
  useEffect(() => {
    notificationService.init();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Erreur géolocalisation:', error)
      );
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getOrderStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '📦';
      case 'in_delivery': return '🚚';
      case 'delivered': return '🎉';
      case 'cancelled': return '❌';
    }
  };

  const getOrderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'in_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
    }
  };

  const getTaxiStatusIcon = (status: TaxiRide['status']) => {
    switch (status) {
      case 'requesting': return '🔍';
      case 'driver_assigned': return '👨‍💼';
      case 'driver_arriving': return '🚕';
      case 'in_progress': return '🚗';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
    }
  };

  const getTaxiStatusText = (status: TaxiRide['status']) => {
    switch (status) {
      case 'requesting': return 'Recherche chauffeur';
      case 'driver_assigned': return 'Chauffeur assigné';
      case 'driver_arriving': return 'Chauffeur en route';
      case 'in_progress': return 'Course en cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
    }
  };

  const renderTabButtons = () => (
    <div className="bg-white border-b">
      <div className="container">
        <div className="flex">
          {[
            { id: 'home', label: '🏠 Accueil', icon: '🏠' },
            { id: 'orders', label: '📦 Commandes', icon: '📦' },
            { id: 'taxi', label: '🚕 Taxi', icon: '🚕' },
            { id: 'profile', label: '👤 Profil', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <div className="text-lg">{tab.icon}</div>
              <div className="text-xs mt-1">{tab.label.split(' ')[1]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="container py-4 space-y-6">
      {/* Alerte géolocalisation */}
      {!currentLocation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600">📍</span>
            <div className="flex-1">
              <div className="font-medium text-yellow-800">Géolocalisation requise</div>
              <p className="text-sm text-yellow-700">
                Activez votre position pour des services optimisés
              </p>
            </div>
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      });
                    }
                  );
                }
              }}
              className="btn btn-warning btn-sm"
            >
              Activer
            </button>
          </div>
        </div>
      )}

      {/* Salutation */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 18 ? '☀️' : '🌙'} 
              {new Date().getHours() < 12 ? ' Bonjour' : new Date().getHours() < 18 ? ' Bon après-midi' : ' Bonsoir'}, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-sm text-gray-600">
              Que souhaitez-vous faire aujourd'hui ?
            </p>
          </div>
          <div className="text-2xl">👋</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-semibold mb-1">Explorer les magasins</h3>
          <p className="text-xs text-gray-600 mb-3">Découvrez les vendeurs près de vous</p>
          <button className="btn btn-primary btn-sm w-full">
            Parcourir
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-3xl mb-2">🚕</div>
          <h3 className="font-semibold mb-1">Réserver un taxi</h3>
          <p className="text-xs text-gray-600 mb-3">Course jour/nuit disponible</p>
          <button 
            onClick={() => setActiveTab('taxi')}
            className="btn btn-secondary btn-sm w-full"
          >
            Réserver
          </button>
        </div>
      </div>

      {/* Course taxi en cours */}
      {currentTaxiRide && currentTaxiRide.status !== 'completed' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-800">🚕 Course en cours</h3>
            <span className="badge badge-primary">
              {getTaxiStatusIcon(currentTaxiRide.status)} {getTaxiStatusText(currentTaxiRide.status)}
            </span>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="text-sm">
              <span className="text-blue-700">📍 Vers:</span>
              <span className="font-medium ml-1">{currentTaxiRide.destination.address}</span>
            </div>
            
            {currentTaxiRide.driver && (
              <div className="text-sm">
                <span className="text-blue-700">👨‍💼 Chauffeur:</span>
                <span className="font-medium ml-1">{currentTaxiRide.driver.name}</span>
                <span className="text-blue-600 ml-2">⭐ {currentTaxiRide.driver.rating}</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setActiveTab('taxi')}
            className="btn btn-primary btn-sm w-full"
          >
            📍 Suivre la course
          </button>
        </div>
      )}

      {/* Commandes récentes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">📦 Commandes récentes</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-sm text-primary"
          >
            Voir tout
          </button>
        </div>
        
        <div className="divide-y">
          {orders.slice(0, 2).map((order) => (
            <div key={order.id} className="p-4 flex items-center gap-3">
              <img
                src={order.vendor.logo}
                alt={order.vendor.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{order.vendor.name}</div>
                <div className="text-xs text-gray-600">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''} • {formatPrice(order.total + order.deliveryFee)} F
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <span className={`badge badge-sm ${
                order.status === 'delivered' ? 'badge-success' :
                order.status === 'in_delivery' ? 'badge-primary' :
                order.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
              }`}>
                {getOrderStatusIcon(order.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendeurs populaires */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">⭐ Vendeurs populaires</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Chez Fatou', category: 'Restaurant', rating: 4.8, image: '/api/placeholder/60/60' },
              { name: 'TechStore CI', category: 'Électronique', rating: 4.9, image: '/api/placeholder/60/60' },
              { name: 'Mode & Style', category: 'Vêtements', rating: 4.7, image: '/api/placeholder/60/60' },
              { name: 'Pharmacie Plus', category: 'Santé', rating: 4.9, image: '/api/placeholder/60/60' }
            ].map((vendor, index) => (
              <div key={index} className="text-center">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover"
                />
                <div className="text-sm font-medium">{vendor.name}</div>
                <div className="text-xs text-gray-600">{vendor.category}</div>
                <div className="text-xs text-yellow-600">⭐ {vendor.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="container py-4">
      <h2 className="text-lg font-semibold mb-4">📦 Mes Commandes</h2>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
            {/* En-tête commande */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={order.vendor.logo}
                  alt={order.vendor.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold">{order.vendor.name}</div>
                  <div className="text-sm text-gray-600">{order.orderNumber}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>⭐ {order.vendor.rating}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              <span className={`badge ${
                order.status === 'delivered' ? 'badge-success' :
                order.status === 'in_delivery' ? 'badge-primary' :
                order.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
              }`}>
                {getOrderStatusIcon(order.status)} {getOrderStatusText(order.status)}
              </span>
            </div>

            {/* Articles */}
            <div className="mb-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">Quantité: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)} F
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-3 mb-3">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatPrice(order.total)} F</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>{formatPrice(order.deliveryFee)} F</span>
              </div>
              <div className="flex justify-between font-semibold border-t mt-2 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total + order.deliveryFee)} F</span>
              </div>
            </div>

            {/* Livreur si en cours */}
            {order.status === 'in_delivery' && order.deliveryPerson && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={order.deliveryPerson.photo}
                    alt={order.deliveryPerson.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{order.deliveryPerson.name}</div>
                    <div className="text-xs text-gray-600">
                      ⭐ {order.deliveryPerson.rating} • Arrivée dans {order.estimatedTime}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${order.deliveryPerson.phone}`}
                      className="btn btn-outline btn-sm"
                    >
                      📞
                    </a>
                    <button className="btn btn-primary btn-sm">
                      📍 Suivre
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {order.status === 'delivered' && (
                <>
                  <button className="btn btn-outline btn-sm flex-1">
                    ⭐ Noter
                  </button>
                  <button className="btn btn-outline btn-sm flex-1">
                    🔄 Recommander
                  </button>
                </>
              )}
              {order.status === 'in_delivery' && (
                <button className="btn btn-primary btn-sm flex-1">
                  📍 Suivre en temps réel
                </button>
              )}
              {order.status === 'pending' && (
                <button className="btn btn-danger btn-sm flex-1">
                  ❌ Annuler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTaxi = () => (
    <div className="container py-4 space-y-6">
      <h2 className="text-lg font-semibold">🚕 Service Taxi</h2>
      
      {/* Course en cours */}
      {currentTaxiRide && currentTaxiRide.status !== 'completed' && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Course en cours</h3>
            <span className={`badge ${
              currentTaxiRide.status === 'requesting' ? 'badge-warning' :
              currentTaxiRide.status === 'driver_assigned' ? 'badge-info' :
              currentTaxiRide.status === 'driver_arriving' ? 'badge-primary' :
              currentTaxiRide.status === 'in_progress' ? 'badge-success' : 'badge-secondary'
            }`}>
              {getTaxiStatusIcon(currentTaxiRide.status)} {getTaxiStatusText(currentTaxiRide.status)}
            </span>
          </div>

          {/* Informations course */}
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">📍 Point de départ</div>
                <div className="text-sm text-gray-600">{currentTaxiRide.pickup.address}</div>
              </div>
            </div>
            
            <div className="w-px h-4 bg-gray-300 ml-5"></div>
            
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="font-medium text-sm">🎯 Destination</div>
                <div className="text-sm text-gray-600">{currentTaxiRide.destination.address}</div>
              </div>
            </div>
          </div>

          {/* Informations chauffeur */}
          {currentTaxiRide.driver && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentTaxiRide.driver.photo}
                  alt={currentTaxiRide.driver.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium">{currentTaxiRide.driver.name}</div>
                  <div className="text-sm text-gray-600">
                    {currentTaxiRide.driver.carModel} • {currentTaxiRide.driver.plateNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    ⭐ {currentTaxiRide.driver.rating} • Arrivée dans {currentTaxiRide.estimatedTime}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations course */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{currentTaxiRide.passengers}</div>
              <div className="text-xs text-gray-600">Passagers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{currentTaxiRide.distance}</div>
              <div className="text-xs text-gray-600">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">{formatPrice(currentTaxiRide.fare)} F</div>
              <div className="text-xs text-gray-600">Tarif</div>
            </div>
          </div>

          {/* Course de nuit */}
          {currentTaxiRide.isNightRide && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-indigo-800">
                <span>🌙</span>
                <span className="font-medium">Course de nuit</span>
              </div>
              <p className="text-sm text-indigo-700 mt-1">
                Tarif majoré de 20% entre 22h et 6h pour votre sécurité
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`tel:${currentTaxiRide.driver?.phone}`}
              className="btn btn-outline flex-1"
            >
              📞 Appeler
            </a>
            <button className="btn btn-primary flex-1">
              📍 Suivre sur carte
            </button>
          </div>
        </div>
      )}

      {/* Nouvelle course */}
      {!currentTaxiRide || currentTaxiRide.status === 'completed' ? (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-4">🚕 Réserver un taxi</h3>
          
          <div className="space-y-4">
            {/* Position actuelle */}
            <div className="form-group">
              <label className="form-label">📍 Point de départ</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-control flex-1"
                  placeholder="Saisir l'adresse de départ..."
                  defaultValue={currentLocation ? "Position actuelle" : ""}
                />
                <button className="btn btn-outline">
                  📍 Ma position
                </button>
              </div>
            </div>

            {/* Destination */}
            <div className="form-group">
              <label className="form-label">🎯 Destination</label>
              <input
                type="text"
                className="form-control"
                placeholder="Où souhaitez-vous aller ?"
              />
            </div>

            {/* Nombre de passagers */}
            <div className="form-group">
              <label className="form-label">👥 Nombre de passagers</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    className="btn btn-outline"
                  >
                    {num} {num === 1 ? 'passager' : 'passagers'}
                  </button>
                ))}
              </div>
            </div>

            {/* Type de course */}
            <div className="form-group">
              <label className="form-label">🕐 Type de course</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="btn btn-outline">
                  ☀️ Course de jour
                </button>
                <button className="btn btn-outline">
                  🌙 Course de nuit
                </button>
              </div>
            </div>

            {/* Estimation prix */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">Prix estimé</span>
                <span className="text-lg font-bold text-green-800">2.500 - 3.500 F</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                📍 Distance estimée: 5.2 km • ⏱️ Temps: 15 min
              </p>
            </div>

            {/* Sécurité */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">🔒 Votre sécurité</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Chauffeurs vérifiés et notés</li>
                <li>• Suivi GPS en temps réel</li>
                <li>• Partage de trajet avec contacts</li>
                <li>• Support 24h/24 disponible</li>
              </ul>
            </div>

            {/* Bouton réservation */}
            <button
              onClick={() => {
                // Simuler la création d'une nouvelle course
                setCurrentTaxiRide({
                  id: 'TAXI-' + Date.now(),
                  status: 'requesting',
                  pickup: {
                    address: 'Position actuelle',
                    location: currentLocation || { lat: 5.3364, lng: -4.0267 }
                  },
                  destination: {
                    address: 'Destination choisie',
                    location: { lat: 5.3167, lng: -4.0167 }
                  },
                  passengers: 1,
                  fare: 3000,
                  distance: '5.2 km',
                  estimatedTime: '15 min',
                  requestedAt: new Date().toISOString(),
                  isNightRide: new Date().getHours() >= 22 || new Date().getHours() <= 6
                });
                
                // Notification de demande
                notificationService.showNotification({
                  title: '🚕 Recherche de chauffeur...',
                  body: 'Nous cherchons un chauffeur disponible dans votre zone',
                  type: 'order_new',
                  vibrate: [200, 100, 200]
                });
              }}
              className="w-full btn btn-primary btn-lg"
            >
              🚕 Réserver maintenant
            </button>
          </div>
        </div>
      ) : null}

      {/* Historique récent */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">📋 Courses récentes</h3>
        </div>
        <div className="divide-y">
          {[
            { time: '16:30', destination: 'Plateau, Avenue Chardy', fare: 3500, date: 'Hier' },
            { time: '14:20', destination: 'Marcory Zone 4', fare: 2800, date: 'Avant-hier' },
            { time: '09:15', destination: 'Aéroport FHB', fare: 8500, date: '3 nov' }
          ].map((ride, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{ride.destination}</div>
                <div className="text-sm text-gray-600">{ride.date} • {ride.time}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatPrice(ride.fare)} F</div>
                <button className="text-xs text-primary">Refaire</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="container py-4 space-y-6">
      <h2 className="text-lg font-semibold">👤 Mon Profil</h2>
      
      {/* Informations personnelles */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-success">✅ Compte vérifié</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-gray-600">Commandes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-success">8</div>
          <div className="text-sm text-gray-600">Courses taxi</div>
        </div>
      </div>

      {/* Paramètres */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">⚙️ Paramètres</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span>🔔 Notifications</span>
            <button className="btn btn-success btn-sm">
              ✅ Activé
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>📍 Géolocalisation</span>
            <button className="btn btn-success btn-sm">
              ✅ Activé
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>💳 Mode de paiement</span>
            <button className="btn btn-outline btn-sm">
              💰 Mobile Money
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => notificationService.testNotification()}
          className="w-full btn btn-outline"
        >
          🧪 Tester notifications
        </button>
        <button className="w-full btn btn-outline">
          📞 Support client
        </button>
        <button className="w-full btn btn-outline">
          💳 Historique paiements
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
            <div className="flex items-center gap-3">
              <Logo size="small" showText={false} />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Djassa
                </h1>
                <p className="text-sm text-gray-600">
                  Votre marketplace mobile
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Navigation Tests */}
              <button 
                onClick={() => (window as any).navigate?.('explore')}
                className="p-1 text-xs bg-blue-500 text-white rounded"
              >
                Explorer
              </button>
              <button 
                onClick={() => (window as any).navigate?.('services')}
                className="p-1 text-xs bg-green-500 text-white rounded"
              >
                Services
              </button>
              {/* Accès Admin Rapide */}
              <button 
                onClick={() => (window as any).navigate?.('admin')}
                className="p-1 text-xs bg-red-500 text-white rounded font-bold"
                title="Accès Admin Direct"
              >
                🔧 ADMIN
              </button>
              <button className="p-2 text-gray-600">
                🔔
              </button>
              <button className="p-2 text-gray-600">
                💬
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderTabButtons()}

      {activeTab === 'home' && renderHome()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'taxi' && renderTaxi()}
      {activeTab === 'profile' && renderProfile()}
    </div>
  );
};

export default CustomerPage;