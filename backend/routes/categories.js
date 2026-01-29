const express = require('express');
const router = express.Router();
const CategoryService = require('../services/category.service');

router.get('/', async (req, res) => {
  try {
    const result = await CategoryService.list(req.query.type);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await CategoryService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await CategoryService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const result = await CategoryService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await CategoryService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
});

module.exports = router;
