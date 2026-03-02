const express = require('express');
const router = express.Router();
const { adminOnly, boutiqueOnly, boutiqueOrAdmin, allRoles } = require('../middleware');
const ShopController = require('../controllers/shop.controller');

// Routes publiques (admin peut voir toutes les boutiques)
router.get('/', adminOnly, ShopController.list);
router.get('/pending', adminOnly, ShopController.listPending);

// Routes pour les boutiques (accès à leur propre boutique)
router.get('/my-shop/:userId', boutiqueOnly, ShopController.getByUser);

// Routes admin uniquement
router.get('/:id', adminOnly, ShopController.getById);
router.post('/', boutiqueOnly, ShopController.create);
router.put('/:id', boutiqueOrAdmin, ShopController.update);
router.post('/:id/suspend', adminOnly, ShopController.suspend);
router.post('/:id/reactivate', adminOnly, ShopController.reactivate);
router.post('/:id/approve', adminOnly, ShopController.approve);
router.post('/:id/reject', adminOnly, ShopController.reject);
router.delete('/:id', adminOnly, ShopController.remove);

module.exports = router;
