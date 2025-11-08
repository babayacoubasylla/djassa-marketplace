import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Routes API de base
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Djassa API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Produit Test', price: 1000, vendor: 'Vendeur Test' }
    ]
  });
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'dist');
  console.log('📁 Frontend path:', frontendPath);
  
  // Vérifier si le dossier dist existe
  if (!fs.existsSync(frontendPath)) {
    console.log('⚠️ Dist folder not found, creating basic index.html');
    // Créer le fichier à la volée
    const basicHtml = `<!DOCTYPE html>
<html><head><title>Djassa Live!</title></head>
<body style="font-family:Arial;text-align:center;margin:50px;">
<h1>🇨🇮 Djassa Marketplace</h1>
<p>✅ Serveur déployé avec succès !</p>
<p>API: <a href="/api/health">/api/health</a></p>
</body></html>`;
    
    app.get('*', (req, res) => {
      res.send(basicHtml);
    });
  } else {
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  }
}

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Djassa Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;