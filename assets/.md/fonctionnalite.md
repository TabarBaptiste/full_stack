# Fonctionnalités (Backend)

## 🔐 AUTHENTIFICATION & GESTION DES UTILISATEURS

### Utilisateurs (clients ou admin)

* [x] 🔒 Inscription (client)
* [x] 🔒 Connexion (JWT ou autre)
* [ ] 🔒 Déconnexion (côté front, mais refresh côté backend)
* [ ] 🔁 Refresh token (si besoin)
* [ ] 🔧 Modifier ses informations personnelles
* [ ] 🔧 Modifier son mot de passe
* [ ] 🔧 Réinitialisation de mot de passe (si tu veux le faire un jour)
* [x] 🔍 Admin : liste des utilisateurs
* [ ] ❌ Admin : suppression de comptes

---

## 🛍️ PRODUITS

* [x] 📄 Récupérer la liste des produits (filtrés par catégorie)
* [x] 📄 Récupérer un produit par ID
* [x] ✅ Ajouter un produit (admin)
* [x] 🔧 Modifier un produit (admin)
* [x] ❌ Supprimer un produit (admin)

---

## 🧴 PRESTATIONS

* [x] 📄 Récupérer la liste des prestations (par catégorie)
* [x] 📄 Récupérer une prestation par ID
* [x] ✅ Ajouter une prestation (admin)
* [x] 🔧 Modifier une prestation (admin)
* [x] ❌ Supprimer une prestation (admin)

---

## 📅 DISPONIBILITÉS

* [ ] ✅ Définir une plage horaire récurrente (ex : lundi de 9h à 17h)
* [ ] ❌ Supprimer une plage horaire (annulation régulière)
* [ ] 📅 Définir une exception (fermeture exceptionnelle, jour férié, absence)
* [ ] 📅 Définir une disponibilité unique (ex : créneau libre spécifique)
* [ ] 📄 Lister les créneaux disponibles pour un jour/une semaine donnée (pour affichage dans le calendrier côté client)
* [ ] 🔄 Générer dynamiquement les créneaux disponibles (via backend ou calendrier FullCalendar) en fonction des plages & rendez-vous déjà pris

---

## 📆 RÉSERVATIONS

* [ ] ✅ Prendre rendez-vous (client)
* [ ] 📄 Lister ses propres réservations (client)
* [ ] 📄 Admin : lister toutes les réservations
<!-- * [ ] 🔧 Modifier un rendez-vous (client ou admin) -->
* [ ] ❌ Annuler un rendez-vous (client ou admin)
* [ ] 🔁 Admin : changer le statut (confirmé / annulé)

---

## 🛒 ACHATS DE PRODUITS

* [ ] 📄 Lister ses achats (client)
* [ ] 📄 Admin : lister tous les achats
* [ ] ✅ Effectuer un achat (client) — sans paiement en ligne, juste une commande
* [ ] 🔁 Admin : changer le statut (livré / annulé)

---

## 📚 CATÉGORIES (Produits & Massages)

* [x] 📄 Lister toutes les catégories
* [x] ✅ Ajouter une catégorie (admin)
* [x] 🔧 Modifier une catégorie (admin)
* [x] ❌ Supprimer une catégorie (admin)

---

## 💬 TÉMOIGNAGES / AVIS

* [ ] 📄 Lister les témoignages (public)
* [ ] ✅ Ajouter un témoignage (client)
* [ ] ❌ Supprimer/modérer un témoignage (admin)

---

## 🖼️ GALERIE (Photos & Vidéos)

* [ ] 📄 Lister les médias (public)
* [ ] ✅ Ajouter un média (admin)
* [ ] ❌ Supprimer un média (admin)

---

## 📨 NEWSLETTER (optionnel)

* [ ] ✅ S’inscrire à la newsletter
* [ ] ❌ Se désinscrire
* [ ] 📤 Admin : envoyer une newsletter (si fait depuis back)

---

## 🛠️ ADMIN DASHBOARD (API utilisée par le front admin)

* [ ] 📊 Statistiques simples : nb de réservations, nb d’achats, chiffre d’affaires estimé, créneaux disponibles
* [ ] 🔍 Rechercher par nom/email/date dans les réservations ou achats
