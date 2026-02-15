const express = require('express');
const router = express.Router();
const ShopController = require('../controllers/shop.controller');

router.get('/', ShopController.list);
router.get('/pending', ShopController.listPending);
router.get('/my-shop/:userId', ShopController.getByUser);
router.get('/:id', ShopController.getById);
router.post('/', ShopController.create);
router.put('/:id', ShopController.update);
router.post('/:id/suspend', ShopController.suspend);
router.post('/:id/approve', ShopController.approve);
router.post('/:id/reject', ShopController.reject);
router.delete('/:id', ShopController.remove);

module.exports = router;
