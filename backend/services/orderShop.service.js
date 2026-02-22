const { Order, Shop } = require('../models');
const NotificationService = require('./notification.service');

class OrderShopService {
  async _getShop(userId) {
    const shop = await Shop.findOne({ userId });
    if (!shop) {
      const error = new Error('Boutique introuvable pour cet utilisateur.');
      error.status = 404;
      throw error;
    }
    return shop;
  }

  async list(userId, query) {
    const shop = await this._getShop(userId);
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const filters = { 'items.shopId': shop._id };
    if (status) filters.status = status;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [orders, total] = await Promise.all([
      Order.find(filters)
        .populate('customerId', 'firstName lastName email')
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limitNumber),
      Order.countDocuments(filters)
    ]);

    const items = orders.map(order => {
      const obj = order.toObject();
      // Garder uniquement les items de cette boutique
      obj.items = obj.items.filter(item => item.shopId.toString() === shop._id.toString());
      // Statut spécifique à cette boutique
      const shopOrder = obj.shopOrders?.find(so => so.shopId?.toString() === shop._id.toString());
      obj.shopStatus = shopOrder?.status || obj.status;
      return obj;
    });

    return {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      items
    };
  }

  async getById(userId, orderId) {
    const shop = await this._getShop(userId);

    const order = await Order.findOne({ _id: orderId, 'items.shopId': shop._id })
      .populate('customerId', 'firstName lastName email');

    if (!order) {
      const error = new Error('Commande introuvable.');
      error.status = 404;
      throw error;
    }

    const obj = order.toObject();
    obj.items = obj.items.filter(item => item.shopId.toString() === shop._id.toString());
    const shopOrder = obj.shopOrders?.find(so => so.shopId?.toString() === shop._id.toString());
    obj.shopStatus = shopOrder?.status || obj.status;
    obj.statusHistory = shopOrder?.statusHistory || [];

    return obj;
  }

  async updateStatus(userId, orderId, status) {
    const allowedStatuses = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      const error = new Error(`Statut invalide. Valeurs autorisées: ${allowedStatuses.join(', ')}.`);
      error.status = 400;
      throw error;
    }

    const shop = await this._getShop(userId);

    const order = await Order.findOne({ _id: orderId, 'items.shopId': shop._id });
    if (!order) {
      const error = new Error('Commande introuvable.');
      error.status = 404;
      throw error;
    }

    // Mettre à jour le statut dans shopOrders pour cette boutique
    if (!order.shopOrders) order.shopOrders = [];
    const shopOrderIndex = order.shopOrders.findIndex(
      so => so.shopId?.toString() === shop._id.toString()
    );

    const historyEntry = { status, changedAt: new Date() };

    if (shopOrderIndex >= 0) {
      order.shopOrders[shopOrderIndex].status = status;
      if (!order.shopOrders[shopOrderIndex].statusHistory) {
        order.shopOrders[shopOrderIndex].statusHistory = [];
      }
      order.shopOrders[shopOrderIndex].statusHistory.push(historyEntry);
    } else {
      order.shopOrders.push({ shopId: shop._id, status, statusHistory: [historyEntry] });
    }

    await order.save();

    // Notifier le client du changement de statut
    const statusLabels = {
      confirmed: 'confirmée',
      preparing: 'en cours de préparation',
      ready: 'prête pour retrait/livraison',
      completed: 'complétée',
      cancelled: 'annulée par la boutique'
    };
    try {
      await NotificationService.createNotification({
        userId: order.customerId,
        type: 'order',
        title: 'Statut de commande mis à jour',
        message: `Votre commande ${order.orderNumber} est maintenant ${statusLabels[status] || status}.`,
        relatedId: order._id,
        relatedModel: 'Order'
      });
    } catch (notifError) {
      console.error('Erreur notification client:', notifError.message);
    }

    return order;
  }

  async stats(userId) {
    const shop = await this._getShop(userId);
    const shopId = shop._id;

    const [statusCounts, revenueData, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { 'items.shopId': shopId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { 'items.shopId': shopId, status: { $in: ['completed', 'ready'] } } },
        { $unwind: '$items' },
        { $match: { 'items.shopId': shopId } },
        { $group: { _id: null, totalRevenue: { $sum: '$items.subtotal' } } }
      ]),
      Order.find({ 'items.shopId': shopId })
        .populate('customerId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const counts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    };

    statusCounts.forEach(({ _id, count }) => {
      if (Object.prototype.hasOwnProperty.call(counts, _id)) counts[_id] = count;
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const recent = recentOrders.map(order => {
      const obj = order.toObject();
      obj.items = obj.items.filter(item => item.shopId.toString() === shopId.toString());
      return obj;
    });

    return {
      ...counts,
      total,
      totalRevenue,
      recentOrders: recent
    };
  }
}

module.exports = new OrderShopService();
