# Utiliser Node.js 18 LTS
FROM node:18-slim

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./
COPY backend/package*.json ./backend/

# Installer les dépendances frontend
RUN npm ci --only=production

# Installer les dépendances backend (sans Puppeteer pour accélérer)
WORKDIR /app/backend
RUN npm ci --only=production

# Retourner au répertoire principal
WORKDIR /app

# Copier le code source
COPY . .

# Builder le frontend
RUN npm run build-frontend

# Exposer le port
EXPOSE 10000

# Démarrer l'application
CMD ["npm", "start"]