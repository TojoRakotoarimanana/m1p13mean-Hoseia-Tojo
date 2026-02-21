const express = require('express');
const router = express.Router();
const { clientOnly } = require('../middleware');
const CartController = require('../controllers/cart.controller');

// Toutes les routes panier sont pour les clients uniquement
router.use(clientOnly);

router.get('/', CartController.getCart);
router.post('/add', CartController.addItem);
router.put('/update/:itemId', CartController.updateItem);
router.delete('/remove/:itemId', CartController.removeItem);
router.delete('/clear', CartController.clearCart);

module.exports = router;
