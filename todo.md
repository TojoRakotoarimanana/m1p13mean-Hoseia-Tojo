# 📋 TODOLIST - APPLICATION CENTRE COMMERCIAL
## Projet divisé en 4 Sprints pour 2 Développeurs Fullstack

---

## 👥 RÉPARTITION DES TÂCHES

**Développeur 1** : Focus Espace Admin + Boutique
**Développeur 2** : Focus Espace Client + Infrastructure commune

---

## 🚀 SPRINT 0 - SETUP INITIAL (3-4 jours)
**À faire ensemble en pair programming**

### Configuration Environnement
- [ ] Créer le repository Git et branches (main, dev, feature/*)
- [ ] Initialiser le projet Backend (Express + Node.js)
- [ ] Initialiser le projet Frontend (Angular)
- [ ] Configurer MongoDB (local + Atlas cloud)
- [ ] Créer le fichier .env avec variables d'environnement
- [ ] Installer toutes les dépendances nécessaires
- [ ] Mettre en place ESLint/Prettier pour le code
- [ ] Créer la structure de dossiers du projet

### Backend - Structure de base
- [ ] Créer la structure MVC (models, controllers, routes, middlewares)
- [ ] Intégrer les modèles MongoDB (models.js)
- [ ] Configurer la connexion à MongoDB
- [ ] Créer le serveur Express (server.js)
- [ ] Configurer CORS et body-parser

### Frontend - Structure de base
- [ ] Créer la structure Angular (modules, components, services)
- [ ] Installer Angular Material ou Bootstrap
- [ ] Configurer le routing de base
- [ ] Créer le service HTTP interceptor
- [ ] Créer le service d'authentification

### Documentation
- [ ] Créer le README.md avec instructions d'installation
- [ ] Documenter l'architecture du projet
- [ ] Créer un fichier API.md pour documenter les endpoints

---

## 🏃 SPRINT 1 - AUTHENTIFICATION & GESTION UTILISATEURS (1 semaine)

### 👨‍💻 DÉVELOPPEUR 1

#### Backend
- [ ] Créer le controller d'authentification (authController.js)
  - [ ] Route POST /api/auth/register (inscription)
  - [ ] Route POST /api/auth/login (connexion)
  - [ ] Route POST /api/auth/logout (déconnexion)
  - [ ] Route POST /api/auth/forgot-password
- [ ] Créer middleware d'authentification JWT
- [ ] Créer middleware de vérification des rôles (isAdmin, isBoutique, isClient)
- [ ] Implémenter la génération de tokens JWT
- [ ] Tester les endpoints avec Postman/Thunder Client

#### Frontend
- [ ] Créer le module d'authentification (AuthModule)
- [ ] Créer le composant Login
  - [ ] Formulaire de connexion
  - [ ] Validation des champs
  - [ ] Gestion des erreurs
- [ ] Créer le composant Register
  - [ ] Formulaire d'inscription multi-rôles
  - [ ] Validation des champs
- [ ] Créer le service AuthService
  - [ ] Méthodes login(), register(), logout()
  - [ ] Stockage du token dans localStorage
  - [ ] Gestion de l'état utilisateur connecté
- [ ] Créer le guard d'authentification (AuthGuard)
- [ ] Créer le guard de rôle (RoleGuard)

### 👨‍💻 DÉVELOPPEUR 2

#### Backend
- [ ] Créer le controller utilisateurs (userController.js)
  - [ ] Route GET /api/users (liste utilisateurs - admin only)
  - [ ] Route GET /api/users/:id (détails utilisateur)
  - [ ] Route PUT /api/users/:id (modifier profil)
  - [ ] Route DELETE /api/users/:id (soft delete - admin only)
  - [ ] Route PATCH /api/users/:id/block (bloquer/débloquer)
- [ ] Créer les routes (userRoutes.js)
- [ ] Ajouter la validation des données avec express-validator
- [ ] Tester tous les endpoints

#### Frontend
- [ ] Créer le composant Header/Navbar
  - [ ] Menu adaptatif selon le rôle
  - [ ] Bouton de déconnexion
  - [ ] Affichage nom utilisateur
- [ ] Créer le composant Sidebar (navigation)
- [ ] Créer le composant Footer
- [ ] Créer le layout principal (MainLayout)
- [ ] Créer le composant Profil Utilisateur
  - [ ] Affichage des informations
  - [ ] Formulaire de modification
  - [ ] Upload de photo de profil (préparation)

### 🎯 OBJECTIF SPRINT 1
✅ Système d'authentification complet et fonctionnel
✅ Gestion des utilisateurs (CRUD de base)
✅ Interface de connexion/inscription opérationnelle
✅ Navigation de base mise en place

---

## 🏃 SPRINT 2 - ADMIN & BOUTIQUES (2 semaines)

### 👨‍💻 DÉVELOPPEUR 1 - ADMIN & CATÉGORIES

#### Backend
- [ ] Créer le controller catégories (categoryController.js)
  - [ ] Route POST /api/categories (créer catégorie)
  - [ ] Route GET /api/categories (liste catégories)
  - [ ] Route PUT /api/categories/:id (modifier catégorie)
  - [ ] Route DELETE /api/categories/:id (supprimer catégorie)
- [ ] Créer le controller boutiques côté admin (shopAdminController.js)
  - [ ] Route GET /api/admin/shops (liste toutes les boutiques)
  - [ ] Route GET /api/admin/shops/pending (boutiques en attente)
  - [ ] Route PATCH /api/admin/shops/:id/validate (valider boutique)
  - [ ] Route PATCH /api/admin/shops/:id/reject (rejeter boutique)
  - [ ] Route PATCH /api/admin/shops/:id/suspend (suspendre boutique)
  - [ ] Route DELETE /api/admin/shops/:id (supprimer boutique)
- [ ] Créer le controller dashboard admin (dashboardAdminController.js)
  - [ ] Route GET /api/admin/stats (statistiques globales)
  - [ ] Route GET /api/admin/activities (dernières activités)
- [ ] Ajouter filtres et pagination
- [ ] Tester tous les endpoints

#### Frontend - Module Admin
- [ ] Créer le module AdminModule avec routing
- [ ] Créer le Dashboard Admin
  - [ ] Cartes de statistiques (boutiques, clients, commandes)
  - [ ] Graphiques de performance (Chart.js ou ngx-charts)
  - [ ] Liste des dernières activités
- [ ] Créer le composant Gestion Catégories
  - [ ] Liste des catégories (tableau)
  - [ ] Modal d'ajout de catégorie
  - [ ] Modal de modification
  - [ ] Bouton de suppression avec confirmation
- [ ] Créer le composant Gestion Boutiques
  - [ ] Liste de toutes les boutiques (tableau avec filtres)
  - [ ] Filtres (statut, catégorie, recherche)
  - [ ] Actions (valider, rejeter, suspendre, supprimer)
  - [ ] Page de détails d'une boutique
- [ ] Créer le composant Boutiques en Attente
  - [ ] Liste des demandes d'inscription
  - [ ] Prévisualisation des informations
  - [ ] Boutons valider/rejeter
- [ ] Créer le composant Gestion Clients
  - [ ] Liste des clients inscrits
  - [ ] Actions (bloquer/débloquer, voir détails)

### 👨‍💻 DÉVELOPPEUR 2 - ESPACE BOUTIQUE

#### Backend
- [ ] Créer le controller boutiques (shopController.js)
  - [ ] Route POST /api/shops/register (demande d'inscription boutique)
  - [ ] Route GET /api/shops/my-shop (ma boutique)
  - [ ] Route PUT /api/shops/:id (modifier ma boutique)
  - [ ] Route GET /api/shops (liste boutiques publiques)
  - [ ] Route GET /api/shops/:id (détails boutique publique)
- [ ] Créer le controller dashboard boutique (dashboardShopController.js)
  - [ ] Route GET /api/shop/dashboard/stats (mes statistiques)
  - [ ] Route GET /api/shop/dashboard/recent-orders (commandes récentes)
  - [ ] Route GET /api/shop/dashboard/best-products (produits populaires)
- [ ] Créer middleware de vérification propriétaire boutique
- [ ] Ajouter validation et upload d'images (multer)
- [ ] Tester tous les endpoints

#### Frontend - Module Boutique
- [ ] Créer le module ShopModule avec routing
- [ ] Créer le composant Inscription Boutique
  - [ ] Formulaire multi-étapes (infos de base, localisation, horaires)
  - [ ] Upload du logo
  - [ ] Validation complète
- [ ] Créer le Dashboard Boutique
  - [ ] Cartes de statistiques (CA, commandes, produits)
  - [ ] Graphique des ventes
  - [ ] Liste des commandes en attente
  - [ ] Alertes (stock bas, nouvelles commandes)
- [ ] Créer le composant Mon Profil Boutique
  - [ ] Affichage des informations
  - [ ] Formulaire de modification
  - [ ] Gestion des horaires
  - [ ] Upload/modification du logo
- [ ] Créer le service ShopService
  - [ ] Méthodes CRUD pour la boutique
  - [ ] Gestion du cache des données

### 🎯 OBJECTIF SPRINT 2
✅ Espace admin complet et fonctionnel
✅ Système de validation des boutiques opérationnel
✅ Espace boutique avec dashboard et profil
✅ Gestion des catégories complète

---

## 🏃 SPRINT 3 - PRODUITS & CATALOGUE (2 semaines)

### 👨‍💻 DÉVELOPPEUR 1 - GESTION PRODUITS BOUTIQUE

#### Backend
- [ ] Créer le controller produits (productController.js)
  - [ ] Route POST /api/products (créer produit)
  - [ ] Route GET /api/products/my-products (mes produits)
  - [ ] Route GET /api/products/:id (détails produit)
  - [ ] Route PUT /api/products/:id (modifier produit)
  - [ ] Route DELETE /api/products/:id (supprimer produit)
  - [ ] Route PATCH /api/products/:id/stock (mettre à jour stock)
  - [ ] Route PATCH /api/products/:id/promotion (activer/désactiver promotion)
- [ ] Ajouter upload multiple d'images (multer)
- [ ] Créer système de gestion des images (compression, resize)
- [ ] Ajouter validation des données produit
- [ ] Créer endpoint pour les statistiques produits
- [ ] Implémenter pagination et filtres
- [ ] Tester tous les endpoints

#### Frontend - Module Produits Boutique
- [ ] Créer le composant Liste Mes Produits
  - [ ] Tableau avec tous les produits de la boutique
  - [ ] Filtres (catégorie, stock, promotion)
  - [ ] Barre de recherche
  - [ ] Actions rapides (modifier, supprimer, stock)
  - [ ] Indicateurs visuels (stock bas, en promotion)
- [ ] Créer le composant Ajouter/Modifier Produit
  - [ ] Formulaire complet (infos, prix, stock, images)
  - [ ] Upload multiple d'images avec prévisualisation
  - [ ] Gestion des promotions
  - [ ] Catégorisation
  - [ ] Validation complète
- [ ] Créer le composant Gestion Stock
  - [ ] Vue rapide des stocks
  - [ ] Alertes stock bas
  - [ ] Modification rapide des quantités
- [ ] Créer le composant Statistiques Produits
  - [ ] Produits les plus vendus
  - [ ] Produits les plus consultés
  - [ ] Performance des produits en promotion
- [ ] Créer le service ProductService
  - [ ] Méthodes CRUD complètes
  - [ ] Upload et gestion d'images

### 👨‍💻 DÉVELOPPEUR 2 - CATALOGUE CLIENT

#### Backend
- [ ] Créer le controller catalogue (catalogController.js)
  - [ ] Route GET /api/catalog/products (tous les produits publics)
  - [ ] Route GET /api/catalog/products/:id (détails produit)
  - [ ] Route GET /api/catalog/shops (toutes les boutiques actives)
  - [ ] Route GET /api/catalog/shops/:id (détails boutique avec produits)
  - [ ] Route GET /api/catalog/promotions (produits en promotion)
  - [ ] Route GET /api/catalog/search (recherche globale)
  - [ ] Route POST /api/catalog/products/:id/view (incrémenter vues)
- [ ] Implémenter système de recherche avancée
- [ ] Ajouter filtres complexes (prix, catégorie, boutique, promotion)
- [ ] Optimiser les requêtes avec agrégations MongoDB
- [ ] Ajouter pagination performante
- [ ] Tester tous les endpoints

#### Frontend - Module Catalogue Client
- [ ] Créer le composant Page d'Accueil Client
  - [ ] Slider/Carousel de promotions
  - [ ] Section "Boutiques du centre"
  - [ ] Section "Produits en promotion"
  - [ ] Barre de recherche globale
- [ ] Créer le composant Liste Boutiques
  - [ ] Grille de cartes boutiques
  - [ ] Filtres par catégorie
  - [ ] Barre de recherche
  - [ ] Pagination
- [ ] Créer le composant Détails Boutique
  - [ ] Informations de la boutique
  - [ ] Horaires d'ouverture
  - [ ] Contact
  - [ ] Liste des produits de la boutique
- [ ] Créer le composant Liste Produits
  - [ ] Grille de cartes produits
  - [ ] Filtres (catégorie, prix, boutique, promotion)
  - [ ] Tri (prix, nouveauté, popularité)
  - [ ] Barre de recherche
  - [ ] Pagination
- [ ] Créer le composant Détails Produit
  - [ ] Galerie d'images
  - [ ] Informations détaillées
  - [ ] Prix et promotions
  - [ ] Disponibilité du stock
  - [ ] Bouton "Ajouter au panier"
  - [ ] Informations boutique
- [ ] Créer le composant Recherche Globale
  - [ ] Résultats produits et boutiques
  - [ ] Filtres dynamiques
  - [ ] Suggestions de recherche
- [ ] Créer le service CatalogService
  - [ ] Méthodes de récupération des données
  - [ ] Gestion des filtres et recherches
  - [ ] Cache des résultats

### 🎯 OBJECTIF SPRINT 3
✅ Gestion complète des produits pour les boutiques
✅ Catalogue client navigable et filtrable
✅ Système de recherche fonctionnel
✅ Upload et gestion d'images opérationnels

---

## 🏃 SPRINT 4 - PANIER & COMMANDES (2 semaines)

### 👨‍💻 DÉVELOPPEUR 1 - GESTION COMMANDES BOUTIQUE

#### Backend
- [ ] Créer le controller commandes boutique (orderShopController.js)
  - [ ] Route GET /api/shop/orders (mes commandes)
  - [ ] Route GET /api/shop/orders/:id (détails commande)
  - [ ] Route PATCH /api/shop/orders/:id/status (changer statut)
  - [ ] Route GET /api/shop/orders/stats (statistiques commandes)
- [ ] Créer système de notifications
  - [ ] Notification nouvelle commande pour boutique
  - [ ] Notification changement statut pour client
- [ ] Implémenter mise à jour automatique des statistiques boutique
- [ ] Créer endpoint pour l'historique des commandes
- [ ] Ajouter filtres par statut et date
- [ ] Tester tous les endpoints

#### Frontend - Module Commandes Boutique
- [ ] Créer le composant Liste Commandes Boutique
  - [ ] Tableau des commandes
  - [ ] Filtres (statut, date, client)
  - [ ] Badge du nombre de nouvelles commandes
  - [ ] Actions rapides (voir détails, changer statut)
- [ ] Créer le composant Détails Commande Boutique
  - [ ] Informations client
  - [ ] Liste des produits commandés
  - [ ] Montant total
  - [ ] Statut actuel
  - [ ] Boutons d'action (confirmer, préparer, prêt, terminer)
  - [ ] Historique des changements de statut
  - [ ] Notes/commentaires
- [ ] Créer le composant Notifications
  - [ ] Liste des notifications
  - [ ] Badge de nouvelles notifications
  - [ ] Marquer comme lu
  - [ ] Son/alerte pour nouvelle commande
- [ ] Créer le service OrderShopService
  - [ ] Gestion des commandes boutique
  - [ ] Changement de statut
- [ ] Créer le service NotificationService
  - [ ] Récupération des notifications
  - [ ] Gestion de l'état lu/non lu
  - [ ] WebSocket ou polling pour temps réel

### 👨‍💻 DÉVELOPPEUR 2 - PANIER & COMMANDES CLIENT

#### Backend
- [ ] Créer le controller panier (cartController.js)
  - [ ] Route GET /api/cart (mon panier)
  - [ ] Route POST /api/cart/add (ajouter au panier)
  - [ ] Route PUT /api/cart/update/:itemId (modifier quantité)
  - [ ] Route DELETE /api/cart/remove/:itemId (retirer du panier)
  - [ ] Route DELETE /api/cart/clear (vider le panier)
- [ ] Créer le controller commandes client (orderController.js)
  - [ ] Route POST /api/orders (passer commande)
  - [ ] Route GET /api/orders (mes commandes)
  - [ ] Route GET /api/orders/:id (détails commande)
  - [ ] Route DELETE /api/orders/:id (annuler commande)
- [ ] Implémenter logique de commande
  - [ ] Vérification du stock avant commande
  - [ ] Déduction automatique du stock
  - [ ] Création de sous-commandes par boutique
  - [ ] Calcul des totaux
  - [ ] Génération du numéro de commande
- [ ] Créer système de notifications client
- [ ] Implémenter validation des données de livraison
- [ ] Tester tous les endpoints et scénarios

#### Frontend - Module Panier & Commandes Client
- [ ] Créer le composant Panier
  - [ ] Liste des produits dans le panier
  - [ ] Modification des quantités
  - [ ] Suppression d'articles
  - [ ] Calcul du total en temps réel
  - [ ] Badge du nombre d'articles sur l'icône panier
  - [ ] Regroupement par boutique
  - [ ] Bouton "Vider le panier"
  - [ ] Bouton "Passer commande"
- [ ] Créer le composant Tunnel de Commande
  - [ ] Étape 1 : Récapitulatif du panier
  - [ ] Étape 2 : Informations de livraison
  - [ ] Étape 3 : Mode de paiement
  - [ ] Étape 4 : Confirmation
  - [ ] Progression visuelle (stepper)
  - [ ] Validation à chaque étape
- [ ] Créer le composant Confirmation Commande
  - [ ] Numéro de commande
  - [ ] Récapitulatif
  - [ ] Informations de suivi
  - [ ] Bouton "Retour à l'accueil"
- [ ] Créer le composant Mes Commandes
  - [ ] Liste de toutes mes commandes
  - [ ] Filtres (statut, date)
  - [ ] Barre de recherche (numéro de commande)
- [ ] Créer le composant Détails Commande Client
  - [ ] Numéro de commande
  - [ ] Date et heure
  - [ ] Statut actuel avec tracking
  - [ ] Produits commandés (regroupés par boutique)
  - [ ] Montant total
  - [ ] Informations de livraison
  - [ ] Bouton d'annulation (si statut = pending)
- [ ] Créer le composant Historique Commandes
  - [ ] Timeline des anciennes commandes
  - [ ] Possibilité de recommander
- [ ] Créer le service CartService
  - [ ] Gestion du panier (add, update, remove, clear)
  - [ ] Calcul des totaux
  - [ ] Synchronisation avec le backend
  - [ ] Persistance locale (localStorage)
- [ ] Créer le service OrderService
  - [ ] Création de commande
  - [ ] Récupération des commandes
  - [ ] Suivi des statuts

### 🎯 OBJECTIF SPRINT 4
✅ Système de panier complet et fonctionnel
✅ Tunnel de commande opérationnel
✅ Gestion des commandes côté boutique
✅ Gestion des commandes côté client
✅ Système de notifications en temps réel

---

## 🔧 SPRINT FINAL - TESTS & DÉPLOIEMENT (3-5 jours)

### À FAIRE ENSEMBLE

#### Tests
- [ ] Tests unitaires Backend (Jest)
  - [ ] Tester les controllers principaux
  - [ ] Tester les middlewares
  - [ ] Tester les modèles
- [ ] Tests d'intégration API (Postman/Newman)
  - [ ] Collection complète des endpoints
  - [ ] Tests des flux complets (inscription → commande)
- [ ] Tests Frontend (Jasmine/Karma)
  - [ ] Tester les services principaux
  - [ ] Tester les composants critiques
- [ ] Tests end-to-end (Cypress ou Protractor)
  - [ ] Parcours utilisateur complet
  - [ ] Parcours boutique complet
  - [ ] Parcours admin complet

#### Sécurité
- [ ] Vérifier la validation de toutes les entrées
- [ ] Tester la protection contre les injections
- [ ] Vérifier les autorisations et authentifications
- [ ] Ajouter rate limiting sur les endpoints sensibles
- [ ] Sécuriser les uploads de fichiers
- [ ] Configurer les headers de sécurité (helmet)

#### Performance
- [ ] Optimiser les requêtes MongoDB (index, agrégations)
- [ ] Implémenter le lazy loading sur Angular
- [ ] Optimiser les images (compression, formats)
- [ ] Minifier les assets
- [ ] Mettre en place le caching (Redis si nécessaire)

#### Documentation
- [ ] Finaliser la documentation API (Swagger/OpenAPI)
- [ ] Créer le guide utilisateur (Admin)
- [ ] Créer le guide utilisateur (Boutique)
- [ ] Créer le guide utilisateur (Client)
- [ ] Documenter le code (JSDoc/TSDoc)
- [ ] Créer le guide de déploiement

#### Déploiement
- [ ] Préparer l'environnement de production
- [ ] Configurer MongoDB Atlas (production)
- [ ] Déployer le Backend (Heroku/Railway/VPS)
- [ ] Déployer le Frontend (Vercel/Netlify/VPS)
- [ ] Configurer les variables d'environnement production
- [ ] Mettre en place le monitoring (logs, erreurs)
- [ ] Tester l'application en production
- [ ] Créer des comptes de démonstration

#### Données de Test
- [ ] Créer script de seed de la base de données
- [ ] Générer des données de test réalistes
  - [ ] 1 compte admin
  - [ ] 10 boutiques avec produits
  - [ ] 20 clients
  - [ ] 50 produits variés
  - [ ] 30 commandes
- [ ] Créer des images de test pour les produits

### 🎯 OBJECTIF SPRINT FINAL
✅ Application testée et stable
✅ Documentation complète
✅ Application déployée en production
✅ Données de démonstration disponibles

---

## 📊 MÉTRIQUES DE SUIVI PAR SPRINT

### Sprint 1
- [ ] 100% des endpoints d'authentification testés
- [ ] Interface de connexion/inscription opérationnelle
- [ ] Tests de sécurité JWT validés

### Sprint 2
- [ ] Dashboard admin fonctionnel avec vraies données
- [ ] Processus de validation boutique complet
- [ ] Dashboard boutique opérationnel

### Sprint 3
- [ ] 50+ produits de test créés
- [ ] Catalogue client navigable et filtrable
- [ ] Recherche fonctionnelle

### Sprint 4
- [ ] Processus de commande bout-en-bout testé
- [ ] Notifications temps réel fonctionnelles
- [ ] Gestion complète du cycle de vie d'une commande

---

## 🛠️ OUTILS RECOMMANDÉS

### Backend
- **Postman/Thunder Client** : Tests API
- **MongoDB Compass** : Visualisation base de données
- **Jest** : Tests unitaires
- **Nodemon** : Auto-reload pendant le développement

### Frontend
- **Angular DevTools** : Débogage
- **Chrome DevTools** : Inspection
- **Jasmine/Karma** : Tests
- **Compodoc** : Documentation automatique

### Collaboration
- **Git/GitHub** : Versioning
- **Trello/Jira** : Gestion de projet
- **Slack/Discord** : Communication
- **Figma** : Maquettes (optionnel)

---

## ⚠️ POINTS D'ATTENTION

### Communication
- Daily stand-up de 15 minutes chaque matin
- Merge request review mutuel avant fusion
- Documentation au fur et à mesure
- Commits clairs et descriptifs

### Best Practices
- Suivre les conventions de nommage
- Commenter le code complexe
- Tester avant de pusher
- Utiliser les branches feature/
- Code review systématique

### Priorisation
- Fonctionnalités de base avant optimisation
- MVP avant features avancées
- Sécurité dès le début
- Tests en continu

---

## 🎯 LIVRAISON FINALE

### Repositories
- [ ] Backend sur GitHub avec README
- [ ] Frontend sur GitHub avec README
- [ ] Documentation complète

### Déploiement
- [ ] Application en ligne accessible
- [ ] Base de données hébergée
- [ ] URLs de production documentées

### Comptes de Démo
- [ ] Admin : admin@mall.com / password123
- [ ] Boutique : boutique@test.com / password123
- [ ] Client : client@test.com / password123

### Documentation
- [ ] Guide d'installation
- [ ] Documentation API (Swagger)
- [ ] Guide utilisateur
- [ ] Vidéo de démonstration (optionnel)

---

## 📅 PLANNING RÉCAPITULATIF

| Sprint | Durée | Focus Principal | Développeurs |
|--------|-------|-----------------|--------------|
| Sprint 0 | 3-4 jours | Setup & Infrastructure | Les 2 ensemble |
| Sprint 1 | 1 semaine | Authentification & Users | Parallèle |
| Sprint 2 | 2 semaines | Admin & Boutiques | Parallèle |
| Sprint 3 | 2 semaines | Produits & Catalogue | Parallèle |
| Sprint 4 | 2 semaines | Panier & Commandes | Parallèle |
| Final | 3-5 jours | Tests & Déploiement | Les 2 ensemble |

**Durée totale estimée : 7-8 semaines**

---

## ✨ FONCTIONNALITÉS BONUS (Si le temps le permet)

- [ ] Système d'avis et notes sur les produits
- [ ] Chat entre client et boutique
- [ ] Export des rapports en PDF/Excel
- [ ] Programme de fidélité
- [ ] Notifications par email (Nodemailer)
- [ ] Système de coupons/codes promo
- [ ] Dark mode
- [ ] Multi-langue (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Géolocalisation des boutiques sur une carte

---

**Bon courage à vous deux ! 🚀💪**