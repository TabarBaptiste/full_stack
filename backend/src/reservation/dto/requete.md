# Requête

1. Créer une réservation (POST)

```json
{
  "startDate": "2025-08-15T09:00:00.000Z",
  "endDate": "2025-08-15T10:30:00.000Z",
  "status": "PENDING",
  "price": 65.0,
  "userId": 1,
  "prestationId": 1
}
```

2. URLs avec paramètres de requête

- Filtrer par utilisateur : `GET /reservations?userId=1`
- Filtrer par statut : `GET /reservations?status=CONFIRMED`
- Filtrer par période : `GET /reservations?startDate=2025-08-01&endDate=2025-08-31`
- Combiné : `GET /reservations?userId=1&status=PENDING`
