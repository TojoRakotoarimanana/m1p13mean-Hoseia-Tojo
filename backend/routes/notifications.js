const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { allRoles } = require('../middleware');
const NotificationController = require('../controllers/notification.controller');
const notificationEmitter = require('../utils/notification-emitter');

// ── Endpoint SSE (avant router.use(allRoles) car auth via query param) ──────
// EventSource ne supporte pas les headers personnalisés → token en query param
router.get('/stream', async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'Token requis.' });
    }

    let user;
    try {
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-it';
        const decoded = jwt.verify(token, jwtSecret);
        user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Utilisateur non autorisé.' });
        }
    } catch {
        return res.status(403).json({ message: 'Token invalide.' });
    }

    // Headers SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Désactiver le buffering nginx si utilisé
    res.flushHeaders();

    const userId = user._id.toString();
    const eventKey = `notification:${userId}`;

    // Envoyer un ping initial pour confirmer la connexion
    res.write(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`);

    // Keepalive toutes les 25s pour éviter les timeouts proxy/browser
    const keepalive = setInterval(() => {
        res.write(': keepalive\n\n');
    }, 25000);

    // Écouter les nouvelles notifications pour cet utilisateur
    const onNotification = (payload) => {
        res.write(`data: ${JSON.stringify({ type: 'notification', ...payload })}\n\n`);
    };

    notificationEmitter.on(eventKey, onNotification);

    // Nettoyage à la déconnexion du client
    req.on('close', () => {
        clearInterval(keepalive);
        notificationEmitter.off(eventKey, onNotification);
        res.end();
    });
});

// ── Routes REST (authentification standard via Bearer header) ────────────────
router.use(allRoles);

router.get('/', NotificationController.list);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/read-all', NotificationController.markAllAsRead);

module.exports = router;
