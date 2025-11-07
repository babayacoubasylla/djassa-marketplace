# 🇨🇮 Djassa - Marketplace Ivoirien avec Service de Taxi

## 📋 Description

Djassa est une application web marketplace complète dédiée à la Côte d'Ivoire, permettant aux acheteurs et vendeurs locaux de se connecter facilement. L'application inclut désormais un **service de taxi intégré** pour livraisons et déplacements, avec une interface d'administration complète.

## ✨ Fonctionnalités

### 🛍️ **Marketplace**
- **🔐 Authentification sécurisée** : Connexion et inscription pour acheteurs et vendeurs
- **🛍️ Interface acheteur** : Découverte de produits locaux
- **🏪 Interface vendeur** : Gestion des produits à vendre  
- **📍 Géolocalisation** : Trouver des vendeurs près de chez vous
- **📱 Design responsive** : Compatible mobile et desktop

### 🚕 **Service de Taxi** (NOUVEAU)
- **🚖 Réservation de taxi** : Interface mobile pour réserver des courses
- **📍 Géolocalisation temps réel** : Suivi de position en direct
- **💰 Tarification dynamique** : Calcul automatique des prix
- **🔔 Notifications push** : Alertes en temps réel
- **👨‍💼 Gestion des chauffeurs** : Interface complète d'administration

### ⚙️ **Administration Complète**
- **📊 Dashboard analytique** : Statistiques en temps réel
- **🚗 Gestion de flotte** : Véhicules, maintenance, disponibilité
- **👥 Gestion des chauffeurs** : Profils, documents, performances
- **💼 Gestion des utilisateurs** : Clients, vendeurs, modération
- **💰 Gestion financière** : Revenus, commissions, paiements
- **📈 Analytics avancées** : Métriques détaillées et rapports

## 🛠️ Technologies

- **Frontend** : React 19 + TypeScript + PWA
- **Backend** : Node.js + Express + MongoDB + Socket.IO
- **Build Tool** : Vite 7
- **Styling** : CSS3 responsive mobile-first
- **Real-time** : WebSocket pour géolocalisation et notifications
- **Hosting** : Render (Full-Stack)

## 🚀 Déploiement sur Render

### Déploiement automatique
1. **Fork** ce repository sur GitHub
2. Connectez votre compte **Render** à GitHub
3. Créez un nouveau **Web Service** sur Render :
   - Repository : `votre-username/djassa`
   - Build Command : `npm install && npm run build`
   - Start Command : `npm start`
   - Environment : `Node`

### Variables d'environnement Render
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://djassa-marketplace.onrender.com
```

### Configuration automatique
Le projet est configuré avec :
- `render.yaml` pour déploiement automatique
- Scripts de build optimisés pour Render
- Serveur configuré pour servir le frontend en production

## 🚀 Développement local

### Prérequis
- Node.js 18+ 
- NPM
- MongoDB (local ou Atlas)

### Installation complète
```bash
# Installation des dépendances frontend + backend
npm install

# Configuration de l'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos variables

# Lancer en mode développement
npm run dev        # Frontend (http://localhost:5174)
npm run dev:backend # Backend (http://localhost:3000)
```

### Scripts disponibles
```bash
# Développement
npm run dev              # Frontend uniquement
npm run dev:backend      # Backend uniquement

# Production
npm run build           # Build frontend
npm start              # Serveur production (backend + frontend)

