const express = require('express');
const router = express.Router();
// Les routes catalog sont publiques - pas d'authentification requise pour le catalogue client
const CatalogController = require('../controllers/catalog.controller');

// Route GET /api/catalog/products - Tous les produits publics
router.get('/products', CatalogController.getProducts);

// Route GET /api/catalog/products/:id - Détails d'un produit
router.get('/products/:id', CatalogController.getProductById);

// Route GET /api/catalog/shops - Toutes les boutiques actives
router.get('/shops', CatalogController.getShops);

// Route GET /api/catalog/shops/:id - Détails d'une boutique avec ses produits
router.get('/shops/:id', CatalogController.getShopById);

// Route GET /api/catalog/promotions - Produits en promotion
router.get('/promotions', CatalogController.getPromotions);

// Route GET /api/catalog/search - Recherche globale
router.get('/search', CatalogController.search);

// Route POST /api/catalog/products/:id/view - Incrémenter les vues d'un produit
router.post('/products/:id/view', CatalogController.incrementViews);

module.exports = router;