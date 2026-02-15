const { Shop, User, Product, Order, Category, Notification } = require('../models');

class DashboardAdminService {
  async getGlobalStats() {
    try {
      const [
        totalShops,
        activeShops,
        pendingShops,
        suspendedShops,
        rejectedShops,
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        totalCategories
      ] = await Promise.all([
        Shop.countDocuments(),
        Shop.countDocuments({ status: 'active', isActive: true }),
        Shop.countDocuments({ status: 'pending' }),
        Shop.countDocuments({ status: 'suspended' }),
        Shop.countDocuments({ status: 'rejected' }),
        User.countDocuments({ role: { $ne: 'admin' } }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        this.getTotalRevenue(),
        this.getTodayOrders(),
        this.getTodayRevenue(),
        Category.countDocuments({ type: 'boutique', isActive: true })
      ]);


      const weeklyGrowth = await this.getWeeklyGrowthStats();
      
      return {
        shops: {
          total: totalShops,
          active: activeShops,
          pending: pendingShops,
          suspended: suspendedShops,
          rejected: rejectedShops,
          activePercentage: totalShops > 0 ? ((activeShops / totalShops) * 100).toFixed(1) : 0
        },
        users: {
          total: totalUsers,
          weeklyGrowth: weeklyGrowth.users
        },
        products: {
          total: totalProducts,
          weeklyGrowth: weeklyGrowth.products
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
          weeklyGrowth: weeklyGrowth.orders
        },
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          weeklyGrowth: weeklyGrowth.revenue
        },
        categories: {
          total: totalCategories
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Erreur lors de la récupération des statistiques globales');
    }
  }

  async getRecentActivities(limit = 20) {
    try {
      const [recentShops, recentUsers, recentOrders, recentProducts] = await Promise.all([
        Shop.find()
          .populate('userId', 'firstName lastName email')
          .populate('category', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name status createdAt userId category'),
        
        User.find({ role: { $ne: 'admin' } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('firstName lastName email role createdAt'),
        
        Order.find()
          .populate('customerId', 'firstName lastName')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('orderNumber status totalAmount createdAt customerId'),
          
        Product.find({ isActive: true })
          .populate('shopId', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name price createdAt shopId')
      ]);


      const activities = [];


      recentShops.forEach(shop => {
        activities.push({
          id: shop._id,
          type: 'shop',
          action: shop.status === 'pending' ? 'created' : 'updated',
          title: `Nouvelle boutique: ${shop.name}`,
          description: `${shop.userId?.firstName} ${shop.userId?.lastName} - ${shop.category?.name}`,
          status: shop.status,
          timestamp: shop.createdAt,
          relatedData: {
            shopId: shop._id,
            userId: shop.userId?._id,
            shopName: shop.name
          }
        });
      });


      recentUsers.forEach(user => {
        activities.push({
          id: user._id,
          type: 'user',
          action: 'registered',
          title: `Nouvel utilisateur: ${user.role}`,
          description: `${user.firstName} ${user.lastName} (${user.email})`,
          status: 'active',
          timestamp: user.createdAt,
          relatedData: {
            userId: user._id,
            userRole: user.role
          }
        });
      });


      recentOrders.forEach(order => {
        activities.push({
          id: order._id,
          type: 'order',
          action: 'created',
          title: `Nouvelle commande: ${order.orderNumber}`,
          description: `${order.customerId?.firstName} ${order.customerId?.lastName} - ${order.totalAmount}€`,
          status: order.status,
          timestamp: order.createdAt,
          relatedData: {
            orderId: order._id,
            customerId: order.customerId?._id,
            amount: order.totalAmount
          }
        });
      });


      recentProducts.forEach(product => {
        activities.push({
          id: product._id,
          type: 'product',
          action: 'created',
          title: `Nouveau produit: ${product.name}`,
          description: `${product.shopId?.name} - ${product.price}€`,
          status: 'active',
          timestamp: product.createdAt,
          relatedData: {
            productId: product._id,
            shopId: product.shopId?._id,
            price: product.price
          }
        });
      });


      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return activities.slice(0, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw new Error('Erreur lors de la récupération des dernières activités');
    }
  }

  async getTotalRevenue() {
    const result = await Order.aggregate([
      { $match: { status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTodayOrders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });
  }

  async getTodayRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $in: ['completed', 'paid'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getWeeklyGrowthStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      usersThisWeek,
      usersLastWeek,
      productsThisWeek,
      productsLastWeek,
      ordersThisWeek,
      ordersLastWeek,
      revenueThisWeek,
      revenueLastWeek
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: weekAgo }, role: { $ne: 'admin' } }),
      User.countDocuments({ 
        createdAt: { $gte: twoWeeksAgo, $lt: weekAgo }, 
        role: { $ne: 'admin' } 
      }),
      Product.countDocuments({ createdAt: { $gte: weekAgo }, isActive: true }),
      Product.countDocuments({ 
        createdAt: { $gte: twoWeeksAgo, $lt: weekAgo }, 
        isActive: true 
      }),
      Order.countDocuments({ createdAt: { $gte: weekAgo } }),
      Order.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: weekAgo } }),
      this.getRevenueForPeriod(weekAgo, now),
      this.getRevenueForPeriod(twoWeeksAgo, weekAgo)
    ]);

    return {
      users: this.calculateGrowthPercentage(usersLastWeek, usersThisWeek),
      products: this.calculateGrowthPercentage(productsLastWeek, productsThisWeek),
      orders: this.calculateGrowthPercentage(ordersLastWeek, ordersThisWeek),
      revenue: this.calculateGrowthPercentage(revenueLastWeek, revenueThisWeek)
    };
  }

  async getRevenueForPeriod(startDate, endDate) {
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          status: { $in: ['completed', 'paid'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  calculateGrowthPercentage(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue * 100).toFixed(1);
  }

  async getShopStatsByCategory() {
    try {
      const categoryStats = await Shop.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },
        { $unwind: '$categoryInfo' },
        {
          $group: {
            _id: {
              categoryId: '$categoryInfo._id',
              categoryName: '$categoryInfo.name',
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              categoryId: '$_id.categoryId',
              categoryName: '$_id.categoryName'
            },
            statuses: {
              $push: {
                status: '$_id.status',
                count: '$count'
              }
            },
            total: { $sum: '$count' }
          }
        },
        { $sort: { total: -1 } }
      ]);

      return categoryStats;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats par catégorie:', error);
      throw new Error('Erreur lors de la récupération des statistiques par catégorie');
    }
  }

