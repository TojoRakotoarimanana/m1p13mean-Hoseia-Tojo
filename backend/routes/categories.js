const express = require('express');
const router = express.Router();
const { adminOnly, allRoles } = require('../middleware');
const CategoryController = require('../controllers/category.controller');

// Lecture publique pour le catalogue client (sans authentification)
router.get('/', CategoryController.list);
router.get('/:id', CategoryController.getById);

// Gestion réservée aux admins
router.post('/', adminOnly, CategoryController.create);
router.put('/:id', adminOnly, CategoryController.update);
router.delete('/:id', adminOnly, CategoryController.remove);

module.exports = router;
