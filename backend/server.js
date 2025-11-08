import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import deliveryRoutes from './routes/delivery.js';
import paymentRoutes from './routes/payments.js';
import scrapingRoutes from './routes/scraping.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';

// ES modules dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://djassa-marketplace.onrender.com"] 
      : ["http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/djassa';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('join-delivery', (deliveryId) => {
    socket.join(`delivery-${deliveryId}`);
    console.log(`📦 Joined delivery room: delivery-${deliveryId}`);
  });
  
  socket.on('location-update', (data) => {
    socket.to(`delivery-${data.deliveryId}`).emit('delivery-location', data);
  });
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Static files
app.use('/uploads', express.static('uploads'));

// Serve frontend static files (for production)
if (process.env.NODE_ENV === 'production') {
  // API routes FIRST
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/delivery', deliveryRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/scraping', scrapingRoutes);
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Djassa API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  // Static files AFTER API routes
  const staticPath = path.join(__dirname, '../dist');
  app.use(express.static(staticPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (filePath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      }
    }
  }));
  
  // React app fallback LAST
  app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'debug.html'));
  });
  
  // Route de test HTML pur
  app.get('/test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🇨🇮 Djassa - Test Direct</title>
        <style>
          body { 
            font-family: Arial; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
          }
          .box { background: rgba(0,0,0,0.1); padding: 30px; border-radius: 15px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>🇨🇮 DJASSA FONCTIONNE !</h1>
          <p>✅ Serveur Express : OK</p>
          <p>✅ MongoDB : ${process.env.MONGODB_URI ? 'Connecté' : 'Non configuré'}</p>
          <p>✅ Render : Déployé</p>
          <p>📁 Dist path: ${path.join(__dirname, '../dist')}</p>
          <button onclick="testAPI()">Test API</button>
        </div>
        <script>
          async function testAPI() {
            try {
              const res = await fetch('/api/health');
              const data = await res.json();
              alert('API: ' + data.message);
            } catch(e) {
              alert('Erreur API: ' + e.message);
            }
          }
        </script>
      </body>
      </html>
    `);
  });
  
  app.get('*', (req, res) => {
    // Diagnostics - Si pas de fichier dist/index.html, créer une page de diagnostic
    const indexPath = path.join(staticPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>🇨🇮 Djassa - Diagnostic</title>
          <style>
            body { 
              font-family: Arial; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #ff6b35, #f7931e);
              color: white;
              text-align: center;
            }
            .container { max-width: 800px; margin: 0 auto; }
            .error { background: rgba(255,0,0,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .success { background: rgba(0,255,0,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .info { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 10px 0; text-align: left; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🇨🇮 Djassa - Mode Diagnostic</h1>
            
            <div class="error">
              ❌ PROBLÈME DÉTECTÉ: dist/index.html manquant
            </div>
            
            <div class="info">
              <h3>📊 Diagnostic Serveur :</h3>
              <p>📁 Static Path: ${staticPath}</p>
              <p>📄 Index Path: ${indexPath}</p>
              <p>🌍 Environment: ${process.env.NODE_ENV}</p>
              <p>🔗 Port: ${process.env.PORT || 10000}</p>
            </div>
            
            <div class="success">
              ✅ Serveur Express : Fonctionnel<br>
              ✅ Routes API : Disponibles<br>
              ✅ MongoDB : ${process.env.MONGODB_URI ? 'Connecté' : 'Non configuré'}
            </div>
            
            <button onclick="window.location.href='/test'" style="padding: 15px 30px; font-size: 16px; margin: 10px;">
              🧪 Page Test
            </button>
            
            <button onclick="window.location.href='/api/health'" style="padding: 15px 30px; font-size: 16px; margin: 10px;">
              🔌 Test API
            </button>
          </div>
        </body>
        </html>
      `);
    }
    
    res.sendFile(indexPath);
  });
} else {
  // Development mode - API routes only
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/delivery', deliveryRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/scraping', scrapingRoutes);
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Djassa API is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });
  
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Djassa Backend running on port ${PORT}`);
  console.log(`📱 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend served from: http://localhost:${PORT}`);
  }
});

export { io };