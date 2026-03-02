var express = require('express');
var router = express.Router();
const { adminOnly } = require('../middleware');
const ShopService = require('../services/shop.service');
const DashboardAdminController = require('../controllers/dashboardAdmin.controller');
const { Order } = require('../models');

// Toutes les routes admin sont protégées
router.use(adminOnly);

router.get('/stats', DashboardAdminController.getGlobalStats);
router.get('/activities', DashboardAdminController.getRecentActivities);
router.get('/stats/categories', DashboardAdminController.getShopStatsByCategory);
router.get('/stats/orders-by-day', DashboardAdminController.getOrdersByDay);
router.get('/stats/revenue-by-month', DashboardAdminController.getRevenueByMonth);
router.get('/stats/orders-by-month', DashboardAdminController.getOrdersByMonth);

router.get('/shops', async (req, res) => {
  try {
    const result = await ShopService.listAll();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des boutiques.'
    });
  }
});

router.get('/shops/pending', async (req, res) => {
  try {
    const result = await ShopService.listPending();
    res.json({
      success: true,
      data: {
        total: result.length,
        shops: result
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des boutiques en attente.'
    });
  }
});

router.patch('/shops/:id/validate', async (req, res) => {
  try {
    const result = await ShopService.validateAdmin(req.params.id);
    res.json({
      success: true,
      message: result.message,
      data: result.shop
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la validation de la boutique.'
    });
  }
});

router.patch('/shops/:id/reject', async (req, res) => {
  try {
    const result = await ShopService.rejectAdmin(req.params.id);
    res.json({
      success: true,
      message: result.message,
      data: result.shop
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors du rejet de la boutique.'
    });
  }
});

router.patch('/shops/:id/suspend', async (req, res) => {
  try {
    const result = await ShopService.suspend(req.params.id);
    res.json({
      success: true,
      message: result.message,
      data: result.shop
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la suspension de la boutique.'
    });
  }
});

router.delete('/shops/:id', async (req, res) => {
  try {
    const adminUserId = req.user?.id || null;
    const result = await ShopService.remove(req.params.id, adminUserId);
    
    res.json({
      success: true,
      message: result.message,
      data: result.shop
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la suppression de la boutique.'
    });
  }
});

// GET /api/admin/orders — Liste toutes les commandes avec pagination + filtres
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (search) {
      filters.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Order.find(filters)
        .populate('customerId', 'firstName lastName email')
        .populate('items.shopId', 'name')
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: {
        orders: items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des commandes.'
    });
  }
});

// PATCH /api/admin/orders/:id/status — Mettre à jour le statut d'une commande
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('customerId', 'firstName lastName email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    res.json({ success: true, message: 'Statut mis à jour.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur.' });
  }
});

module.exports = router;