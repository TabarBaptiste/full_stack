# backend/Dockerfile
FROM node:20

WORKDIR /app

# Copier package.json et lock
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Générer Prisma client (important !)
RUN npx prisma generate

# Exposer le port du back
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:dev"]
