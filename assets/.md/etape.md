# Étape de conception du projet

## 1️⃣ Initialisation du projet Next.js

* On crée un projet **Next.js 15** (app router)
* On active **TypeScript** et **TailwindCSS** pour le style
* On installe le SDK **Supabase JS** et on configure la connexion

## 2️⃣ Connexion à Supabase

* Mettre la clé `anon` côté client
* Mettre la clé `service_role` côté serveur (dans les API Routes) pour les opérations admin
* Vérifier qu’on peut :

  * s’inscrire / se connecter
  * récupérer le profil connecté
  * faire un CRUD simple sur une table

## 3️⃣ Structure de base de l’app

* **Auth** : pages Login / Signup (ou modales)
* **Layout admin** : accès uniquement pour `role = 'ADMIN'`
* **Layout public** : accès aux clients

## 4️⃣ Fonctionnalités prioritaires

* Gestion des prestations (CRUD admin)
* Gestion des disponibilités
* Réservation d’un créneau côté client
* Liste des réservations côté admin
