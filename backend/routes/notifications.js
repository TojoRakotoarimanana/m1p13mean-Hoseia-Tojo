const express = require('express');
const router = express.Router();
const { clientOnly } = require('../middleware');
const NotificationController = require('../controllers/notification.controller');

// Toutes les routes notifications sont pour les clients uniquement
router.use(clientOnly);

router.get('/', NotificationController.list);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/read-all', NotificationController.markAllAsRead);

module.exports = router;
