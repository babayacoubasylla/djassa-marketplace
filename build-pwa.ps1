# Script de build pour Djassa PWA/APK (Windows)
Write-Host "🚀 Construction de Djassa PWA/APK..." -ForegroundColor Green

# Étape 1: Installation des dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

# Étape 2: Build de l'application
Write-Host "🔨 Build de l'application..." -ForegroundColor Yellow
npm run build

# Étape 3: Vérification des fichiers PWA
Write-Host "✅ Vérification des fichiers PWA..." -ForegroundColor Yellow

if (-not (Test-Path "dist/manifest.json")) {
    Write-Host "❌ Erreur: manifest.json manquant" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "dist/sw.js")) {
    Write-Host "❌ Erreur: Service Worker manquant" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichiers PWA OK" -ForegroundColor Green

# Étape 4: Installation de Capacitor (pour APK)
Write-Host "📱 Installation de Capacitor..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Étape 5: Initialisation Capacitor
Write-Host "⚙️ Initialisation Capacitor..." -ForegroundColor Yellow
npx cap init

# Étape 6: Ajout des plateformes
Write-Host "📱 Ajout des plateformes mobiles..." -ForegroundColor Yellow
npx cap add android
# npx cap add ios  # Décommentez si vous avez macOS

# Étape 7: Synchronisation
Write-Host "🔄 Synchronisation des fichiers..." -ForegroundColor Yellow
npx cap sync

# Instructions finales
Write-Host ""
Write-Host "✅ Build terminé avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Pour générer l'APK Android:" -ForegroundColor Cyan
Write-Host "1. Installez Android Studio si pas déjà fait"
Write-Host "2. Ouvrez le projet: npx cap open android"
Write-Host "3. Dans Android Studio, allez dans Build → Generate Signed Bundle/APK"
Write-Host "4. Choisissez APK et suivez les étapes"
Write-Host ""
Write-Host "🌐 PWA disponible dans le dossier dist/" -ForegroundColor Cyan
Write-Host "   Déployez sur Firebase: firebase deploy --only hosting"
Write-Host ""
Write-Host "🔗 URL PWA: https://djassa-ci-b2a0a.web.app" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Test local de la PWA:" -ForegroundColor Cyan
Write-Host "   Serveur de développement: npm run dev"
Write-Host "   Ou servez le build: npx serve dist"

# Test de connectivité
Write-Host ""
Write-Host "🌐 Test de connectivité PWA..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://djassa-ci-b2a0a.web.app" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PWA accessible en ligne" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ PWA pas encore déployée ou inaccessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Prochaines étapes recommandées:" -ForegroundColor Magenta
Write-Host "1. Testez la PWA: npm run dev"
Write-Host "2. Déployez sur Firebase: firebase deploy"  
Write-Host "3. Testez l'installation PWA sur mobile"
Write-Host "4. Générez l'APK avec Android Studio"