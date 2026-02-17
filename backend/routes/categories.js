const express = require('express');
const router = express.Router();
const { adminOnly, allRoles } = require('../middleware');
const CategoryController = require('../controllers/category.controller');

// Lecture disponible pour tous les utilisateurs authentifiés
router.get('/', allRoles, CategoryController.list);
router.get('/:id', allRoles, CategoryController.getById);

// Gestion réservée aux admins
router.post('/', adminOnly, CategoryController.create);
router.put('/:id', adminOnly, CategoryController.update);
router.delete('/:id', adminOnly, CategoryController.remove);

module.exports = router;
