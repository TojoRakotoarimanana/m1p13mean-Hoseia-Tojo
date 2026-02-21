const NotificationService = require('../services/notification.service');

exports.list = async (req, res) => {
    try {
        const result = await NotificationService.getNotifications(req.user._id, req.query);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération des notifications.' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const result = await NotificationService.getUnreadCount(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const result = await NotificationService.markAsRead(req.user._id, req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const result = await NotificationService.markAllAsRead(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
    }
};
