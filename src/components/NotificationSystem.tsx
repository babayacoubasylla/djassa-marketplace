import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'order_update' | 'delivery_status' | 'promotion' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

interface NotificationSystemProps {
  children: React.ReactNode;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Demander la permission pour les notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setPermission(permission);
        });
      }
    }

    // Charger les notifications existantes
    const savedNotifications = localStorage.getItem('djassa_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Simuler des notifications en temps réel
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance toutes les 10 secondes
        addNotification({
          type: 'delivery_status',
          title: 'Mise à jour de livraison',
          message: 'Votre commande #ORD-001 est en route vers vous!',
          icon: '🚚'
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Garder max 50 notifications
      localStorage.setItem('djassa_notifications', JSON.stringify(updated));
      return updated;
    });

    // Afficher une notification native si autorisé
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id
      });
    }

    // Afficher une notification toast personnalisée
    showToastNotification(newNotification);
  };

  const showToastNotification = (notification: Notification) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 max-w-sm animate-slide-in-right';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl">${notification.icon || '🔔'}</div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">${notification.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(toast);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      localStorage.setItem('djassa_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      localStorage.setItem('djassa_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('djassa_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_update': return '📦';
      case 'delivery_status': return '🚚';
      case 'promotion': return '🎉';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return 'À l\'instant';
  };

  // Ajouter des notifications de démonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length === 0) {
        const demoNotifications: Notification[] = [
          {
            id: '1',
            type: 'delivery_status',
            title: 'Commande en route',
            message: 'Votre burger arrive dans 10 minutes!',
            timestamp: Date.now() - 300000, // 5 min ago
            read: false,
            icon: '🚚'
          },
          {
            id: '2',
            type: 'promotion',
            title: 'Offre spéciale',
            message: '20% de réduction sur votre prochaine commande',
            timestamp: Date.now() - 3600000, // 1h ago
            read: true,
            icon: '🎉'
          }
        ];
        setNotifications(demoNotifications);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
      
      {/* Bouton de notification */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed top-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des notifications */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-hidden flex flex-col animate-slide-in-right">
            {/* En-tête */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">🔔 Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary hover:underline"
                  >
                    Tout marquer lu
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-sm text-danger hover:underline"
                  >
                    Tout effacer
                  </button>
                </div>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">🔔</div>
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {notification.icon || getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-primary' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Options des notifications */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  if (permission === 'default') {
                    Notification.requestPermission().then(setPermission);
                  }
                }}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                  permission === 'granted'
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary-dark'
                } transition-colors`}
              >
                {permission === 'granted' ? '✅ Notifications activées' : 
                 permission === 'denied' ? '❌ Notifications bloquées' : 
                 '🔔 Activer les notifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default NotificationSystem;