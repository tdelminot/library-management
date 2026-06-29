FROM node:18-alpine

WORKDIR /app

# Installer les dépendances système pour MySQL
RUN apk add --no-cache python3 make g++

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3001

# Démarrer l'application
CMD ["npm", "start"]