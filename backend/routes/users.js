var express = require('express');
var router = express.Router();
var UserService = require('../services/user.service');

router.get('/', async function(req, res) {
  try {
    const result = await UserService.list();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.get('/boutiques/pending', async function(req, res) {
  try {
    const result = await UserService.listPendingBoutiques();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
});

router.post('/boutiques/:id/approve', async function(req, res) {
  try {
    const result = await UserService.approveBoutique(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la validation.' });
  }
});

router.post('/boutiques/:id/reject', async function(req, res) {
  try {
    const result = await UserService.rejectBoutique(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors du refus.' });
  }
});

module.exports = router;