# Maintenance
npm run lint           # ESLint
npm run scrape         # Collecte de données (backend)
```

## 📁 Architecture Full-Stack

```
📁 djassa/
├── 📁 backend/                 # API Node.js + Express
│   ├── server.js              # Serveur principal (sert aussi le frontend)
│   ├── 📁 routes/             # Routes API
│   │   ├── auth.js           # Authentification
│   │   ├── delivery.js       # Service taxi/livraison
│   │   ├── orders.js         # Commandes
│   │   └── products.js       # Produits
│   ├── 📁 models/            # Modèles MongoDB
│   │   ├── User.js           # Utilisateurs
│   │   ├── Order.js          # Commandes
│   │   ├── DeliveryPerson.js # Chauffeurs
│   │   └── Product.js        # Produits
│   └── 📁 services/          # Services métier
├── 📁 src/                   # Frontend React + TypeScript
│   ├── 📁 pages/             # Pages principales
│   │   ├── CustomerPage.tsx  # Interface client mobile (975 lignes)
│   │   ├── AdminPage.tsx     # Dashboard admin complet
│   │   ├── DeliveryPage.tsx  # Réservation taxi
│   │   └── DeliveryPersonPage.tsx # Interface chauffeur
│   ├── 📁 components/        # Composants réutilisables
│   ├── 📁 contexts/          # Gestion d'état React
│   └── 📁 services/          # Services frontend
└── 📁 public/               # Assets statiques + PWA
```

## 🏗️ Fonctionnalités Complètes

### � **Interface Client Mobile** (CustomerPage.tsx - 975 lignes)
- **🏠 Dashboard** : Vue d'ensemble personnalisée
- **🛍️ Commandes** : Historique et suivi en temps réel
- **🚖 Taxi** : Réservation avec géolocalisation
- **👤 Profil** : Gestion du compte utilisateur
- **🔔 Notifications** : Système push intégré
- **👨‍💼 Accès Admin** : Bouton admin pour les administrateurs

### ⚙️ **Dashboard Administrateur** (AdminPage.tsx)
- **📊 Analytics** : KPIs temps réel (ventes, commandes, utilisateurs)
- **🚖 Gestion Taxis** :
  - 🚗 Flotte de véhicules (ajout, modification, statut)
  - 👨‍💼 Chauffeurs (profils, documents, performances)
  - 📍 Géolocalisation temps réel
  - 📊 Statistiques de courses
- **👥 Utilisateurs** : Gestion clients et vendeurs
- **💰 Finances** : Revenus, commissions, paiements
- **📈 Rapports** : Analytics détaillées

### 🚕 **Service de Taxi Intégré**
- **📱 Réservation mobile** : Interface tactile optimisée
- **📍 Géolocalisation** : Suivi temps réel chauffeur/client
- **💰 Tarification** : Calcul automatique avec tarifs dynamiques
- **🔔 Notifications** : Alertes course acceptée/en route/arrivée
- **⭐ Évaluations** : Système de notation chauffeurs

### 🌐 **API Backend Complète**
- **🔐 Authentification** : JWT avec rôles (client/chauffeur/admin)
- **🚖 Gestion courses** : CRUD complet avec WebSocket
- **📍 Géolocalisation** : APIs position temps réel
- **💳 Paiements** : Intégration mobile money (préparé)
- **📊 Analytics** : Endpoints statistiques avancées

## 🌍 Spécificités Ivoiriennes

### 💰 **Monnaie et Paiements**
- Prix en **Francs CFA (FCFA)**
- Intégration **Orange Money** (préparée)
- Support **MTN Mobile Money** (préparé)

### 📍 **Géographie Locale**
- Centré sur **Abidjan** et principales villes
- Calculs de distance en kilomètres
- Zones de livraison configurables

### 🗣️ **Langue et Culture**
- Interface en **français**
- Émojis et références culturelles ivoiriennes
- Support des quartiers et communes d'Abidjan

## 🔧 Configuration Render

### Variables d'environnement requises
```bash
# Base
NODE_ENV=production
PORT=10000

# Base de données
MONGODB_URI=mongodb+srv://...

# Authentification
JWT_SECRET=your-super-secret-key

# URLs
FRONTEND_URL=https://djassa-marketplace.onrender.com
BACKEND_URL=https://djassa-marketplace.onrender.com

# Services externes (optionnel)
GOOGLE_MAPS_API_KEY=your-key
ORANGE_MONEY_API_KEY=your-key
```

### Fichiers de configuration
- `render.yaml` : Configuration de déploiement automatique
- `package.json` : Scripts optimisés pour Render
- `.gitignore` : Exclusions pour Git

## 📊 Métriques et Performance

### 📱 **Interface Mobile**
- **Responsive Design** : Mobile-first avec breakpoints
- **Touch Targets** : Boutons 44px minimum (Apple guidelines)
- **Performance** : Lazy loading et optimisations Vite

### 🚀 **Backend Performance**
- **MongoDB** : Indexes optimisés pour requêtes fréquentes
- **WebSocket** : Socket.IO pour temps réel
- **Caching** : Stratégies de cache pour APIs fréquentes

### 🔒 **Sécurité**
- **CORS** : Configuration restrictive pour production
- **JWT** : Tokens sécurisés avec expiration
- **Validation** : Middleware de validation des données
- **HTTPS** : Render fournit SSL automatique

## 🚀 Roadmap

### 🎯 **Version Actuelle (MVP)**
✅ Marketplace fonctionnel  
✅ Service taxi intégré  
✅ Interface admin complète  
✅ Déploiement Render  

### 🔄 **Prochaines Versions**
- **💳 Paiements mobiles** : Orange Money / MTN
- **📞 WhatsApp Integration** : Notifications via WhatsApp Business
- **🗺️ Google Maps** : Cartes interactives avancées
- **📊 Analytics avancées** : Tableau de bord BI
- **🔔 Push Notifications** : Notifications natives mobiles

---

## 📞 Support

Pour toute question ou support :
- **Email** : support@djassa.ci
- **Docs** : Consultez ce README
- **Issues** : Utilisez GitHub Issues

---

**🚀 Prêt pour la production sur Render !**

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Navigation.tsx   # Barre de navigation principale
│   └── Footer.tsx       # Pied de page
├── contexts/           # Context React pour la gestion d'état
│   ├── AuthContext.tsx # Gestion de l'authentification
│   └── CompareContext.tsx # Système de comparaison de produits
├── pages/              # Pages principales de l'application
│   ├── HomePage.tsx    # Page d'accueil
│   ├── LoginPage.tsx   # Page de connexion
│   ├── RegisterPage.tsx # Page d'inscription
│   ├── ExplorePage.tsx # Navigation et recherche de produits
│   ├── ComparePage.tsx # Comparaison de produits
│   ├── VendorPage.tsx  # Interface vendeur
│   └── LocationPage.tsx # Géolocalisation et vendeurs proches
├── styles/             # Fichiers CSS
│   └── global.css      # Styles globaux responsive
├── types/              # Types TypeScript
│   └── index.ts        # Définitions des interfaces
└── utils/              # Utilitaires et helpers
```

