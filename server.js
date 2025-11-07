const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du build React
app.use(express.static(path.join(__dirname, 'dist')));

// Routes API (pour futures fonctionnalités)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Djassa API is running' });
});

// Routes pour les services
app.get('/api/hotels', (req, res) => {
  res.json({ message: 'Hotels API endpoint' });
});

app.get('/api/health-services', (req, res) => {
  res.json({ message: 'Health services API endpoint' });
});

// Catch all handler: send back React's index.html file pour le routing côté client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Djassa server running on port ${PORT}`);
});