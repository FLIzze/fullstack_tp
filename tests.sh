#!/bin/bash

BASE_URL="http://localhost:3001/api/users"

set -euo pipefail

echo "Lancement des tests API"
echo "===================================="

# Dépendances
command -v jq >/dev/null 2>&1 || { echo "ERREUR: jq est requis pour ce script"; exit 1; }

# Générer un email unique pour éviter conflits CI
EMAIL="bob$(date +%s)@example.com"

# Fonction de vérification de status HTTP
check_status() {
  if [ "$1" -ne "$2" ]; then
    echo "ERREUR: attendu $2 mais reçu $1"
    exit 1
  else
    echo "OK ($1)"
  fi
}

# Petit helper: vérifier qu'une clé JSON existe
assert_jq_key() {
  local key="$1"
  if ! jq -e "$key" response.json >/dev/null 2>&1; then
    echo "ERREUR: clé JSON manquante ou invalide: $key"
    cat response.json || true
    exit 1
  fi
}

# =========================
echo "1. GET /api/users"
STATUS=$(curl -s -o response.json -w "%{http_code}" $BASE_URL)
check_status $STATUS 200
cat response.json
echo -e "\n----------------------"

# =========================
echo "2. POST /api/users"
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Bob Dupont\",\"email\":\"$EMAIL\",\"role\":\"user\"}")

echo $CREATE_RESPONSE

USER_ID=$(echo $CREATE_RESPONSE | jq -r '.data._id // .data.id // .id')

if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
  echo "Erreur création utilisateur"
  exit 1
fi

echo "ID créé: $USER_ID"
echo "----------------------"

# =========================
echo "3. GET /api/users/:id"
STATUS=$(curl -s -o response.json -w "%{http_code}" $BASE_URL/$USER_ID)
check_status $STATUS 200
cat response.json
echo -e "\n----------------------"

# =========================
echo "4. PUT /api/users/:id"
STATUS=$(curl -s -X PUT $BASE_URL/$USER_ID \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  -o response.json -w "%{http_code}")
check_status $STATUS 200
cat response.json
echo -e "\n----------------------"

# =========================
echo "5. GET /api/users (vérifier count=4)"
STATUS=$(curl -s -o response.json -w "%{http_code}" $BASE_URL)
check_status $STATUS 200
cat response.json
echo -e "\n----------------------"

# =========================
echo "5b. GET /api/users?page=1&limit=2 (pagination)"
STATUS=$(curl -s -o response.json -w "%{http_code}" "$BASE_URL?page=1&limit=2")
check_status $STATUS 200
assert_jq_key '.page'
assert_jq_key '.limit'
assert_jq_key '.totalCount'
assert_jq_key '.totalPages'
assert_jq_key '.data | length'
cat response.json
echo -e "\n----------------------"

# =========================
echo "5c. GET /api/users?search=ali (recherche)"
STATUS=$(curl -s -o response.json -w "%{http_code}" "$BASE_URL?search=ali")
check_status $STATUS 200
jq -e '.data | map(.name) | any(test("Alice"; "i"))' response.json >/dev/null
cat response.json
echo -e "\n----------------------"

# =========================
echo "6. DELETE /api/users/:id"
STATUS=$(curl -s -X DELETE $BASE_URL/$USER_ID -o /dev/null -w "%{http_code}")
check_status $STATUS 204
echo "----------------------"

# =========================
echo "7. GET utilisateur supprimé (404 attendu)"
STATUS=$(curl -s -o response.json -w "%{http_code}" $BASE_URL/$USER_ID)
check_status $STATUS 404
cat response.json
echo -e "\n----------------------"

# =========================
echo "TESTS D'ERREURS"

echo "POST sans name/email"
STATUS=$(curl -s -X POST $BASE_URL -o /dev/null \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "%{http_code}")
check_status $STATUS 400

echo "POST email déjà existant (409 attendu)"
STATUS=$(curl -s -X POST $BASE_URL -o /dev/null \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Clone","email":"alice@example.com","role":"user"}' \
  -w "%{http_code}")
check_status $STATUS 409

echo "GET utilisateur inexistant"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/000000000000000000000000)
check_status $STATUS 404

echo "PUT utilisateur inexistant"
STATUS=$(curl -s -X PUT $BASE_URL/000000000000000000000000 -o /dev/null \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  -w "%{http_code}")
check_status $STATUS 404

echo "DELETE utilisateur inexistant"
STATUS=$(curl -s -X DELETE $BASE_URL/000000000000000000000000 -o /dev/null \
  -w "%{http_code}")
check_status $STATUS 404

echo "GET id invalide (ObjectId)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/123)
check_status $STATUS 400

echo "PUT id invalide (ObjectId)"
STATUS=$(curl -s -X PUT $BASE_URL/123 -o /dev/null \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  -w "%{http_code}")
check_status $STATUS 400

echo "DELETE id invalide (ObjectId)"
STATUS=$(curl -s -X DELETE $BASE_URL/123 -o /dev/null -w "%{http_code}")
check_status $STATUS 400

echo "OK: tous les tests ont réussi"
