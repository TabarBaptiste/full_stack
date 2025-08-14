# **Spécifications Fonctionnelles — Application de Gestion pour Masseuse**

## 1. **Utilisateur (`User`)**

### Création

* Champs obligatoires :

  * `email` (unique)
  * `password` (haché, ≥6 caractères, caractères spéciaux non requis)
  * `firstname`
  * `lastname`
  * `role` (valeur par défaut : `CLIENT`)
* Champ optionnel : `phone`
* **Contrainte** : pas d’email déjà existant en BDD.

### Modification

* Un **CLIENT** peut modifier :

  * `firstname`
  * `lastname`
  * `phone`
  * `email` (sans confirmation pour l’instant)
* Seul un **ADMIN** peut modifier `role`.

### Lecture

* Un utilisateur voit toutes ses données sauf :

  * `password`
  * `role`
* Il peut consulter :

  * L’historique de ses **réservations** (`Reservation`)
  * L’historique de ses **achats** (`Purchase`)
* Il ne peut pas voir les données d’un autre utilisateur.

### Suppression

* Un utilisateur peut supprimer son compte.
* Les **réservations** et **achats** restent stockés pour l’ADMIN (seul l’`userId` subsiste).

---

## 2. **Produit (`Product`)**

### Création

* Seul l’**ADMIN** peut créer :

  * `name`
  * `description` (optionnelle)
  * `price` (≥0)
  * `stock` (≥0)
  * `categoryId` (référence à `Category`, par défaut `2`)

### Modification

* Seul l’**ADMIN** peut modifier un produit.

### Lecture

* Accessible à tous, même non connectés.

### Suppression

* Seul l’**ADMIN** peut supprimer.
* Les **achats** liés restent pour l’historique.

---

## 3. **Prestation (`Prestation`)**

### Création

* Seul l’**ADMIN** peut créer :

  * `title`
  * `description` (optionnelle)
  * `duration` (en minutes, optionnelle)
  * `price` (≥0)
  * `categoryId` (référence à `Category`, par défaut `1`)

### Modification

* Seul l’**ADMIN** peut modifier.

### Lecture

* Accessible à tous, même non connectés.

### Suppression

* Seul l’**ADMIN** peut supprimer.
* Les **réservations** liées restent pour l’historique.

---

## 4. **Réservation (`Reservation`)**

### Création

* Tout utilisateur connecté peut réserver une **prestation** si :

  * Créneau disponible (`RecurringSlot` + `RecurringSlotException` + `OneTimeSlot`)
  * La durée de la prestation n’empiète pas sur un autre créneau
  * Ce n’est pas un jour d’exception (absence de la masseuse)
* Le `price` est figé à la création (pour conserver l’historique même si le prix de la prestation change).

### Modification

* **CLIENT** : peut annuler sa propre réservation.
* **ADMIN** : peut annuler, confirmer, compléter (changer `status`).

### Lecture

* **CLIENT** : accès uniquement à ses réservations (ordre décroissant par `startDate`).

---

## 5. **Commande (`Order`)**

### Création

* Tout utilisateur connecté peut passer une commande si chaque produit a un `stock > 0`.
* Une commande contient une ou plusieurs lignes (`OrderItem`), chacune associée à un produit.
* `totalPrice` = somme des `unitPrice × quantity` pour chaque ligne (figé à la création).
* Décrément immédiat du `stock` pour chaque produit commandé.

### Modification

* **CLIENT** : peut annuler sa propre commande tant qu’elle n’est pas marquée comme `DELIVERED`.
* **ADMIN** : peut annuler, modifier le statut (`PENDING`, `CANCELLED`, `DELIVERED`).

### Lecture

* **CLIENT** : accès uniquement à ses commandes (ordre décroissant par `createdAt`).
* **ADMIN** : accès à toutes les commandes (ordre décroissant par `createdAt`).

---

## 5.1 **Ligne de Commande (`OrderItem`)**

### Création

* Associée à une commande (`orderId`) et à un produit (`productId`).
* Champs figés à la création pour garantir l’historique :

  * `productName`
  * `unitPrice`
  * `quantity`

### Lecture

* Accessible uniquement via la commande à laquelle la ligne est rattachée.

---

## 6. **Avis (`Review`)**

### Création

* Seuls les **CLIENTS** peuvent publier :

  * `content` (obligatoire)
  * `rating` (optionnel)
  * `visible` (par défaut `true`)
* Un **ADMIN** ne peut pas publier d’avis.

### Modification

* Seul l’**ADMIN** peut changer `visible` (pour masquer un avis offensant).

### Lecture

* Accessible à tous, même non connectés.

### Suppression

* Pas de suppression physique, seulement `visible = false`.

---

## 7. **Créneaux Récurrents (`RecurringSlot`)**

### Création

* Seul l’**ADMIN** peut définir un créneau :

  * `dayOfWeek` (0 = Dimanche, 1 = Lundi, etc.)
  * `startTime` (HH\:mm)
  * `endTime` (HH\:mm)
* Exemple par défaut :

  * Lundi–Vendredi : 09:00–12:00 et 13:00–17:00
  * Samedi : 09:00–12:00

### Modification / Suppression

* **ADMIN** seulement.
* Si une réservation existe sur le créneau, elle est annulée.

### Lecture

* Tout utilisateur peut voir les disponibilités.

---

## 8. **Exceptions de Créneau (`RecurringSlotException`)**

### Création

* **ADMIN** peut marquer un jour exceptionnellement non travaillé (`date`).
* Réservations sur ce jour = annulées.

### Modification / Suppression

* **ADMIN** seulement.
* Même règle d’annulation que pour la création.

---

## 9. **Créneau Ponctuel (`OneTimeSlot`)**

* Permet d’ajouter un créneau unique hors récurrence.
* Champs : `date`, `startTime`, `endTime`.

---

## 10. **Disponibilités (fonction logique)**

* La disponibilité est calculée en combinant :

  1. Les créneaux récurrents (`RecurringSlot`)
  2. Les exceptions (`RecurringSlotException`)
  3. Les créneaux ponctuels (`OneTimeSlot`)
  4. Les réservations existantes (`Reservation`)
  5. La durée des prestations (`duration`)
  6. Un **temps de pause paramétrable** entre prestations (ex. 15 min).

* Interface côté utilisateur :

  * Sélection de la prestation
  * Affichage d’un calendrier mensuel
  * Clic sur un jour = affichage des créneaux disponibles
  * Sélection de l’horaire + récapitulatif avant validation.
