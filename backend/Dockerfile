# backend/Dockerfile
FROM node:20

WORKDIR /app

# Copier package.json et lock
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Installer les certificats SSL
RUN apt-get update && apt-get install -y ca-certificates

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Générer Prisma client (important !)
# RUN npx prisma generate

# Exposer le port du back
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "start:dev"]
