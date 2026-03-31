# TP 2, 3, 4 - Fullstack

`.env` root:

```bash
MONGO_URI=mongodb://localhost:27017/tp_seance3
PORT=3001
```

```bash
docker compose up --build
```

## Tests API

```bash
chmod +x ./tests.sh
./tests.sh
```

```bash
➜  tp2 git:(main) ✗ ./tests.sh
Lancement des tests API
====================================
1. GET /api/users
OK (200)
{"success":true,"count":3,"data":[{"_id":"69cb6e687185b958003e6003","name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15T00:00:00.000Z"},{"_id":"69cb6e687185b958003e6004","name":"Bob Dupont","email":"bob@example.com","role":"user","createdAt":"2024-02-20T00:00:00.000Z"},{"_id":"69cb6e687185b958003e6005","name":"Clara Lemoine","email":"clara@example.com","role":"user","createdAt":"2024-03-10T00:00:00.000Z"}]}
----------------------
2. POST /api/users
{"success":true,"data":{"name":"Bob Dupont","email":"bob1774940172@example.com","role":"user","_id":"69cb700cf952b1cf24e05094","createdAt":"2026-03-31T06:56:12.785Z"}}
ID créé: 69cb700cf952b1cf24e05094
----------------------
3. GET /api/users/:id
OK (200)
{"success":true,"data":{"_id":"69cb700cf952b1cf24e05094","name":"Bob Dupont","email":"bob1774940172@example.com","role":"user","createdAt":"2026-03-31T06:56:12.785Z"}}
----------------------
4. PUT /api/users/:id
OK (200)
{"success":true,"data":{"_id":"69cb700cf952b1cf24e05094","name":"Bob Dupont","email":"bob1774940172@example.com","role":"admin","createdAt":"2026-03-31T06:56:12.785Z"}}
----------------------
5. GET /api/users (vérifier count=4)
OK (200)
{"success":true,"count":4,"data":[{"_id":"69cb6e687185b958003e6003","name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15T00:00:00.000Z"},{"_id":"69cb6e687185b958003e6004","name":"Bob Dupont","email":"bob@example.com","role":"user","createdAt":"2024-02-20T00:00:00.000Z"},{"_id":"69cb6e687185b958003e6005","name":"Clara Lemoine","email":"clara@example.com","role":"user","createdAt":"2024-03-10T00:00:00.000Z"},{"_id":"69cb700cf952b1cf24e05094","name":"Bob Dupont","email":"bob1774940172@example.com","role":"admin","createdAt":"2026-03-31T06:56:12.785Z"}]}
----------------------
5b. GET /api/users?page=1&limit=2 (pagination)
OK (200)
{"success":true,"page":1,"limit":2,"totalCount":4,"totalPages":2,"count":2,"data":[{"_id":"69cb6e687185b958003e6003","name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15T00:00:00.000Z"},{"_id":"69cb6e687185b958003e6004","name":"Bob Dupont","email":"bob@example.com","role":"user","createdAt":"2024-02-20T00:00:00.000Z"}]}
----------------------
5c. GET /api/users?search=ali (recherche)
OK (200)
{"success":true,"count":1,"data":[{"_id":"69cb6e687185b958003e6003","name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15T00:00:00.000Z"}]}
----------------------
6. DELETE /api/users/:id
OK (204)
----------------------
7. GET utilisateur supprimé (404 attendu)
OK (404)
{"success":false,"message":"Utilisateur non trouvé"}
----------------------
TESTS D'ERREURS
POST sans name/email
OK (400)
POST email déjà existant (409 attendu)
OK (409)
GET utilisateur inexistant
OK (404)
PUT utilisateur inexistant
OK (404)
DELETE utilisateur inexistant
OK (404)
GET id invalide (ObjectId)
OK (400)
PUT id invalide (ObjectId)
OK (400)
DELETE id invalide (ObjectId)
OK (400)
OK: tous les tests ont réussi

```
