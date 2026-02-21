const { Product, Shop, Category } = require('../models');

class CatalogService {
  // Récupérer tous les produits publics (actifs et de boutiques actives)
  async getPublicProducts(filters = {}) {
    const { page = 1, limit = 20, category, minPrice, maxPrice, shopId } = filters;
    const skip = (page - 1) * limit;

    // Construire la requête
    let query = {
      isActive: true,
      'stock.quantity': { $gt: 0 } // Produits en stock uniquement
    };

    // Filtres optionnels
    if (category) query.category = category;
    if (shopId) query.shopId = shopId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('shopId', 'name logo status')
      .populate('category', 'name type')
      .select('-statistics.sold -priceHistory -promotionHistory')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filtrer les produits des boutiques actives uniquement
    const activeProducts = products.filter(product => 
      product.shopId && product.shopId.status === 'active'
    );

    const total = await Product.countDocuments({
      ...query,
      shopId: { $in: await Shop.find({ status: 'active' }).distinct('_id') }
    });

    return {
      products: activeProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit: parseInt(limit)
      }
    };
  }

  // Récupérer les détails d'un produit spécifique
  async getProductDetails(productId) {
    if (!productId) {
      const error = new Error('ID du produit requis.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findOne({ 
      _id: productId, 
      isActive: true,
      'stock.quantity': { $gt: 0 }
    })
      .populate('shopId', 'name logo contact location status')
      .populate('category', 'name type description');

    if (!product) {
      const error = new Error('Produit non trouvé ou indisponible.');
      error.status = 404;
      throw error;
    }

    // Vérifier que la boutique est active
    if (!product.shopId || product.shopId.status !== 'active') {
      const error = new Error('Produit indisponible.');
      error.status = 404;
      throw error;
    }

    // Ne pas exposer les statistiques sensibles
    const productData = product.toObject();
    delete productData.statistics.sold;
    delete productData.priceHistory;
    delete productData.promotionHistory;

    return productData;
  }

  // Récupérer toutes les boutiques actives
  async getActiveShops(filters = {}) {
    const { page = 1, limit = 20, category } = filters;
    const skip = (page - 1) * limit;

    let query = { status: 'active', isActive: true };
    if (category) query.category = category;

    const shops = await Shop.find(query)
      .populate('userId', 'firstName lastName')
      .populate('category', 'name type')
      .select('-statistics.totalRevenue') // Ne pas exposer le chiffre d'affaires
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shop.countDocuments(query);

    return {
      shops,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalShops: total,
        limit: parseInt(limit)
      }
    };
  }

  // Récupérer les détails d'une boutique avec ses produits
  async getShopDetails(shopId) {
    if (!shopId) {
      const error = new Error('ID de la boutique requis.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findOne({ 
      _id: shopId, 
      status: 'active', 
      isActive: true 
    })
      .populate('userId', 'firstName lastName phone')
      .populate('category', 'name type description');

    if (!shop) {
      const error = new Error('Boutique non trouvée ou inactive.');
      error.status = 404;
      throw error;
    }

    // Récupérer les produits actifs de la boutique
    const products = await Product.find({
      shopId: shopId,
      isActive: true,
      'stock.quantity': { $gt: 0 }
    })
      .populate('category', 'name type')
      .select('-statistics.sold -priceHistory -promotionHistory')
      .sort({ createdAt: -1 })
      .limit(50); // Limite pour éviter les réponses trop lourdes

    // Ne pas exposer les statistiques financières
    const shopData = shop.toObject();
    delete shopData.statistics.totalRevenue;

    return {
      shop: shopData,
      products,
      totalProducts: products.length
    };
  }

  // Récupérer les produits en promotion
  async getPromotions(filters = {}) {
    const { page = 1, limit = 20, category, shopId } = filters;
    const skip = (page - 1) * limit;

    let query = {
      isActive: true,
      isPromotion: true,
      'stock.quantity': { $gt: 0 },
      $or: [
        { promoEndDate: { $gte: new Date() } }, // Promo pas encore expirée
        { promoEndDate: null } // Promo sans date de fin
      ]
    };

    if (category) query.category = category;
    if (shopId) query.shopId = shopId;

    const promotions = await Product.find(query)
      .populate('shopId', 'name logo status')
      .populate('category', 'name type')
      .select('-statistics.sold -priceHistory -promotionHistory')
      .sort({ discount: -1, createdAt: -1 }) // Tri par discount décroissant
      .skip(skip)
      .limit(parseInt(limit));

    // Filtrer les produits des boutiques actives uniquement
    const activePromotions = promotions.filter(product => 
      product.shopId && product.shopId.status === 'active'
    );

    const total = await Product.countDocuments({
      ...query,
      shopId: { $in: await Shop.find({ status: 'active' }).distinct('_id') }
    });

    return {
      promotions: activePromotions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPromotions: total,
        limit: parseInt(limit)
      }
    };
  }

  // Recherche globale
  async globalSearch(searchTerm, filters = {}) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      const error = new Error('Le terme de recherche doit contenir au moins 2 caractères.');
      error.status = 400;
      throw error;
    }

    const { page = 1, limit = 20, type = 'all' } = filters;
    const skip = (page - 1) * limit;
    const regex = new RegExp(searchTerm, 'i');

    let results = {};

    if (type === 'all' || type === 'products') {
      // Recherche dans les produits
      const productQuery = {
        isActive: true,
        'stock.quantity': { $gt: 0 },
        $or: [
          { name: regex },
          { description: regex }
        ]
      };

      const products = await Product.find(productQuery)
        .populate('shopId', 'name logo status')
        .populate('category', 'name type')
        .select('-statistics.sold -priceHistory -promotionHistory')
        .sort({ 'statistics.views': -1, createdAt: -1 })
        .skip(type === 'products' ? skip : 0)
        .limit(type === 'products' ? parseInt(limit) : 10);

      // Filtrer les produits des boutiques actives
      results.products = products.filter(product => 
        product.shopId && product.shopId.status === 'active'
      );

      if (type === 'products') {
        const totalProducts = await Product.countDocuments({
          ...productQuery,
          shopId: { $in: await Shop.find({ status: 'active' }).distinct('_id') }
        });
        
        results.pagination = {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalResults: totalProducts,
          limit: parseInt(limit)
        };
      }
    }

    if (type === 'all' || type === 'shops') {
      // Recherche dans les boutiques
      const shopQuery = {
        status: 'active',
        isActive: true,
        $or: [
          { name: regex },
          { description: regex }
        ]
      };

      const shops = await Shop.find(shopQuery)
        .populate('category', 'name type')
        .select('-statistics.totalRevenue')
        .sort({ 'statistics.totalProducts': -1 })
        .skip(type === 'shops' ? skip : 0)
        .limit(type === 'shops' ? parseInt(limit) : 5);

      results.shops = shops;

      if (type === 'shops') {
        const totalShops = await Shop.countDocuments(shopQuery);
        results.pagination = {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalShops / limit),
          totalResults: totalShops,
          limit: parseInt(limit)
        };
      }
    }

    return results;
  }

  // Incrémenter les vues d'un produit
  async incrementProductViews(productId) {
    if (!productId) {
      const error = new Error('ID du produit requis.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, isActive: true },
      { $inc: { 'statistics.views': 1 } },
      { new: true }
    );

    if (!product) {
      const error = new Error('Produit non trouvé.');
      error.status = 404;
      throw error;
    }

    return { success: true, views: product.statistics.views };
  }
}

module.exports = new CatalogService();