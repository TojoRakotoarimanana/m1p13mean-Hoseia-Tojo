const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.register);
router.post('/register-boutique', AuthController.registerBoutique);
router.post('/login', AuthController.login);

module.exports = router;
