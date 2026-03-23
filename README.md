# Netflim_AUTH – Microservice d’authentification

## Table des matières
1. [Vue d’ensemble](#vue-densemble)
2. [Installation et configuration](#installation-et-configuration)
3. [Architecture](#architecture)
4. [Authentification](#authentification)
5. [Endpoints résumé](#endpoints-résumé)
6. [Modèles de données](#modèles-de-données)
7. [Exemples d’utilisation](#exemples-dutilisation)
8. [Codes HTTP](#codes-http)
9. [Cas d’erreur courants](#cas-derreur-courants)
10. [Bonnes pratiques](#bonnes-pratiques)
11. [Support et contact](#support-et-contact)

---

## Vue d’ensemble

**Netflim AUTH** est le microservice d’authentification pour la plateforme Netflim.  
Il gère la création d’utilisateurs, l’authentification via JWT, et l’envoi d’e-mails (alert-login, alert-signin, reset-password).  

**Informations clés :**
- **Version :** 1.0.0
- **Type :** REST API (Express.js + Node.js + MySQL)
- **Port par défaut :** 4000
- **Documentation :** Swagger/OpenAPI 3.0
- **Communication inter-service :** `x-service-token`

---

## Installation et configuration

### Prérequis
- Node.js >= 18  
- npm >= 9  
- MySQL >= 5.7  
- Git

### Installation
```bash
git clone https://github.com/Tyovo18/Netflim_AUTH.git
cd Netflim_AUTH
npm install
````

### Variables d’environnement

Créer `.env` à la racine :

```env
PORT=4000
NODE_ENV=development

# MySQL
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# JWT
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<your_refresh_secret_key>
JWT_REFRESH_EXPIRES_IN=7d

# Service Auth Token
AUTH_SERVICE_TOKEN=token-connexion

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SERVICE_TOKEN=mailtrap_token_12345
```

### Base de données

```sql
CREATE DATABASE netflim_auth;
```

> Décommentez `await sequelize.sync({ alter: true });` dans `database.js` la première fois pour créer les tables.

### Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

API disponible à `http://localhost:4000`
Swagger : `http://localhost:4000/api-docs`

---

## Architecture

### Structure du projet

```
src/
├─ config/        # DB, env, swagger
├─ controllers/   # auth, user, email
├─ middlewares/   # service-auth
├─ models/        # user
├─ repositories/  # user
├─ routes/        # auth, user, email
├─ services/      # auth, user, mailer
├─ templates/     # emails
├─ utils/         # jwt, axios, mailer, password, template-engine
├─ validators/
├─ app.js
└─ server.js
```

### Architecture en couches

```
Routes → Controllers → Services → Base de données / SMTP → Services externes
```

---

## Authentification

* **JWT Bearer Token** : pour routes protégées
  Header : `Authorization: Bearer <JWT>`
* **Service Token** : pour communication inter-service
  Header : `x-service-token: <AUTH_SERVICE_TOKEN>`

---

## Endpoints résumé

| Méthode | Endpoint                 | Description                     |
| ------- | ------------------------ | ------------------------------- |
| POST    | /auth/register           | Créer un nouvel utilisateur     |
| POST    | /auth/login              | Connexion utilisateur           |
| GET     | /auth/verify             | Vérifier JWT                    |
| POST    | /users                   | Créer un utilisateur (Admin)    |
| GET     | /users                   | Récupérer tous les utilisateurs |
| GET     | /users/{id}              | Récupérer un utilisateur        |
| PUT     | /users/{id}              | Mettre à jour un utilisateur    |
| DELETE  | /users/{id}              | Supprimer un utilisateur        |
| POST    | /api/mail/alert-login    | Envoyer alerte login            |
| POST    | /api/mail/alert-signin   | Envoyer mail création compte    |
| POST    | /api/mail/reset-password | Envoyer mail réinitialisation   |

---

## Modèles de données

### User

```json
{
  "id": "uuid",
  "username": "emi_lim",
  "email": "emi@gmail.com",
  "createdAt": "2026-02-10T12:00:00Z"
}
```

### AuthResponse

```json
{
  "user": { "id": "uuid", "username": "emi_lim", "email": "emi@gmail.com" },
  "accessToken": "jwt_token_here"
}
```

### VerifyResponse

```json
{
  "valid": true,
  "user": { "id": "uuid", "username": "emi_lim", "email": "emi@gmail.com" }
}
```

### ErrorResponse

```json
{ "message": "Token invalide ou mot de passe incorrect" }
```

---

## Exemples d’utilisation

**Créer un utilisateur (Admin)**

```bash
curl -X POST http://localhost:4000/users \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"username":"emi_lim","email":"emi@gmail.com","password":"SecurePass456"}'
```

**Connexion utilisateur**

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"emi@gmail.com","password":"MySecurePass123"}'
```

**Envoyer alerte login**

```bash
curl -X POST http://localhost:4000/api/mail/alert-login \
  -H "Content-Type: application/json" \
  -d '{"to":"emi@gmail.com"}'
```

**Vérifier JWT**

```bash
curl -X GET http://localhost:4000/auth/verify \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "x-service-token: token-connexion"
```

---

## Codes HTTP

| Code | Sens         | Exemple                                |
| ---- | ------------ | -------------------------------------- |
| 200  | OK           | Requête réussie                        |
| 201  | Created      | Ressource créée                        |
| 400  | Bad Request  | Données invalides                      |
| 401  | Unauthorized | Token invalide ou manquant             |
| 403  | Forbidden    | Service token invalide                 |
| 404  | Not Found    | Ressource inexistante                  |
| 409  | Conflict     | Conflit (email/username déjà existant) |
| 500  | Server Error | Erreur serveur                         |

---

## Cas d’erreur courants

**401 – Token invalide**

```json
{ "message": "Token invalide ou mot de passe incorrect" }
```

**404 – Utilisateur non trouvé**

```json
{ "message": "Utilisateur introuvable" }
```

---

## Bonnes pratiques

1. Toujours utiliser JWT pour routes protégées
2. Valider les données côté client
3. Ne jamais exposer secrets (`JWT_SECRET`, `SMTP_PASS`)
4. Respecter formats email et mot de passe
5. Garder services modulaires (auth, users, mail)

---

## Support et contact

* GitHub : [https://github.com/Tyovo18/Netflim_AUTH](https://github.com/Tyovo18/Netflim_AUTH)
* Issues : [https://github.com/Tyovo18/Netflim_AUTH/issues](https://github.com/Tyovo18/Netflim_AUTH/issues)
* Swagger : `http://localhost:4000/api-docs`


