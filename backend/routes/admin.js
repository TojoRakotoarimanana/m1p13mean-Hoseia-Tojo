var express = require('express');
var router = express.Router();
const ShopService = require('../services/shop.service');
const DashboardAdminController = require('../controllers/dashboardAdmin.controller');

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

module.exports = router;