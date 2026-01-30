const express = require('express');
const router = express.Router();
const ProductService = require('../services/product.service');
const { upload, processImages } = require('../utils/upload');

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const images = await processImages(req.files || []);
    const result = await ProductService.create(req.body, images);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
});

router.get('/my-products', async (req, res) => {
  try {
    const result = await ProductService.listByShop(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await ProductService.stats(req.query.shopId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await ProductService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const images = await processImages(req.files || []);
    const result = await ProductService.update(req.params.id, req.body, images);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await ProductService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
});

router.patch('/:id/stock', async (req, res) => {
  try {
    const result = await ProductService.updateStock(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour du stock.' });
  }
});

router.patch('/:id/promotion', async (req, res) => {
  try {
    const result = await ProductService.updatePromotion(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour de la promotion.' });
  }
});

module.exports = router;
