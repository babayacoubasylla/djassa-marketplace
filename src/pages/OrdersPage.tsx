import React, { useState, useEffect } from 'react';
import DeliveryTracking from '../components/DeliveryTracking';

interface Order {
  id: string;
  type: 'restaurant' | 'course' | 'colis';
  title: string;
  vendor: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'pickup' | 'transit' | 'delivered' | 'cancelled';
  orderTime: string;
  deliveryTime?: string;
  deliveryPerson?: {
    name: string;
    phone: string;
    photo?: string;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  address: {
    pickup: string;
    delivery: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulation de commandes
    setOrders([
      {
        id: 'ORD-001',
        type: 'restaurant',
        title: 'Menu Burger Deluxe',
        vendor: 'Fast Food Palace',
        total: 8500,
        status: 'transit',
        orderTime: '2024-01-15T12:30:00',
        deliveryTime: '45 min',
        deliveryPerson: {
          name: 'Kouame Jean',
          phone: '+225 07 12 34 56 78'
        },
        items: [
          { name: 'Burger Deluxe', quantity: 1, price: 5000 },
          { name: 'Frites', quantity: 1, price: 2000 },
          { name: 'Coca Cola', quantity: 1, price: 1500 }
        ],
        address: {
          pickup: 'Fast Food Palace - Cocody',
          delivery: '123 Rue des Jardins, Cocody'
        }
      },
      {
        id: 'ORD-002',
        type: 'course',
        title: 'Course Treichville → Cocody',
        vendor: 'DjassaRide',
        total: 2500,
        status: 'confirmed',
        orderTime: '2024-01-15T14:15:00',
        deliveryTime: '20 min',
        deliveryPerson: {
          name: 'Diabate Moussa',
          phone: '+225 05 87 65 43 21'
        },
        address: {
          pickup: 'Marché de Treichville',
          delivery: 'Université Felix Houphouët-Boigny'
        }
      },
      {
        id: 'ORD-003',
        type: 'colis',
        title: 'Envoi de documents',
        vendor: 'DjassaExpress',
        total: 1500,
        status: 'preparing',
        orderTime: '2024-01-15T15:00:00',
        deliveryTime: '30 min',
        address: {
          pickup: 'Bureau Central - Plateau',
          delivery: 'Résidence des Ambassades - Cocody'
        }
      },
      {
        id: 'ORD-004',
        type: 'restaurant',
        title: 'Pizza Margherita',
        vendor: 'Pizza Corner',
        total: 12000,
        status: 'delivered',
        orderTime: '2024-01-14T19:30:00',
        deliveryTime: 'Livré',
        deliveryPerson: {
          name: 'Kone Fatou',
          phone: '+225 01 23 45 67 89'
        },
        address: {
          pickup: 'Pizza Corner - Marcory',
          delivery: '456 Avenue de la République'
        }
      }
    ]);
  }, []);

  const activeOrders = orders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );
  const orderHistory = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', text: 'En attente', color: 'text-warning' };
      case 'confirmed':
        return { icon: '✅', text: 'Confirmé', color: 'text-success' };
      case 'preparing':
        return { icon: '👨‍🍳', text: 'Préparation', color: 'text-primary' };
      case 'pickup':
        return { icon: '🏪', text: 'Récupération', color: 'text-primary' };
      case 'transit':
        return { icon: '🚚', text: 'En route', color: 'text-primary' };
      case 'delivered':
        return { icon: '✅', text: 'Livré', color: 'text-success' };
      case 'cancelled':
        return { icon: '❌', text: 'Annulé', color: 'text-danger' };
    }
  };

  const getTypeInfo = (type: Order['type']) => {
    switch (type) {
      case 'restaurant':
        return { icon: '🍽️', name: 'Restaurant' };
      case 'course':
        return { icon: '🚗', name: 'Course' };
      case 'colis':
        return { icon: '📦', name: 'Colis' };
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const statusInfo = getStatusInfo(order.status);
    const typeInfo = getTypeInfo(order.type);

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{typeInfo.icon}</span>
            <div>
              <h3 className="font-semibold">{order.title}</h3>
              <p className="text-sm text-text-muted">{order.vendor}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.text}
            </div>
            <div className="text-lg font-bold text-primary">
              {order.total.toLocaleString()} FCFA
            </div>
          </div>
        </div>

        <div className="text-sm text-text-muted mb-3">
          <div className="flex items-center gap-1 mb-1">
            <span>📅</span>
            <span>Commandé le {new Date(order.orderTime).toLocaleString('fr-FR')}</span>
          </div>
          {order.deliveryTime && (
            <div className="flex items-center gap-1 mb-1">
              <span>⏱️</span>
              <span>{order.deliveryTime}</span>
            </div>
          )}
          <div className="flex items-center gap-1 mb-1">
            <span>📍</span>
            <span>{order.address.pickup} → {order.address.delivery}</span>
          </div>
        </div>

        {order.deliveryPerson && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              🏍️
            </div>
            <div className="flex-1">
              <div className="font-medium">{order.deliveryPerson.name}</div>
              <div className="text-sm text-text-muted">Votre livreur</div>
            </div>
            <a 
              href={`tel:${order.deliveryPerson.phone}`}
              className="btn btn-outline btn-sm"
            >
              📞
            </a>
          </div>
        )}

        {order.items && order.items.length > 0 && (
          <div className="mb-3">
            <h4 className="font-medium mb-2">📋 Détails de la commande :</h4>
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{item.price.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {['transit', 'pickup', 'nearby'].includes(order.status) && order.deliveryPerson && (
            <button 
              onClick={() => setTrackingOrder(order)}
              className="btn btn-primary flex-1"
            >
              📍 Suivre en temps réel
            </button>
          )}
          
          {order.status === 'delivered' && (
            <button className="btn btn-success flex-1">
              ⭐ Noter la livraison
            </button>
          )}
          
          {['pending', 'confirmed'].includes(order.status) && (
            <button className="btn btn-danger flex-1">
              ❌ Annuler
            </button>
          )}

          <button className="btn btn-outline flex-1">
            📄 Détails
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-text-primary">📦 Mes Commandes</h1>
          <p className="text-text-muted mt-1">Suivez vos commandes en temps réel</p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl text-primary font-bold">{activeOrders.length}</div>
            <div className="text-sm text-text-muted">Commandes actives</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl text-success font-bold">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-text-muted">Commandes livrées</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl text-primary font-bold">
              {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </div>
            <div className="text-sm text-text-muted">Total dépensé (FCFA)</div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🔄 Commandes actives ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            📚 Historique ({orderHistory.length})
          </button>
        </div>

        {/* Liste des commandes */}
        <div>
          {activeTab === 'active' && (
            <div>
              {activeOrders.length > 0 ? (
                activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <div className="text-4xl mb-3">📦</div>
                  <h3 className="text-lg font-semibold mb-2">Aucune commande active</h3>
                  <p className="text-text-muted mb-4">
                    Vous n'avez aucune commande en cours pour le moment
                  </p>
                  <button className="btn btn-primary">
                    🛒 Passer une commande
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {orderHistory.length > 0 ? (
                orderHistory.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                  <p className="text-text-muted">
                    Votre historique de commandes apparaîtra ici
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de suivi */}
      {trackingOrder && trackingOrder.deliveryPerson && (
        <DeliveryTracking
          deliveryId={trackingOrder.id}
          deliveryPersonName={trackingOrder.deliveryPerson.name}
          deliveryPersonPhone={trackingOrder.deliveryPerson.phone}
          estimatedTime={30} // minutes
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;