  async getOrdersByDay(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const ordersByDay = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['completed', 'paid']] },
                  '$totalAmount',
                  0
                ]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Remplir les jours manquants avec des valeurs à 0
      const result = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const existingData = ordersByDay.find(item => item._id === dateStr);
        result.push({
          date: dateStr,
          label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          count: existingData ? existingData.count : 0,
          revenue: existingData ? existingData.revenue : 0
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes par jour:', error);
      throw new Error('Erreur lors de la récupération des commandes par jour');
    }
  }

  async getRevenueByMonth(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const revenueByMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['completed', 'paid'] }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            total: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Remplir les mois manquants avec des valeurs à 0
      const result = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const existingData = revenueByMonth.find(
          item => item._id.year === year && item._id.month === month
        );
        
        result.push({
          year,
          month,
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          total: existingData ? existingData.total : 0
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus par mois:', error);
      throw new Error('Erreur lors de la récupération des revenus par mois');
    }
  }

  async getOrdersByMonth(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const ordersByMonth = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Remplir les mois manquants avec des valeurs à 0
      const result = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        const existingData = ordersByMonth.find(
          item => item._id.year === year && item._id.month === month
        );
        
        result.push({
          year,
          month,
          label: date.toLocaleDateString('fr-FR', { month: 'short' }),
          count: existingData ? existingData.count : 0
        });
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes par mois:', error);
      throw new Error('Erreur lors de la récupération des commandes par mois');
    }
  }
}

module.exports = new DashboardAdminService();