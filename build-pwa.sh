#!/bin/bash

# Script de build pour Djassa PWA/APK
echo "🚀 Construction de Djassa PWA/APK..."

# Étape 1: Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Étape 2: Build de l'application
echo "🔨 Build de l'application..."
npm run build

# Étape 3: Vérification des fichiers PWA
echo "✅ Vérification des fichiers PWA..."
if [ ! -f "dist/manifest.json" ]; then
    echo "❌ Erreur: manifest.json manquant"
    exit 1
fi

if [ ! -f "dist/sw.js" ]; then
    echo "❌ Erreur: Service Worker manquant"
    exit 1
fi

echo "✅ Fichiers PWA OK"

# Étape 4: Installation de Capacitor (pour APK)
echo "📱 Installation de Capacitor..."
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Étape 5: Initialisation Capacitor
echo "⚙️ Initialisation Capacitor..."
npx cap init

# Étape 6: Ajout des plateformes
echo "📱 Ajout des plateformes mobiles..."
npx cap add android
npx cap add ios

# Étape 7: Synchronisation
echo "🔄 Synchronisation des fichiers..."
npx cap sync

# Étape 8: Instructions pour APK
echo ""
echo "✅ Build terminé avec succès!"
echo ""
echo "📱 Pour générer l'APK Android:"
echo "1. Ouvrez Android Studio: npx cap open android"
echo "2. Dans Android Studio, allez dans Build → Generate Signed Bundle/APK"
echo "3. Choisissez APK et suivez les étapes"
echo ""
echo "🍎 Pour générer l'app iOS:"
echo "1. Ouvrez Xcode: npx cap open ios"
echo "2. Dans Xcode, allez dans Product → Archive"
echo ""
echo "🌐 PWA disponible dans le dossier dist/"
echo "   Déployez sur Firebase: firebase deploy --only hosting"
echo ""
echo "🔗 URL PWA: https://djassa-ci-b2a0a.web.app"

# Étape 9: Test de la PWA localement
echo ""
echo "🧪 Test local de la PWA..."
echo "   Serveur de développement: npm run dev"
echo "   Ou servez le build: npx serve dist"