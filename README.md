# Netflim_SMTP – Microservice SMTP

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

**Netflim SMTP** est le microservice d’envoi d’e-mails pour la plateforme Netflim.  
Il gère l’envoi d’e-mails via SMTP pour les alertes (login, création de compte, réinitialisation de mot de passe).  

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
git clone https://github.com/Tyovo18/Netflim_SMTP.git
cd Netflim_SMTP
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
CREATE DATABASE netflim_smtp;
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
├─ controllers/   # email
├─ middlewares/   # service-auth
├─ models/        # (si nécessaire)
├─ repositories/  # (si nécessaire)
├─ routes/        # email
├─ services/      # mailer
├─ templates/     # emails
├─ utils/         # axios, mailer, template-engine
├─ validators/    # email
├─ app.js
└─ server.js
```

### Architecture en couches

```
Routes → Controllers → Services → SMTP → Services externes
```

---

## Authentification

* **Service Token** : pour communication inter-service
  Header : `x-service-token: <AUTH_SERVICE_TOKEN>`

---

## Endpoints résumé

| Méthode | Endpoint                 | Description                     |
| ------- | ------------------------ | ------------------------------- |
| POST    | /api/mail/alert-login    | Envoyer alerte login            |
| POST    | /api/mail/alert-signin   | Envoyer mail création compte    |
| POST    | /api/mail/reset-password | Envoyer mail réinitialisation   |

---

## Modèles de données

### EmailRequest

```json
{
  "to": "user@example.com",
  "subject": "Alerte de connexion",
  "body": "Contenu de l'e-mail"
}
```

### EmailResponse

```json
{
  "success": true,
  "message": "E-mail envoyé avec succès"
}
```

### ErrorResponse

```json
{ "message": "Erreur lors de l'envoi de l'e-mail" }
```

---

## Exemples d’utilisation

**Envoyer alerte login**

```bash
curl -X POST http://localhost:4000/api/mail/alert-login \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com"}'
```

**Envoyer alerte création de compte**

```bash
curl -X POST http://localhost:4000/api/mail/alert-signin \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com"}'
```

**Envoyer mail de réinitialisation**

```bash
curl -X POST http://localhost:4000/api/mail/reset-password \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com"}'
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
| 409  | Conflict     | Conflit (email déjà existant)          |
| 500  | Server Error | Erreur serveur                         |

---

## Cas d’erreur courants

**400 – Données invalides**

```json
{ "message": "Adresse e-mail invalide" }
```

**403 – Service token invalide**

```json
{ "message": "Token de service non autorisé" }
```

---

## Bonnes pratiques

1. Valider les adresses e-mail côté client
2. Ne jamais exposer les informations SMTP (`SMTP_PASS`)
3. Respecter les formats d’e-mail
4. Garder les services modulaires (mailer, templates)

---

## Configuration SMTP

### Avec Gmail (production)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
```

Activer la validation en deux étapes sur votre compte Google, puis générer un **mot de passe d'application** sur https://myaccount.google.com/apppasswords.

### Avec Mailtrap (tests)

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<user_mailtrap>
SMTP_PASS=<pass_mailtrap>
```

Créer un compte sur https://mailtrap.io, récupérer les credentials dans votre inbox de test.

## Notes importantes

- Le port par défaut est **4005**
- Ce service est appelé **automatiquement** par AUTH lors du register et du login
- Les routes ne nécessitent pas de JWT, elles sont protégées par `AUTH_SERVICE_TOKEN`

## Support et contact

* GitHub : [https://github.com/Tyovo18/Netflim_SMTP](https://github.com/Tyovo18/Netflim_SMTP)
* Issues : [https://github.com/Tyovo18/Netflim_SMTP/issues](https://github.com/Tyovo18/Netflim_SMTP/issues)
* Swagger : `http://localhost:4005/api-docs`


