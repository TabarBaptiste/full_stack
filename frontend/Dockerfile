# frontend/Dockerfile
FROM node:20

WORKDIR /app

# Copier package.json et lock
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port du serveur Angular
EXPOSE 4201

# Lancer Angular en mode dev (serveur)
CMD ["npm", "run", "start"]
