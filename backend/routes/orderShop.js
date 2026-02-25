const express = require('express');
const router = express.Router();
const { boutiqueOnly } = require('../middleware');
const OrderShopController = require('../controllers/orderShop.controller');

// Toutes les routes sont réservées aux boutiques authentifiées
router.use(boutiqueOnly);

router.get('/', OrderShopController.list);
router.get('/stats', OrderShopController.stats); // Avant /:id pour éviter le conflit
router.get('/:id', OrderShopController.getById);
router.patch('/:id/status', OrderShopController.updateStatus);

module.exports = router;
