import React, { useState, useEffect } from 'react';

interface DeliveryTrackingProps {
  deliveryId: string;
  deliveryPersonName: string;
  deliveryPersonPhone: string;
  estimatedTime: number;
  onClose: () => void;
}

interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({
  deliveryId,
  deliveryPersonName,
  deliveryPersonPhone,
  estimatedTime,
  onClose
}) => {
  const [deliveryLocation, setDeliveryLocation] = useState<LocationUpdate | null>(null);
  const [status, setStatus] = useState<'preparing' | 'pickup' | 'transit' | 'nearby' | 'delivered'>('preparing');
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);

  // Simulation du suivi GPS en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulation de mise à jour de position
      setDeliveryLocation({
        lat: 5.3364 + (Math.random() - 0.5) * 0.01,
        lng: -3.9732 + (Math.random() - 0.5) * 0.01,
        timestamp: Date.now(),
        speed: Math.random() * 50 + 20 // km/h
      });

      // Simulation du décompte
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  // Simulation changement de statut
  useEffect(() => {
    const statusTimer = setTimeout(() => {
      if (status === 'preparing') setStatus('pickup');
      else if (status === 'pickup') setStatus('transit');
      else if (status === 'transit') setStatus('nearby');
    }, 10000);

    return () => clearTimeout(statusTimer);
  }, [status]);

  const getStatusInfo = () => {
    switch (status) {
      case 'preparing':
        return { icon: '👨‍🍳', text: 'Préparation en cours', color: 'text-warning' };
      case 'pickup':
        return { icon: '🏪', text: 'Récupération commande', color: 'text-primary' };
      case 'transit':
        return { icon: '🚚', text: 'En route vers vous', color: 'text-primary' };
      case 'nearby':
        return { icon: '📍', text: 'Arrivée imminente', color: 'text-success' };
      case 'delivered':
        return { icon: '✅', text: 'Livré avec succès', color: 'text-success' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">📍 Suivi en temps réel</h3>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary">
              ✕
            </button>
          </div>
          <p className="text-sm text-text-muted mt-1">Commande #{deliveryId}</p>
        </div>

        {/* Statut actuel */}
        <div className="p-6 text-center border-b">
          <div className="text-4xl mb-2">{statusInfo.icon}</div>
          <h4 className={`text-lg font-semibold ${statusInfo.color}`}>{statusInfo.text}</h4>
          <p className="text-sm text-text-muted mt-1">
            Temps estimé: {Math.floor(timeRemaining / 60)}h{timeRemaining % 60}min
          </p>
        </div>

        {/* Étapes de livraison */}
        <div className="p-6 border-b">
          <h4 className="font-semibold mb-4">📋 Étapes de livraison</h4>
          <div className="space-y-4">
            <div className={`flex items-center gap-3 ${status !== 'preparing' ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                status === 'preparing' ? 'bg-warning' : 'bg-success'
              }`}>
                {status === 'preparing' ? '🔄' : '✅'}
              </div>
              <div>
                <div className="font-medium">Préparation</div>
                <div className="text-sm text-text-muted">
                  {status === 'preparing' ? 'En cours...' : 'Terminé'}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${status !== 'pickup' ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                status === 'pickup' ? 'bg-primary' : status === 'preparing' ? 'bg-gray-300' : 'bg-success'
              }`}>
                {status === 'pickup' ? '🔄' : ['transit', 'nearby', 'delivered'].includes(status) ? '✅' : '⏳'}
              </div>
              <div>
                <div className="font-medium">Récupération</div>
                <div className="text-sm text-text-muted">
                  {status === 'pickup' ? 'Le livreur récupère votre commande' : 
                   ['transit', 'nearby', 'delivered'].includes(status) ? 'Terminé' : 'En attente'}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${status !== 'transit' ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                status === 'transit' ? 'bg-primary' : ['nearby', 'delivered'].includes(status) ? 'bg-success' : 'bg-gray-300'
              }`}>
                {status === 'transit' ? '🔄' : ['nearby', 'delivered'].includes(status) ? '✅' : '⏳'}
              </div>
              <div>
                <div className="font-medium">En route</div>
                <div className="text-sm text-text-muted">
                  {status === 'transit' ? 'Le livreur est en route' : 
                   ['nearby', 'delivered'].includes(status) ? 'Terminé' : 'En attente'}
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${!['nearby', 'delivered'].includes(status) ? 'opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                status === 'nearby' ? 'bg-success animate-pulse' : status === 'delivered' ? 'bg-success' : 'bg-gray-300'
              }`}>
                {status === 'delivered' ? '✅' : status === 'nearby' ? '📍' : '⏳'}
              </div>
              <div>
                <div className="font-medium">Livraison</div>
                <div className="text-sm text-text-muted">
                  {status === 'delivered' ? 'Livré avec succès' : 
                   status === 'nearby' ? 'Arrivée imminente!' : 'En attente'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Position du livreur */}
        {deliveryLocation && ['pickup', 'transit', 'nearby'].includes(status) && (
          <div className="p-6 border-b">
            <h4 className="font-semibold mb-4">🗺️ Position du livreur</h4>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="text-sm text-text-muted mb-2">
                Dernière position: {new Date(deliveryLocation.timestamp).toLocaleTimeString('fr-FR')}
              </p>
              {deliveryLocation.speed && (
                <p className="text-sm text-text-muted">
                  Vitesse: {deliveryLocation.speed.toFixed(0)} km/h
                </p>
              )}
              <button 
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${deliveryLocation.lat},${deliveryLocation.lng}`;
                  window.open(url, '_blank');
                }}
                className="btn btn-primary btn-sm mt-3"
              >
                🗺️ Voir sur la carte
              </button>
            </div>
          </div>
        )}

        {/* Informations livreur */}
        <div className="p-6 border-b">
          <h4 className="font-semibold mb-4">🚚 Votre livreur</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
              🏍️
            </div>
            <div className="flex-1">
              <div className="font-medium">{deliveryPersonName}</div>
              <div className="text-sm text-text-muted">Livreur expérimenté</div>
            </div>
            <a 
              href={`tel:${deliveryPersonPhone}`}
              className="btn btn-outline btn-sm"
            >
              📞 Appeler
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const message = `Bonjour, je souhaite avoir des nouvelles de ma commande #${deliveryId}`;
                const url = `https://wa.me/${deliveryPersonPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className="btn btn-primary flex-1"
            >
              💬 Contacter via WhatsApp
            </button>
            {status === 'delivered' && (
              <button className="btn btn-success flex-1">
                ⭐ Noter le livreur
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;