# Déploiement Render uniquement

Ce projet est configuré pour être déployé exclusivement sur **Render.com**.

## Variables d'environnement requises sur Render :

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://babayacoubasylla04_db_user:wadG0RfewuJNOViG@djassa-cluster.bo6mibz.mongodb.net/djassa?retryWrites=true&w=majority
JWT_SECRET=djassa-super-secret-key-render-2025-production
FRONTEND_URL=https://djassa-marketplace.onrender.com
BACKEND_URL=https://djassa-marketplace.onrender.com
PUPPETEER_SKIP_DOWNLOAD=true
NPM_CONFIG_PRODUCTION=true
```

## Commandes Render :
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`