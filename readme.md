# TP2 

---

## Installation & démarrage

```bash
bun install
bun run dev
```

## Livrable

```bash
chmod +x ./tests.sh
./tests.sh
```

```bash
Lancement des tests API
====================================
1. GET /api/users
OK (200)
{"success":true,"count":3,"data":[{"id":1,"name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15"},{"id":2,"name":"Bob Dupont","email":"bob@example.com","role":"user","createdAt":"2024-02-20"},{"id":3,"name":"Clara Lemoine","email":"clara@example.com","role":"user","createdAt":"2024-03-10"}]}
----------------------
2. POST /api/users
{"success":true,"data":{"id":5,"name":"Bob Dupont","email":"bob1774619145@example.com","role":"user","createdAt":"2026-03-27"}}
ID créé: 5
----------------------
3. GET /api/users/:id
OK (200)
{"success":true,"data":{"id":5,"name":"Bob Dupont","email":"bob1774619145@example.com","role":"user","createdAt":"2026-03-27"}}
----------------------
4. PUT /api/users/:id
OK (200)
{"success":true,"data":{"id":5,"name":"Bob Dupont","email":"bob1774619145@example.com","role":"admin","createdAt":"2026-03-27"}}
----------------------
5. GET /api/users (vérifier count=4)
OK (200)
{"success":true,"count":4,"data":[{"id":1,"name":"Alice Martin","email":"alice@example.com","role":"admin","createdAt":"2024-01-15"},{"id":2,"name":"Bob Dupont","email":"bob@example.com","role":"user","createdAt":"2024-02-20"},{"id":3,"name":"Clara Lemoine","email":"clara@example.com","role":"user","createdAt":"2024-03-10"},{"id":5,"name":"Bob Dupont","email":"bob1774619145@example.com","role":"admin","createdAt":"2026-03-27"}]}
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
./tests.sh: line 13: [: {"success":false,"message":"Les: integer expected
OK ({"success":false,"message":"Les)
GET utilisateur inexistant
OK (404)
PUT utilisateur inexistant
./tests.sh: line 13: [: {"success":false,"message":"Utilisateur: integer expected
OK ({"success":false,"message":"Utilisateur)
DELETE utilisateur inexistant
./tests.sh: line 13: [: {"success":false,"message":"Utilisateur: integer expected
OK ({"success":false,"message":"Utilisateur)
```
