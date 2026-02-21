const { Notification } = require('../models');

class NotificationService {
    async createNotification(data) {
        const { userId, type, title, message, relatedId, relatedModel } = data;

        if (!userId || !type || !title || !message) {
            const error = new Error('userId, type, title et message sont obligatoires.');
            error.status = 400;
            throw error;
        }

        const notification = new Notification({
            userId,
            type,
            title,
            message,
            relatedId: relatedId || undefined,
            relatedModel: relatedModel || undefined,
            isRead: false
        });

        await notification.save();
        return notification;
    }

    async getNotifications(userId, query = {}) {
        const {
            page = 1,
            limit = 20,
            type,
            isRead
        } = query;

        const filters = { userId };
        if (type) filters.type = type;
        if (isRead !== undefined) filters.isRead = isRead === 'true' || isRead === true;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 20, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const [items, total] = await Promise.all([
            Notification.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),
            Notification.countDocuments(filters)
        ]);

        return {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
            items
        };
    }

    async markAsRead(userId, notificationId) {
        if (!notificationId) {
            const error = new Error('notificationId est obligatoire.');
            error.status = 400;
            throw error;
        }

        const notification = await Notification.findOne({ _id: notificationId, userId });
        if (!notification) {
            const error = new Error('Notification introuvable.');
            error.status = 404;
            throw error;
        }

        notification.isRead = true;
        await notification.save();

        return {
            message: 'Notification marquée comme lue.',
            notification
        };
    }

    async markAllAsRead(userId) {
        await Notification.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );

        return {
            message: 'Toutes les notifications ont été marquées comme lues.'
        };
    }

    async getUnreadCount(userId) {
        const count = await Notification.countDocuments({ userId, isRead: false });
        return { unreadCount: count };
    }
}

module.exports = new NotificationService();
