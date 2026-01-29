const express = require('express');
const router = express.Router();
const ShopService = require('../services/shop.service');

router.get('/', async (req, res) => {
  try {
    const result = await ShopService.list(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await ShopService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await ShopService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await ShopService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
});

router.post('/:id/suspend', async (req, res) => {
  try {
    const result = await ShopService.suspend(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suspension.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await ShopService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
});

module.exports = router;
