const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/register-boutique', AuthController.registerBoutique);
router.post('/login', AuthController.login);
router.get('/me', authenticateToken, AuthController.me);

module.exports = router;
