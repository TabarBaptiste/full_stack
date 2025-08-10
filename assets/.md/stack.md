# **Stack Technique — Application Web avec Angular & NestJS**

## **Frontend**

* **Framework** : [Angular](https://angular.io/) (TypeScript)
  → Framework complet, architecture modulaire, parfait pour projets structurés.
* **UI & CSS** : [Bootstrap](https://getbootstrap.com/)
  → Design responsive, rapide à mettre en place, mobile-first.
* **Formulaires & validation** : [Reactive Forms Angular](https://angular.io/guide/reactive-forms) + [Zod](https://zod.dev/)
  → Gestion robuste des formulaires avec validation côté client.
* **Gestion des données côté client** : [RxJS](https://rxjs.dev/) + Services Angular
  → Programmation réactive, gestion des flux de données temps réel.
* **Calendrier** : [FullCalendar Angular](https://fullcalendar.io/docs/angular)
  → Affichage et gestion des créneaux horaires.

---

## **Backend**

* **Framework API** : [NestJS](https://nestjs.com/) (Node.js, TypeScript)
  → Inspiré d’Angular, architecture modulaire (controllers, services, modules).
* **ORM** : [Prisma](https://www.prisma.io/)
  → Mapping objet-relationnel moderne, typé et simple à utiliser.
* **Sécurité API** :

  * Authentification par **JWT**
  * Middleware de vérification pour routes protégées
  * Validation des entrées avec [class-validator](https://github.com/typestack/class-validator)
* **Déploiement Backend** : [Render](https://render.com/) ou [Railway](https://railway.app/) (plans gratuits disponibles).

---

## **Base de données**

* **Type** : PostgreSQL

  * Dev local : PostgreSQL via **Docker**
  * Prod : PostgreSQL hébergé (Render, Railway, Supabase)
* **Gestion BDD** : Prisma Migrate (migrations automatiques)
* **Tables** : Selon schéma métier (User, Prestation, Reservation, etc.)
* **Extensions utiles** : `uuid-ossp` pour IDs uniques.

---

## **Authentification**

* **Méthode** : JWT (JSON Web Tokens)
* **Processus** :

  * Inscription : hash du mot de passe avec [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
  * Connexion : vérification + génération du JWT
  * Stockage du token côté client : `localStorage` ou `sessionStorage`
* **Gestion des rôles** : Middleware dans NestJS pour ADMIN / USER

---

## **Outils & Services**

* **Stockage fichiers** : Optionnel — stockage local ou service cloud (Supabase Storage / Cloudinary)
* **Gestion du code** : [GitHub](https://github.com/)
* **CI/CD** :

  * Frontend : Déploiement sur [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/)
  * Backend : Déploiement sur Render / Railway
* **Environnement de développement** :

  * [Docker](https://www.docker.com/) pour PostgreSQL local
  * [Postman](https://www.postman.com/) pour tester l’API
  * [pgAdmin](https://www.pgadmin.org/) pour visualiser la BDD

---

## **Gratuit en production**

* PostgreSQL (Railway / Render Free Tier)
* Backend NestJS (Render / Railway Free Tier)
* Frontend Angular (Vercel / Netlify Free Tier)
* GitHub (Free Tier)
