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

module.exports = router;
