import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HOTELS_DATA, HEALTH_SERVICES_DATA, EXTENDED_CATEGORIES } from '../services/dataService';

const AdminPage: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Fonction de connexion admin rapide
  const loginAsAdmin = async () => {
    try {
      await login('admin@djassa.ci', 'admin123');
      setShowLoginForm(false);
    } catch (error) {
      console.error('Erreur de connexion admin:', error);
    }
  };

  // Vérifier les droits admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">� Dashboard Administrateur</h2>
            <p className="auth-subtitle">Connectez-vous pour accéder au panneau d'administration</p>
          </div>
          
          {!showLoginForm ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🚀 Accès Rapide Admin</h3>
                <p className="text-sm text-blue-600 mb-3">
                  Cliquez ci-dessous pour vous connecter automatiquement en tant qu'administrateur
                </p>
                <button 
                  onClick={loginAsAdmin}
                  className="btn btn-primary btn-lg btn-full"
                >
                  🔧 Se connecter comme Admin
                </button>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => setShowLoginForm(true)}
                  className="text-primary underline"
                >
                  Ou connexion manuelle
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Identifiants Admin par défaut :</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Email :</strong> admin@djassa.ci</p>
                <p className="text-sm text-gray-600 mb-3"><strong>Mot de passe :</strong> admin123</p>
                <button 
                  onClick={loginAsAdmin}
                  className="btn btn-success btn-sm"
                >
                  Utiliser ces identifiants
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <button 
              onClick={() => (window as any).navigate?.('home')}
              className="btn btn-outline btn-lg btn-full"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: '📊' },
    { id: 'taxis', name: 'Taxis & Chauffeurs', icon: '🚖' },
    { id: 'users', name: 'Utilisateurs', icon: '👥' },
    { id: 'services', name: 'Services', icon: '🏢' },
    { id: 'orders', name: 'Commandes', icon: '📦' },
    { id: 'finances', name: 'Finances', icon: '💰' },
    { id: 'analytics', name: 'Statistiques', icon: '📈' }
  ];

  const stats = {
    users: 1247,
    hotels: HOTELS_DATA.length,
    healthServices: HEALTH_SERVICES_DATA.length,
    categories: EXTENDED_CATEGORIES.length,
    orders: 89,
    revenue: 2450000,
    commissions: 367500, // 15% des revenus
    ristournes: 122500   // 5% des revenus
  };

  // Données financières détaillées
  const transactionsData = [
    {
      id: 'T001',
      date: '2024-11-07',
      type: 'Réservation Hôtel',
      service: 'Hôtel Ivoire Abidjan',
      client: 'Kouame André',
      montant: 85000,
      commission: 12750, // 15%
      ristourne: 4250,   // 5%
      statut: 'Payé'
    },
    {
      id: 'T002', 
      date: '2024-11-06',
      type: 'Service Santé',
      service: 'Pharmacie de la Paix',
      client: 'Adjoua Marie',
      montant: 15000,
      commission: 2250,
      ristourne: 750,
      statut: 'Payé'
    },
    {
      id: 'T003',
      date: '2024-11-05',
      type: 'Réservation Hôtel',
      service: 'Pullman Abidjan',
      client: 'Koffi Jean',
      montant: 120000,
      commission: 18000,
      ristourne: 6000,
      statut: 'En cours'
    },
    {
      id: 'T004',
      date: '2024-11-04',
      type: 'Service Santé',
      service: 'Clinique La Colombe',
      client: 'Bamba Fatou',
      montant: 45000,
      commission: 6750,
      ristourne: 2250,
      statut: 'Payé'
    }
  ];

  return (
    <div className="container mt-8 mb-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">🔧 Administration Djassa</h1>
          <p className="text-text-secondary">Bienvenue {user.name} - Tableau de bord administrateur</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-success">Admin connecté</span>
          <button className="btn btn-outline btn-sm">📊 Rapport</button>
        </div>
      </div>

      {/* Navigation des onglets */}
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

      {/* Contenu des onglets */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Statistiques principales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-primary">{stats.users}</div>
              <div className="text-sm text-text-muted">Utilisateurs inscrits</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🏨</div>
              <div className="text-2xl font-bold text-primary">{stats.hotels}</div>
              <div className="text-sm text-text-muted">Hôtels référencés</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🏥</div>
              <div className="text-2xl font-bold text-primary">{stats.healthServices}</div>
              <div className="text-sm text-text-muted">Services de santé</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-primary">{stats.orders}</div>
              <div className="text-sm text-text-muted">Commandes ce mois</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-primary">{stats.revenue.toLocaleString()}</div>
              <div className="text-sm text-text-muted">CA FCFA ce mois</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">�</div>
              <div className="text-2xl font-bold text-success">{stats.commissions.toLocaleString()}</div>
              <div className="text-sm text-text-muted">Commissions FCFA</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold text-warning">{stats.ristournes.toLocaleString()}</div>
              <div className="text-sm text-text-muted">Ristournes FCFA</div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">🚀 Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn btn-primary btn-full">+ Ajouter hôtel</button>
              <button className="btn btn-secondary btn-full">+ Ajouter service santé</button>
              <button className="btn btn-outline btn-full">📊 Exporter données</button>
              <button className="btn btn-outline btn-full">✉️ Envoyer newsletter</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">🏢 Gestion des services</h3>
            <button className="btn btn-primary">+ Nouveau service</button>
          </div>

          {/* Hôtels */}
          <div className="card mb-6">
            <h4 className="text-lg font-semibold mb-4">🏨 Hôtels ({HOTELS_DATA.length})</h4>
            <div className="grid gap-4">
              {HOTELS_DATA.map(hotel => (
                <div key={hotel.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h5 className="font-medium">{hotel.name}</h5>
                    <p className="text-sm text-text-muted">{hotel.location.city} - ⭐ {hotel.rating}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                    <button className="btn btn-secondary btn-sm">👁️ Voir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services de santé */}
          <div className="card">
            <h4 className="text-lg font-semibold mb-4">🏥 Services de santé ({HEALTH_SERVICES_DATA.length})</h4>
            <div className="grid gap-4">
              {HEALTH_SERVICES_DATA.map(service => (
                <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h5 className="font-medium">{service.name}</h5>
                    <p className="text-sm text-text-muted">
                      {service.type === 'pharmacy' && '💊 Pharmacie'}
                      {service.type === 'clinic' && '🏥 Clinique'}
                      {service.type === 'hospital' && '🏥 Hôpital'}
                      {' - ' + service.location.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                    <button className="btn btn-secondary btn-sm">👁️ Voir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finances' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">💰 Gestion Financière</h3>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm">📊 Rapport mensuel</button>
              <button className="btn btn-primary btn-sm">💸 Paiement ristournes</button>
            </div>
          </div>

          {/* Résumé financier */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-primary">{stats.revenue.toLocaleString()} FCFA</div>
              <div className="text-sm text-text-muted">Chiffre d'affaires total</div>
              <div className="text-xs text-success mt-1">+12% vs mois dernier</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">💵</div>
              <div className="text-2xl font-bold text-success">{stats.commissions.toLocaleString()} FCFA</div>
              <div className="text-sm text-text-muted">Commissions (15%)</div>
              <div className="text-xs text-success mt-1">+8% vs mois dernier</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold text-warning">{stats.ristournes.toLocaleString()} FCFA</div>
              <div className="text-sm text-text-muted">Ristournes (5%)</div>
              <div className="text-xs text-warning mt-1">À verser aux partenaires</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-primary">{((stats.commissions - stats.ristournes)).toLocaleString()} FCFA</div>
              <div className="text-sm text-text-muted">Bénéfice net (10%)</div>
              <div className="text-xs text-success mt-1">Marge bénéficiaire</div>
            </div>
          </div>

          {/* Tableau des transactions */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">💳 Transactions récentes</h4>
              <div className="flex gap-2">
                <select className="btn btn-outline btn-sm">
                  <option>Tous les types</option>
                  <option>Hôtels</option>
                  <option>Services santé</option>
                </select>
                <select className="btn btn-outline btn-sm">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                  <option>3 derniers mois</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 font-semibold">Client</th>
                    <th className="text-right py-3 px-4 font-semibold">Montant</th>
                    <th className="text-right py-3 px-4 font-semibold">Commission</th>
                    <th className="text-right py-3 px-4 font-semibold">Ristourne</th>
                    <th className="text-center py-3 px-4 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.map(transaction => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                      <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{transaction.service}</div>
                          <div className="text-sm text-text-muted">{transaction.type}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{transaction.client}</td>
                      <td className="py-3 px-4 text-right font-medium">{transaction.montant.toLocaleString()} FCFA</td>
                      <td className="py-3 px-4 text-right text-success font-medium">+{transaction.commission.toLocaleString()} FCFA</td>
                      <td className="py-3 px-4 text-right text-warning font-medium">-{transaction.ristourne.toLocaleString()} FCFA</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.statut === 'Payé' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-text-muted">
                Affichage de 4 transactions sur 89 au total
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm">← Précédent</button>
                <button className="btn btn-outline btn-sm">Suivant →</button>
              </div>
            </div>
          </div>

          {/* Analyse des ristournes par partenaire */}
          <div className="card mt-6">
            <h4 className="text-lg font-semibold mb-4">🎁 Ristournes par partenaire</h4>
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium">🏨 Hôtel Ivoire Abidjan</h5>
                  <p className="text-sm text-text-muted">3 réservations ce mois</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-warning">12.750 FCFA</div>
                  <div className="text-sm text-text-muted">Ristourne due</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium">🏨 Pullman Abidjan</h5>
                  <p className="text-sm text-text-muted">2 réservations ce mois</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-warning">18.500 FCFA</div>
                  <div className="text-sm text-text-muted">Ristourne due</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium">💊 Pharmacie de la Paix</h5>
                  <p className="text-sm text-text-muted">8 commandes ce mois</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-warning">4.250 FCFA</div>
                  <div className="text-sm text-text-muted">Ristourne due</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium">🏥 Clinique La Colombe</h5>
                  <p className="text-sm text-text-muted">5 consultations ce mois</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-warning">8.750 FCFA</div>
                  <div className="text-sm text-text-muted">Ristourne due</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-warning-light rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-semibold">💰 Total ristournes à verser</h5>
                  <p className="text-sm text-text-muted">Paiement prévu le 15 de chaque mois</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warning">{stats.ristournes.toLocaleString()} FCFA</div>
                  <button className="btn btn-warning btn-sm mt-2">💸 Effectuer les virements</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'taxis' && (
        <div className="space-y-6">
          {/* Gestion des Véhicules */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">🚗 Gestion des Véhicules</h3>
              <button className="btn btn-primary btn-sm">+ Ajouter un véhicule</button>
            </div>

            <div className="grid gap-4">
              {/* Véhicule 1 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    🚗
                  </div>
                  <div>
                    <h4 className="font-semibold">Toyota Corolla 2020</h4>
                    <p className="text-sm text-gray-600">Immatriculation: AB-123-CI</p>
                    <p className="text-sm text-gray-600">Chauffeur: Kouame Jean</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    ✅ Actif
                  </span>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                  <button className="btn btn-danger btn-sm">🗑️</button>
                </div>
              </div>

              {/* Véhicule 2 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    🚕
                  </div>
                  <div>
                    <h4 className="font-semibold">Hyundai Accent 2019</h4>
                    <p className="text-sm text-gray-600">Immatriculation: CD-456-CI</p>
                    <p className="text-sm text-gray-600">Chauffeur: Diabate Mamadou</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    ⏸️ En maintenance
                  </span>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                  <button className="btn btn-danger btn-sm">🗑️</button>
                </div>
              </div>

              {/* Véhicule 3 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    🚙
                  </div>
                  <div>
                    <h4 className="font-semibold">KIA Picanto 2021</h4>
                    <p className="text-sm text-gray-600">Immatriculation: EF-789-CI</p>
                    <p className="text-sm text-gray-600">Chauffeur: Traore Awa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    ✅ Actif
                  </span>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                  <button className="btn btn-danger btn-sm">🗑️</button>
                </div>
              </div>
            </div>
          </div>

          {/* Gestion des Chauffeurs */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">👨‍💼 Gestion des Chauffeurs</h3>
              <button className="btn btn-primary btn-sm">+ Ajouter un chauffeur</button>
            </div>

            <div className="grid gap-4">
              {/* Chauffeur 1 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                    KJ
                  </div>
                  <div>
                    <h4 className="font-semibold">Kouame Jean</h4>
                    <p className="text-sm text-gray-600">📱 +225 07 12 34 56 78</p>
                    <p className="text-sm text-gray-600">⭐ Note: 4.8/5 (127 courses)</p>
                    <p className="text-sm text-gray-600">🚗 Toyota Corolla (AB-123-CI)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    🟢 En ligne
                  </span>
                  <button className="btn btn-outline btn-sm">👁️ Profil</button>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                </div>
              </div>

              {/* Chauffeur 2 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white">
                    DM
                  </div>
                  <div>
                    <h4 className="font-semibold">Diabate Mamadou</h4>
                    <p className="text-sm text-gray-600">📱 +225 05 98 76 54 32</p>
                    <p className="text-sm text-gray-600">⭐ Note: 4.6/5 (89 courses)</p>
                    <p className="text-sm text-gray-600">🚕 Hyundai Accent (CD-456-CI)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                    ⚫ Hors ligne
                  </span>
                  <button className="btn btn-outline btn-sm">👁️ Profil</button>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                </div>
              </div>

              {/* Chauffeur 3 */}
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white">
                    TA
                  </div>
                  <div>
                    <h4 className="font-semibold">Traore Awa</h4>
                    <p className="text-sm text-gray-600">📱 +225 01 23 45 67 89</p>
                    <p className="text-sm text-gray-600">⭐ Note: 4.9/5 (203 courses)</p>
                    <p className="text-sm text-gray-600">🚙 KIA Picanto (EF-789-CI)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    🟢 En course
                  </span>
                  <button className="btn btn-outline btn-sm">👁️ Profil</button>
                  <button className="btn btn-outline btn-sm">✏️ Modifier</button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques Taxi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h4 className="font-semibold mb-4">📊 Statistiques du jour</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Courses terminées</span>
                  <span className="font-bold text-success">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Courses en cours</span>
                  <span className="font-bold text-primary">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenus du jour</span>
                  <span className="font-bold text-primary">147,500 FCFA</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">🚗 Flotte</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Véhicules actifs</span>
                  <span className="font-bold text-success">15</span>
                </div>
                <div className="flex justify-between">
                  <span>En maintenance</span>
                  <span className="font-bold text-warning">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Chauffeurs en ligne</span>
                  <span className="font-bold text-primary">12</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold mb-4">⭐ Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Note moyenne</span>
                  <span className="font-bold text-success">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps d'attente moyen</span>
                  <span className="font-bold text-primary">8 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux d'annulation</span>
                  <span className="font-bold text-warning">2.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">👥 Gestion des utilisateurs</h3>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm">📊 Exporter</button>
              <button className="btn btn-primary btn-sm">+ Nouvel utilisateur</button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h5 className="font-medium">Admin Principal</h5>
                <p className="text-sm text-text-muted">admin@djassa.ci - 👑 Administrateur</p>
              </div>
              <div className="flex gap-2">
                <span className="badge badge-success">Actif</span>
                <button className="btn btn-outline btn-sm">✏️ Modifier</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h5 className="font-medium">Mama Adjoua</h5>
                <p className="text-sm text-text-muted">adjoua@example.com - 🏪 Vendeur</p>
              </div>
              <div className="flex gap-2">
                <span className="badge badge-success">Actif</span>
                <button className="btn btn-outline btn-sm">✏️ Modifier</button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h5 className="font-medium">Client Test</h5>
                <p className="text-sm text-text-muted">client@example.com - 🛍️ Acheteur</p>
              </div>
              <div className="flex gap-2">
                <span className="badge badge-success">Actif</span>
                <button className="btn btn-outline btn-sm">✏️ Modifier</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <h3 className="text-xl font-semibold mb-6">📈 Statistiques et Analytics</h3>
          
          <div className="grid gap-6">
            <div className="card">
              <h4 className="text-lg font-semibold mb-4">📊 Activité cette semaine</h4>
              <div className="text-center py-8 text-text-muted">
                <div className="text-4xl mb-4">📈</div>
                <p>Graphiques d'activité à implémenter</p>
                <p className="text-sm mt-2">Connexions, recherches, réservations par jour</p>
              </div>
            </div>

            <div className="card">
              <h4 className="text-lg font-semibold mb-4">🗺️ Répartition géographique</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">65%</div>
                  <div className="text-sm text-text-muted">Abidjan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">20%</div>
                  <div className="text-sm text-text-muted">Yamoussoukro</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15%</div>
                  <div className="text-sm text-text-muted">Autres villes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;