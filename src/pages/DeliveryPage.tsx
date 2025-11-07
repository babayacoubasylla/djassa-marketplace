import React, { useState, useEffect } from 'react';
import { RESTAURANTS_DATA, DELIVERY_PERSONS_DATA, DELIVERY_SERVICES } from '../services/dataService';

const DeliveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [deliveryType, setDeliveryType] = useState('food');
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [packageForm, setPackageForm] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    senderLocation: null as { lat: number; lng: number } | null,
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverLocation: null as { lat: number; lng: number } | null,
    packageDescription: '',
    packageValue: '',
    packageWeight: '',
    instructions: '',
    urgency: 'normal'
  });

  // Obtenir la géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Erreur géolocalisation:', error);
          // Position par défaut (Abidjan)
          setUserLocation({ lat: 5.3364, lng: -3.9732 });
        }
      );
    }
  }, []);

  // Calculer distance entre deux points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Trouver livreurs disponibles
  const getAvailableDeliverers = () => {
    return DELIVERY_PERSONS_DATA.filter(delivery => 
      delivery.isAvailable && 
      delivery.services.includes(DELIVERY_SERVICES.find(s => s.id === deliveryType)?.name || '')
    );
  };

  // Ajouter au panier
  const addToCart = (item: any) => {
    setCart(prev => [...prev, { ...item, quantity: 1, restaurantId: selectedRestaurant?.id }]);
  };

  // Total du panier
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Formater numéro ivoirien
  const formatIvorianPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('225')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+225${cleaned.substring(1)}`;
    if (cleaned.length === 8) return `+225${cleaned}`;
    return phone;
  };

  // Valider numéro ivoirien
  const isValidIvorianPhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return (
      (cleaned.startsWith('2250') && cleaned.length === 12) ||
      (cleaned.startsWith('0') && cleaned.length === 10) ||
      (cleaned.length === 8)
    );
  };

  // Obtenir position GPS
  const getCurrentLocation = (callback: (location: { lat: number; lng: number }) => void) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (_error) => {
          alert('Erreur de géolocalisation. Veuillez activer le GPS.');
        }
      );
    }
  };

  // Envoyer notification WhatsApp
  const sendWhatsAppNotification = (packageData: any, trackingNumber: string) => {
    const serviceNumber = '0709378225';
    const message = `🚚 DJASSA LIVRAISON - Nouveau Colis #${trackingNumber}

📦 EXPÉDITEUR:
Nom: ${packageData.senderName}
Tél: ${packageData.senderPhone}

📨 DESTINATAIRE:
Nom: ${packageData.receiverName}  
Tél: ${packageData.receiverPhone}
Adresse: ${packageData.receiverAddress}

📋 CONTENU: ${packageData.packageDescription}
⚖️ POIDS: ${packageData.packageWeight}kg
💰 VALEUR: ${packageData.packageValue} FCFA

🏍️ LIVREUR: ${selectedDelivery?.name}
📱 Contact: ${selectedDelivery?.phone}

🎯 Suivez votre colis: djassa-ci.web.app/tracking/${trackingNumber}

