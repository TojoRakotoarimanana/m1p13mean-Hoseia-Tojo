const express = require('express');
const router = express.Router();
const { clientOnly } = require('../middleware');
const OrderController = require('../controllers/order.controller');

// Toutes les routes commandes sont pour les clients uniquement
router.use(clientOnly);

router.post('/', OrderController.create);
router.get('/', OrderController.list);
router.get('/:id', OrderController.getById);
router.delete('/:id', OrderController.cancel);

module.exports = router;
