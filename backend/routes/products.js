const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { upload } = require('../utils/upload');

router.post('/', upload.array('images', 5), ProductController.create);
router.get('/my-products', ProductController.listByShop);
router.get('/stats', ProductController.stats);
router.get('/:id', ProductController.getById);
router.put('/:id', upload.array('images', 5), ProductController.update);
router.delete('/:id', ProductController.remove);
router.patch('/:id/stock', ProductController.updateStock);
router.patch('/:id/promotion', ProductController.updatePromotion);

module.exports = router;