Service client: ${formatIvorianPhone(serviceNumber)}`;
    
    // Notification à l'expéditeur
    const senderWhatsApp = `https://wa.me/${formatIvorianPhone(packageData.senderPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Notification au destinataire
    const receiverMessage = `📦 COLIS EN ROUTE - DJASSA

Bonjour ${packageData.receiverName},

Un colis vous est envoyé par ${packageData.senderName}.

🚚 Livreur: ${selectedDelivery?.name}
📱 Contact: ${selectedDelivery?.phone}
📋 Contenu: ${packageData.packageDescription}

Numéro de suivi: #${trackingNumber}

Service client: ${formatIvorianPhone(serviceNumber)}`;
    
    const receiverWhatsApp = `https://wa.me/${formatIvorianPhone(packageData.receiverPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(receiverMessage)}`;
    
    // Ouvrir notifications (l'utilisateur choisira)
    window.open(senderWhatsApp, '_blank');
    setTimeout(() => {
      if (confirm('Voulez-vous notifier le destinataire ?')) {
        window.open(receiverWhatsApp, '_blank');
      }
    }, 2000);
  };

  // Traiter l'envoi du colis
  const submitPackage = () => {
    if (!selectedDelivery) {
      alert('Veuillez sélectionner un livreur');
      return;
    }

    // Validation
    if (!packageForm.senderName || !packageForm.receiverName) {
      alert('Nom expéditeur et destinataire requis');
      return;
    }

    if (!isValidIvorianPhone(packageForm.senderPhone) || !isValidIvorianPhone(packageForm.receiverPhone)) {
      alert('Numéros de téléphone invalides (format ivoirien requis)');
      return;
    }

    if (!packageForm.packageDescription || !packageForm.receiverAddress) {
      alert('Description du colis et adresse destinataire requis');
      return;
    }

    // Générer numéro de suivi
    const trackingNumber = `DJ${Date.now().toString().slice(-6)}`;
    
    // Envoyer notifications
    sendWhatsAppNotification(packageForm, trackingNumber);
    
    // Confirmer
    alert(`✅ Colis créé avec succès!\nNuméro de suivi: ${trackingNumber}\nLes notifications WhatsApp ont été envoyées.`);
    
    // Reset
    // setShowPackageForm(false);
    setPackageForm({
      senderName: '',
      senderPhone: '',
      senderAddress: '',
      senderLocation: null,
      receiverName: '',
      receiverPhone: '',
      receiverAddress: '',
      receiverLocation: null,
      packageDescription: '',
      packageValue: '',
      packageWeight: '',
      instructions: '',
      urgency: 'normal'
    });
  };

  const tabs = [
    { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
    { id: 'package', name: 'Envoi Colis', icon: '�' },
    { id: 'delivery', name: 'Services Livraison', icon: '�' },
    { id: 'tracking', name: 'Suivi GPS', icon: '📍' }
  ];

  return (
    <div className="container mt-8 mb-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">🍽️ Restaurants & Livraison</h1>
          <p className="text-text-secondary">Commandez et faites-vous livrer partout à Abidjan</p>
        </div>
        {userLocation && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-success">
              <span>📍</span>
              <span>Position GPS détectée</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="card mb-8">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:bg-bg-secondary'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Panier flottant */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2 mb-2">
            <span>🛒</span>
            <span className="font-semibold">{cart.length} article(s)</span>
          </div>
          <div className="text-lg font-bold">{cartTotal.toLocaleString()} FCFA</div>
          <button className="btn btn-secondary btn-sm mt-2 btn-full">
            Valider commande
          </button>
        </div>
      )}

      {/* Contenu des onglets */}
      {activeTab === 'restaurants' && (
        <div>
          {!selectedRestaurant ? (
            // Liste des restaurants
            <div className="grid gap-6">
              {RESTAURANTS_DATA.map(restaurant => {
                const distance = userLocation ? 
                  calculateDistance(
                    userLocation.lat, userLocation.lng,
                    restaurant.location.coordinates.lat, restaurant.location.coordinates.lng
                  ) : null;

                return (
                  <div key={restaurant.id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                          <span className="badge badge-primary">{restaurant.category}</span>
                        </div>
                        <p className="text-text-secondary mb-2">{restaurant.description}</p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>⭐ {restaurant.rating}</span>
                          <span>🕒 {restaurant.deliveryTime}</span>
                          <span>🚚 {restaurant.deliveryFee.toLocaleString()} FCFA</span>
                          {distance && <span>📍 {distance.toFixed(1)} km</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {restaurant.specialties.slice(0, 3).map((specialty: string, index: number) => (
                        <span key={index} className="badge badge-outline">{specialty}</span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-text-muted">Commande min: {restaurant.minOrder.toLocaleString()} FCFA</div>
                        <div className="text-sm text-text-muted">📍 {restaurant.location.address}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedRestaurant(restaurant)}
                          className="btn btn-primary"
                        >
                          Voir menu
                        </button>
                        <a 
                          href={`https://wa.me/${restaurant.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                        >
                          📱 WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Menu du restaurant sélectionné
            <div>
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setSelectedRestaurant(null)}
                  className="btn btn-outline"
                >
                  ← Retour
                </button>
                <div>
                  <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                  <p className="text-text-secondary">{selectedRestaurant.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {selectedRestaurant.menu.map((item: any) => (
                  <div key={item.id} className="card">
                    <h4 className="font-semibold mb-2">{item.name}</h4>
                    <p className="text-sm text-text-muted mb-2">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        {item.price.toLocaleString()} FCFA
                      </span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="btn btn-primary btn-sm"
                      >
                        + Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'delivery' && (
        <div>
          <div className="grid gap-6 mb-8">
            <h3 className="text-xl font-semibold">🚚 Choisissez votre type de livraison</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {DELIVERY_SERVICES.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setDeliveryType(service.id)}
                  className={`card cursor-pointer transition-all ${
                    deliveryType === service.id ? 'ring-2 ring-primary bg-primary-light' : ''
                  }`}
                >
                  <div className="text-4xl mb-4 text-center">{service.icon}</div>
                  <h4 className="font-semibold text-center mb-2">{service.name}</h4>
                  <p className="text-sm text-text-muted text-center mb-4">{service.description}</p>
                  <div className="text-center">
                    <div className="text-sm">À partir de</div>
                    <div className="text-lg font-bold text-primary">{service.basePrice.toLocaleString()} FCFA</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-6">📍 Livreurs disponibles près de vous</h3>
            
            <div className="grid gap-4">
              {getAvailableDeliverers().map(deliverer => {
                const distance = userLocation ? 
                  calculateDistance(
                    userLocation.lat, userLocation.lng,
                    deliverer.currentLocation.lat, deliverer.currentLocation.lng
                  ) : null;

                return (
                  <div key={deliverer.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{deliverer.avatar}</div>
                      <div>
                        <h4 className="font-semibold">{deliverer.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>⭐ {deliverer.rating}</span>
                          <span>🚚 {deliverer.vehicle}</span>
                          <span>📦 {deliverer.deliveriesCount} livraisons</span>
                          {distance && <span>📍 {distance.toFixed(1)} km</span>}
                        </div>
                        <div className="text-sm text-text-muted">Zone: {deliverer.zone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="badge badge-success">Disponible</span>
                      <button 
                        onClick={() => {
                          setSelectedDelivery(deliverer);
                          if (deliveryType === 'package') {
                            setActiveTab('package');
                          }
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Choisir
                      </button>
                      <a 
                        href={`tel:${deliverer.phone}`}
                        className="btn btn-outline btn-sm"
                      >
                        📞
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'package' && (
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">📦 Formulaire d'envoi de colis</h3>
            
            {!selectedDelivery ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🚚</div>
                <h4 className="font-semibold mb-2">Sélectionnez d'abord un livreur</h4>
                <p className="text-text-muted mb-4">Rendez-vous dans l'onglet "Services Livraison" pour choisir votre livreur</p>
                <button 
                  onClick={() => setActiveTab('delivery')}
                  className="btn btn-primary"
                >
                  Choisir un livreur
                </button>
              </div>
            ) : (
              <div>
                {/* Livreur sélectionné */}
                <div className="bg-success-light p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{selectedDelivery.avatar}</div>
                    <div>
                      <h4 className="font-semibold">Livreur: {selectedDelivery.name}</h4>
                      <p className="text-text-muted">{selectedDelivery.vehicle} - Zone: {selectedDelivery.zone}</p>
                      <p className="text-text-muted">⭐ {selectedDelivery.rating} - {selectedDelivery.deliveriesCount} livraisons</p>
                    </div>
                    <div className="ml-auto">
                      <button 
                        onClick={() => setSelectedDelivery(null)}
                        className="btn btn-outline btn-sm"
                      >
                        Changer
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations expéditeur */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary">📤 Expéditeur (Vous)</h4>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom complet *</label>
                      <input
                        type="text"
                        value={packageForm.senderName}
                        onChange={(e) => setPackageForm({...packageForm, senderName: e.target.value})}
                        className="input-field"
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone * (format ivoirien)</label>
                      <input
                        type="tel"
                        value={packageForm.senderPhone}
                        onChange={(e) => setPackageForm({...packageForm, senderPhone: e.target.value})}
                        className={`input-field ${packageForm.senderPhone && !isValidIvorianPhone(packageForm.senderPhone) ? 'border-red-500' : ''}`}
                        placeholder="07 XX XX XX XX ou 05 XX XX XX XX"
                      />
                      {packageForm.senderPhone && !isValidIvorianPhone(packageForm.senderPhone) && (
                        <p className="text-red-500 text-sm mt-1">Format invalide (ex: 07 12 34 56 78)</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse de collecte</label>
                      <textarea
                        value={packageForm.senderAddress}
                        onChange={(e) => setPackageForm({...packageForm, senderAddress: e.target.value})}
                        className="input-field"
                        rows={3}
                        placeholder="Votre adresse complète"
                      />
                    </div>

                    <button
                      onClick={() => getCurrentLocation((location) => 
                        setPackageForm({...packageForm, senderLocation: location})
                      )}
                      className="btn btn-outline btn-full"
                    >
                      📍 Utiliser ma position GPS
                    </button>
                    
                    {packageForm.senderLocation && (
                      <div className="text-sm text-success">
                        ✅ Position GPS enregistrée ({packageForm.senderLocation.lat.toFixed(4)}, {packageForm.senderLocation.lng.toFixed(4)})
                      </div>
                    )}
                  </div>

                  {/* Informations destinataire */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary">📥 Destinataire</h4>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom du destinataire *</label>
                      <input
                        type="text"
                        value={packageForm.receiverName}
                        onChange={(e) => setPackageForm({...packageForm, receiverName: e.target.value})}
                        className="input-field"
                        placeholder="Nom complet du destinataire"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone destinataire * (format ivoirien)</label>
                      <input
                        type="tel"
                        value={packageForm.receiverPhone}
                        onChange={(e) => setPackageForm({...packageForm, receiverPhone: e.target.value})}
                        className={`input-field ${packageForm.receiverPhone && !isValidIvorianPhone(packageForm.receiverPhone) ? 'border-red-500' : ''}`}
                        placeholder="07 XX XX XX XX ou 05 XX XX XX XX"
                      />
                      {packageForm.receiverPhone && !isValidIvorianPhone(packageForm.receiverPhone) && (
                        <p className="text-red-500 text-sm mt-1">Format invalide (ex: 05 67 89 01 23)</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Adresse de livraison *</label>
                      <textarea
                        value={packageForm.receiverAddress}
                        onChange={(e) => setPackageForm({...packageForm, receiverAddress: e.target.value})}
                        className="input-field"
                        rows={3}
                        placeholder="Adresse complète du destinataire"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Position GPS destinataire (optionnel)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Collez le lien Google Maps"
                          className="input-field flex-1"
                          onChange={(e) => {
                            const url = e.target.value;
                            const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                            if (match) {
                              setPackageForm({
                                ...packageForm, 
                                receiverLocation: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
                              });
                            }
                          }}
                        />
                        <button
                          onClick={() => window.open('https://maps.google.com', '_blank')}
                          className="btn btn-outline btn-sm"
                        >
                          🗺️ Maps
                        </button>
                      </div>
                      {packageForm.receiverLocation && (
                        <div className="text-sm text-success mt-1">
                          ✅ Position GPS destinataire enregistrée
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails du colis */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-primary mb-4">📦 Détails du colis</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Description du contenu *</label>
                      <textarea
                        value={packageForm.packageDescription}
                        onChange={(e) => setPackageForm({...packageForm, packageDescription: e.target.value})}
                        className="input-field"
                        rows={3}
                        placeholder="Décrivez le contenu du colis (documents, vêtements, électronique...)"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Valeur estimée (FCFA)</label>
                        <input
                          type="number"
                          value={packageForm.packageValue}
                          onChange={(e) => setPackageForm({...packageForm, packageValue: e.target.value})}
                          className="input-field"
                          placeholder="Valeur en FCFA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Poids approximatif (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={packageForm.packageWeight}
                          onChange={(e) => setPackageForm({...packageForm, packageWeight: e.target.value})}
                          className="input-field"
                          placeholder="Poids en kg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Urgence</label>
                        <select
                          value={packageForm.urgency}
                          onChange={(e) => setPackageForm({...packageForm, urgency: e.target.value})}
                          className="input-field"
                        >
                          <option value="normal">Normal (24-48h)</option>
                          <option value="urgent">Urgent (même jour)</option>
                          <option value="express">Express (2-4h)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Instructions spéciales</label>
                    <textarea
                      value={packageForm.instructions}
                      onChange={(e) => setPackageForm({...packageForm, instructions: e.target.value})}
                      className="input-field"
                      rows={2}
                      placeholder="Instructions particulières pour le livreur..."
                    />
                  </div>
                </div>

                {/* Résumé et validation */}
                <div className="mt-8 bg-bg-secondary p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">💰 Résumé de la livraison</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Tarif de base:</span>
                        <span>1500 FCFA</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Distance estimée:</span>
                        <span>~3 km</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Coût distance (300/km):</span>
                        <span>900 FCFA</span>
                      </div>
                      {packageForm.urgency !== 'normal' && (
                        <div className="flex justify-between mb-2">
                          <span>Supplément {packageForm.urgency}:</span>
                          <span>{packageForm.urgency === 'urgent' ? '1000' : '2000'} FCFA</span>
                        </div>
                      )}
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">
                          {2400 + (packageForm.urgency === 'urgent' ? 1000 : packageForm.urgency === 'express' ? 2000 : 0)} FCFA
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-warning-light p-3 rounded">
                        <h5 className="font-semibold text-sm">📱 Service client</h5>
                        <p className="text-sm">0709378225 (WhatsApp disponible)</p>
                      </div>
                      
                      <div className="bg-info-light p-3 rounded">
                        <h5 className="font-semibold text-sm">📋 Notifications</h5>
                        <p className="text-sm">WhatsApp automatique à l'expéditeur et destinataire</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={submitPackage}
                      className="btn btn-primary btn-lg flex-1"
                      disabled={!packageForm.senderName || !packageForm.receiverName || !packageForm.packageDescription}
                    >
                      📦 Confirmer l'envoi du colis
                    </button>
                    <button
                      onClick={() => setActiveTab('delivery')}
                      className="btn btn-outline"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-4">📍 Suivi GPS en temps réel</h3>
            
            {selectedDelivery ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{selectedDelivery.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{selectedDelivery.name}</h4>
                    <p className="text-text-muted">Livreur assigné - {selectedDelivery.vehicle}</p>
                  </div>
                  <span className="badge badge-success">En route</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">1</div>
                      <div>
                        <div className="font-medium">Commande confirmée</div>
                        <div className="text-sm text-success">✅ Terminé - 14:30</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">2</div>
                      <div>
                        <div className="font-medium">Préparation en cours</div>
                        <div className="text-sm text-warning">🔄 En cours - 14:45</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm">3</div>
                      <div>
                        <div className="font-medium">Prise en charge</div>
                        <div className="text-sm text-text-muted">⏳ En attente</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm">4</div>
                      <div>
                        <div className="font-medium">Livraison</div>
                        <div className="text-sm text-text-muted">⏳ En attente</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-text-muted">Carte GPS interactive</p>
                    <p className="text-sm text-text-muted mt-2">
                      Position actuelle: {selectedDelivery.zone}
                    </p>
                    <button className="btn btn-primary btn-sm mt-4">
                      📍 Voir sur la carte
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary-light rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Temps estimé de livraison</div>
                      <div className="text-text-muted">Basé sur la position GPS actuelle</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">15 min</div>
                      <div className="text-sm text-text-muted">Arrivée prévue 15:00</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📍</div>
                <h4 className="font-semibold mb-2">Aucune livraison en cours</h4>
                <p className="text-text-muted">Passez une commande pour suivre votre livraison en temps réel</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;