## 🔧 Scripts disponibles

- `npm run dev` : Démarre le serveur de développement sur http://localhost:5174
- `npm run build` : Build de production dans le dossier `dist/`
- `npm run preview` : Aperçu du build de production
- `npm run lint` : Vérification ESLint

## 🌟 Fonctionnalités complètes

### 🔐 Système d'authentification
- **Inscription personnalisée** : Choix du rôle (Acheteur/Vendeur)
- **Connexion sécurisée** : Gestion de session via Context React
- **Protection des routes** : Accès conditionnel selon le rôle utilisateur

### 🛍️ Interface acheteur
- **Exploration de produits** : Navigation par catégories avec filtres
- **Recherche avancée** : Recherche textuelle dans nom et description
- **Système de comparaison** : Comparaison jusqu'à 3 produits simultanément
- **Géolocalisation** : Vendeurs proches avec calcul de distance

### 🏪 Interface vendeur
- **Gestion de boutique** : Dashboard vendeur avec statistiques
- **Ajout de produits** : Formulaire complet avec upload d'images
- **Gestion des commandes** : Suivi des commandes avec statuts
- **Statistiques** : Aperçu des ventes et performance

### ⚖️ Système de comparaison
- **Comparaison multi-critères** : Prix, vendeur, localisation, caractéristiques
- **Interface dédiée** : Tableau comparatif complet
- **Persistance** : Maintien de la liste de comparaison durant la session

### 📍 Géolocalisation avancée
- **Localisation GPS** : Utilisation de l'API Geolocation
- **Vendeurs proches** : Calcul de distance et tri par proximité
- **Interface carte** : Préparation pour intégration Google Maps/OpenStreetMap
- **Gestion des erreurs** : Fallback en cas de refus de géolocalisation

### 🎨 Design et UX
- **Responsive Design** : Compatible mobile et desktop
- **Thème ivoirien** : Couleurs et émojis représentant la Côte d'Ivoire
- **Navigation intuitive** : Menu adaptatif selon le rôle utilisateur
- **Feedback utilisateur** : Loading states, messages d'erreur, confirmations

## 📱 Pages disponibles

- **Accueil** (`/`) : Landing page avec présentation et CTA
- **Explorer** (`/explore`) : Catalogue de produits avec filtres et recherche
- **Comparer** (`/compare`) : Comparaison détaillée de produits
- **Près de moi** (`/location`) : Géolocalisation et vendeurs proches
- **Connexion** (`/login`) : Formulaire de connexion sécurisé
- **Inscription** (`/register`) : Formulaire d'inscription avec choix de rôle
- **Ma Boutique** (`/vendor`) : Interface vendeur (réservée aux vendeurs)

## 🛠️ Architecture technique

### Frontend
- **React 19** : Framework moderne avec hooks et Context API
- **TypeScript strict** : Typage fort pour la robustesse du code
- **Vite 7** : Build tool ultra-rapide avec Hot Reload
- **CSS3 moderne** : Flexbox, Grid, Custom Properties, Animations

### Gestion d'état
- **Context API** : AuthContext pour l'authentification
- **Context API** : CompareContext pour la comparaison de produits
- **State local** : useState pour les états de composants

### Fonctionnalités web natives
- **Geolocation API** : Localisation GPS native
- **File API** : Upload d'images (préparation)
- **Local Storage** : Persistance potentielle des données

## 🚀 Roadmap et extensions possibles

### Backend (à développer)
- API REST avec Node.js/Express ou Django
- Base de données (PostgreSQL/MongoDB)
- Authentification JWT
- Upload d'images (AWS S3/Cloudinary)
- Notifications push
- Système de paiement (Mobile Money, Orange Money)

### Fonctionnalités avancées
- Chat en temps réel entre acheteurs et vendeurs
- Système de notation et avis
- Géolocalisation temps réel des vendeurs
- Notifications de proximité
- Mode hors-ligne avec synchronisation
- Application mobile (React Native)

### Intégrations tierces
- Google Maps / OpenStreetMap
- Services de paiement mobile ivoiriens
- API de géocodage (Google, MapBox)
- Services de messagerie (WhatsApp Business API)
- Analytics et tracking

## 🌍 Contexte ivoirien

L'application est spécialement conçue pour le marché ivoirien :
- **Langues** : Interface en français
- **Monnaie** : Prix en Francs CFA (FCFA)
- **Culture** : Émojis et références culturelles locales
- **Géographie** : Centré sur les villes ivoiriennes
- **Commerce local** : Focus sur les produits traditionnels et artisanaux

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
