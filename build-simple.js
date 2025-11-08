import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier dist si inexistant
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Copier index.html de base
const indexContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🇨🇮 Djassa - Marketplace Ivoirien</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: white;
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { font-size: 3rem; margin-bottom: 1rem; }
    .subtitle { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
    .feature { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 10px; }
    .status { background: rgba(0,255,0,0.2); padding: 10px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🇨🇮 Djassa</h1>
    <p class="subtitle">Marketplace Ivoirien avec Service Taxi Intégré</p>
    
    <div class="status">
      ✅ Serveur déployé avec succès sur Render !
    </div>
    
    <div class="feature">
      <h3>🛍️ Marketplace</h3>
      <p>Plateforme e-commerce pour vendeurs et acheteurs ivoiriens</p>
    </div>
    
    <div class="feature">
      <h3>🚖 Service Taxi</h3>
      <p>Réservation de courses avec géolocalisation en temps réel</p>
    </div>
    
    <div class="feature">
      <h3>⚙️ Administration</h3>
      <p>Dashboard complet pour gestion flotte et utilisateurs</p>
    </div>
    
    <div class="feature">
      <h3>📱 Mobile-First</h3>
      <p>Interface optimisée pour smartphones et tablettes</p>
    </div>
    
    <p style="margin-top: 40px; opacity: 0.8;">
      🚀 Version de test déployée - Interface React en cours d'ajout
    </p>
  </div>
  
  <script>
    // Test API
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('API Status:', data);
        document.querySelector('.status').innerHTML = 
          '✅ Serveur API actif - ' + data.message;
      })
      .catch(err => {
        console.error('API Error:', err);
        document.querySelector('.status').innerHTML = 
          '⚠️ API en cours de démarrage...';
      });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(distPath, 'index.html'), indexContent);
console.log('✅ Build simple créé avec succès !');