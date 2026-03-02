# M1P13 MEAN — Mall Center

Système de gestion d'un centre commercial en ligne — stack MEAN (MongoDB, Express, Angular, Node.js).

Trois espaces distincts : **Client**, **Boutique** et **Administrateur**.

---

## Liens de déploiement (Production)

| Service  | URL |
|----------|-----|
| Frontend | https://m1p13mean.tojotianh.me |
| Backend  | https://m1p13mean-hoseia-tojo.onrender.com |

---

## Liens locaux (Développement)

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend  | http://localhost:3000 |

---

## Pages d'authentification

| Espace       | Connexion                                                           | Inscription                                                             |
|--------------|---------------------------------------------------------------------|-------------------------------------------------------------------------|
| Client       | http://localhost:4200/login                                         | http://localhost:4200/register                                          |
| Boutique     | http://localhost:4200/login-boutique                                | http://localhost:4200/register-boutique                                 |
| Admin        | http://localhost:4200/admin/login *(accès direct uniquement)*       | http://localhost:4200/admin/register *(accès direct uniquement)*        |

> L'espace admin est **volontairement séparé** des espaces client et boutique.
> Son URL n'est pas accessible depuis les pages publiques.

---

## Routes — Espace Client

| Page                   | URL                                         |
|------------------------|---------------------------------------------|
| Accueil                | `/home`                                     |
| Catalogue produits     | `/products`                                 |
| Détail produit         | `/product/:id`                              |
| Liste des boutiques    | `/shops`                                    |
| Détail boutique        | `/shop/:id`                                 |
| Panier                 | `/cart`                                     |
| Paiement               | `/checkout`                                 |
| Mes commandes          | `/orders/my-orders`                         |
| Historique d'achats    | `/orders/history`                           |
| Détail commande        | `/orders/:id`                               |
| Confirmation commande  | `/orders/confirmation/:id`                  |

---

## Routes — Espace Boutique

| Page                   | URL                                         |
|------------------------|---------------------------------------------|
| Tableau de bord        | `/boutique-dashboard`                       |
| Ma boutique            | `/my-shop`                                  |
| Mes produits           | `/my-products`                              |
| Ajouter un produit     | `/my-products/new`                          |
| Modifier un produit    | `/my-products/:id/edit`                     |
| Gestion du stock       | `/my-products/stock`                        |
| Commandes reçues       | `/my-orders`                                |
| Détail commande        | `/my-orders/:id`                            |

---

## Routes — Espace Administrateur

> Accessible uniquement via `/admin/login` — non lié aux espaces client/boutique.

| Page                        | URL                                              |
|-----------------------------|--------------------------------------------------|
| Tableau de bord             | `/dashboard`                                     |
| Gestion utilisateurs        | `/admin/users`                                   |
| Gestion boutiques           | `/admin/shops`                                   |
| Gestion catégories          | `/categories`                                    |
| Gestion commandes           | `/admin/orders`                                  |
| Demandes propriétaires      | `/admin/register-boutique-requests`              |
| Demandes d'ouverture shop   | `/admin/shop-requests`                           |

---

## Comptes de test

> Lancer `npm run seed` dans le dossier `backend/` pour initialiser les données.

### Admin
| Email           | Mot de passe |
|-----------------|--------------|
| admin@mall.com  | Admin123!    |

### Boutiques
| Boutique              | Email                    | Mot de passe   |
|-----------------------|--------------------------|----------------|
| Lisy Art Gallery      | lisy@gmail.com           | Boutique123!   |
| Codal Madagascar      | codal@gmail.com          | Boutique123!   |
| Homeopharma           | homeopharma@gmail.com    | Boutique123!   |
| Mass'In               | massin@gmail.com         | Boutique123!   |
| Habibo Group Shop     | habibo@gmail.com         | Boutique123!   |

### Clients
| Nom             | Email                    | Mot de passe |
|-----------------|--------------------------|--------------|
| Jean Rakoto     | rakoto.jean@gmail.com    | Client123!   |
| Mialy Ravaka    | mialy.ravaka@gmail.com   | Client123!   |
| Fara Nirina     | fara.nirina@gmail.com    | Client123!   |

---

## Installation & Lancement

### Prérequis
- Node.js >= 18
- MongoDB local ou URI distante
- Angular CLI (`npm install -g @angular/cli`)

### Backend

```bash
cd backend
cp .env.example .env      # Configurer MONGO_URI, JWT_SECRET, CORS_ORIGIN
npm install
npm run seed              # Charger les données de test (efface tout sauf admin)
npm start                 # Démarre sur http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
ng serve                  # Démarre sur http://localhost:4200
```

---

## Architecture

```
backend/
├── routes/         # Endpoints Express (montés sur /api/*)
├── controllers/    # Gestion req/res
├── services/       # Logique métier
├── models/         # Schemas Mongoose (softDeletePlugin partagé)
├── middleware/     # auth.js (JWT), roles.js (checkRole)
└── utils/upload.js # Multer + Sharp (images 800×800, JPEG 72)

frontend/src/app/
├── core/
│   ├── services/   # HTTP services (AuthService, CartService…)
│   ├── guards/     # adminGuard, boutiqueGuard, clientGuard
│   └── interceptors/auth.interceptor.ts
└── features/       # Composants par domaine (auth, catalog, products…)
```

---

## Stack technique

| Couche    | Technologie                         |
|-----------|-------------------------------------|
| Frontend  | Angular 21 — standalone components  |
| UI        | PrimeNG v21 — Aura theme            |
| Backend   | Express.js (Node.js)                |
| Base      | MongoDB — Mongoose                  |
| Auth      | JWT (localStorage)                  |
| Images    | Multer + Sharp                      |
| Deploy    | Vercel (frontend) / Render (backend)|
