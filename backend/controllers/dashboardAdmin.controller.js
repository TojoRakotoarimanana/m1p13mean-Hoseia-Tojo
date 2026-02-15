const DashboardAdminService = require('../services/dashboardAdmin.service');

exports.getGlobalStats = async (req, res) => {
  try {
    const stats = await DashboardAdminService.getGlobalStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des statistiques.'
    });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Maximum 100
    const activities = await DashboardAdminService.getRecentActivities(limit);
    
    res.json({
      success: true,
      data: {
        activities,
        total: activities.length,
        limit
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des activités.'
    });
  }
};

exports.getShopStatsByCategory = async (req, res) => {
  try {
    const categoryStats = await DashboardAdminService.getShopStatsByCategory();
    
    res.json({
      success: true,
      data: {
        categories: categoryStats,
        total: categoryStats.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats par catégorie:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des statistiques par catégorie.'
    });
  }
};

exports.getOrdersByDay = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 30); // Maximum 30 jours
    const ordersByDay = await DashboardAdminService.getOrdersByDay(days);
    
    res.json({
      success: true,
      data: {
        orders: ordersByDay,
        total: ordersByDay.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes par jour:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des commandes par jour.'
    });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const months = Math.min(parseInt(req.query.months) || 6, 12); // Maximum 12 mois
    const revenueByMonth = await DashboardAdminService.getRevenueByMonth(months);
    
    res.json({
      success: true,
      data: {
        revenue: revenueByMonth,
        total: revenueByMonth.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des revenus par mois:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des revenus par mois.'
    });
  }
};

exports.getOrdersByMonth = async (req, res) => {
  try {
    const months = Math.min(parseInt(req.query.months) || 6, 12); // Maximum 12 mois
    const ordersByMonth = await DashboardAdminService.getOrdersByMonth(months);
    
    res.json({
      success: true,
      data: {
        orders: ordersByMonth,
        total: ordersByMonth.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes par mois:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Erreur serveur lors de la récupération des commandes par mois.'
    });
  }
};