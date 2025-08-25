FROM node:20

WORKDIR /app

# Désactiver SSL (dev local)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Installer Angular CLI globalement
# RUN npm install -g @angular/cli

# Copier package.json et lock
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port Angular
EXPOSE 4200

# Lancer Angular en mode dev (serveur)
CMD ["npm", "run", "start"]
