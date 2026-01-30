const { Product, Shop } = require('../models');
const { removeImages } = require('../utils/upload');

class ProductService {
  async create(data, images = []) {
    const { shopId, name, price, category } = data;

    if (!shopId || !name || price === undefined || price === null) {
      const error = new Error('shopId, name et price sont obligatoires.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    const basePrice = Number(price);
    const originalPrice = data.originalPrice !== undefined ? Number(data.originalPrice) : basePrice;
    const discount = data.discount !== undefined ? Number(data.discount) : 0;
    const isPromotion = data.isPromotion !== undefined ? data.isPromotion === 'true' || data.isPromotion === true : false;
    const promoEndDate = data.promoEndDate ? new Date(data.promoEndDate) : undefined;
    const promoPrice = isPromotion && discount > 0
      ? Number((originalPrice * (1 - discount / 100)).toFixed(2))
      : basePrice;

    const product = new Product({
      shopId,
      name: name.trim(),
      description: data.description,
      price: promoPrice,
      originalPrice,
      discount,
      promoEndDate,
      category: category || null,
      images,
      stock: {
        quantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : (data.stock?.quantity ?? 0),
        lowStockAlert: data.lowStockAlert !== undefined ? Number(data.lowStockAlert) : (data.stock?.lowStockAlert ?? 5)
      },
      isPromotion,
      isActive: data.isActive !== undefined ? data.isActive === 'true' || data.isActive === true : true,
      specifications: data.specifications || undefined
    });

    if (isPromotion) {
      product.promotionHistory.push({
        discount,
        startDate: new Date(),
        endDate: promoEndDate,
        action: 'enabled'
      });
      if (promoPrice !== originalPrice) {
        product.priceHistory.push({ oldPrice: originalPrice, newPrice: promoPrice });
      }
    }

    await product.save();

    return {
      message: 'Produit créé avec succès.',
      product
    };
  }

  async listByShop(query) {
    const {
      shopId,
      page = 1,
      limit = 10,
      search,
      category,
      isActive,
      isPromotion,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const filters = { shopId };

    if (category) filters.category = category;
    if (isActive !== undefined) filters.isActive = isActive === 'true' || isActive === true;
    if (isPromotion !== undefined) filters.isPromotion = isPromotion === 'true' || isPromotion === true;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) filters.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filters.price.$lte = Number(maxPrice);
    }
    if (minStock !== undefined || maxStock !== undefined) {
      filters['stock.quantity'] = {};
      if (minStock !== undefined) filters['stock.quantity'].$gte = Number(minStock);
      if (maxStock !== undefined) filters['stock.quantity'].$lte = Number(maxStock);
    }
    if (search) {
      filters.$text = { $search: search };
    }

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Product.find(filters)
        .populate('category', 'name')
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limitNumber),
      Product.countDocuments(filters)
    ]);

    return {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      items
    };
  }

  async getById(productId) {
    if (!productId) {
      const error = new Error('productId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findById(productId)
      .populate('category', 'name')
      .populate('shopId', 'name');

    if (!product) {
      const error = new Error('Produit introuvable.');
      error.status = 404;
      throw error;
    }

    return product;
  }

  async update(productId, data, images) {
    if (!productId) {
      const error = new Error('productId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Produit introuvable.');
      error.status = 404;
      throw error;
    }

    if (images && images.length) {
      removeImages(product.images || []);
      product.images = images;
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) {
      const newPrice = Number(data.price);
      if (product.price !== newPrice) {
        product.priceHistory.push({ oldPrice: product.price, newPrice });
      }
      product.price = newPrice;
      if (!product.isPromotion && data.originalPrice === undefined) {
        product.originalPrice = newPrice;
      }
    }
    if (data.originalPrice !== undefined) product.originalPrice = Number(data.originalPrice);
    if (data.discount !== undefined) product.discount = Number(data.discount);
    if (data.category !== undefined) product.category = data.category || null;
    if (data.isPromotion !== undefined) product.isPromotion = data.isPromotion === 'true' || data.isPromotion === true;
    if (data.promoEndDate !== undefined) product.promoEndDate = data.promoEndDate ? new Date(data.promoEndDate) : undefined;
    if (data.isActive !== undefined) product.isActive = data.isActive === 'true' || data.isActive === true;

    if (data.stockQuantity !== undefined || data.lowStockAlert !== undefined || data.stock) {
      product.stock = {
        quantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : (data.stock?.quantity ?? product.stock.quantity),
        lowStockAlert: data.lowStockAlert !== undefined ? Number(data.lowStockAlert) : (data.stock?.lowStockAlert ?? product.stock.lowStockAlert)
      };
    }

    if (data.specifications !== undefined) {
      product.specifications = data.specifications;
    }

    await product.save();

    return {
      message: 'Produit mis à jour avec succès.',
      product
    };
  }

  async updateStock(productId, data) {
    if (!productId) {
      const error = new Error('productId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Produit introuvable.');
      error.status = 404;
      throw error;
    }

    if (data.quantity !== undefined) product.stock.quantity = Number(data.quantity);
    if (data.lowStockAlert !== undefined) product.stock.lowStockAlert = Number(data.lowStockAlert);

    await product.save();

    return {
      message: 'Stock mis à jour.',
      product
    };
  }

  async updatePromotion(productId, data) {
    if (!productId) {
      const error = new Error('productId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Produit introuvable.');
      error.status = 404;
      throw error;
    }

    const enablePromotion = data.isPromotion !== undefined
      ? data.isPromotion === 'true' || data.isPromotion === true
      : product.isPromotion;
    const discount = data.discount !== undefined ? Number(data.discount) : product.discount || 0;
    const originalPrice = data.originalPrice !== undefined
      ? Number(data.originalPrice)
      : (product.originalPrice ?? product.price);
    const promoEndDate = data.promoEndDate ? new Date(data.promoEndDate) : null;

    if (enablePromotion) {
      const promoPrice = Number((originalPrice * (1 - discount / 100)).toFixed(2));
      if (product.price !== promoPrice) {
        product.priceHistory.push({ oldPrice: product.price, newPrice: promoPrice });
      }
      product.isPromotion = true;
      product.discount = discount;
      product.originalPrice = originalPrice;
      product.price = promoPrice;
      product.promoEndDate = promoEndDate;
      product.promotionHistory.push({
        discount,
        startDate: new Date(),
        endDate: promoEndDate,
        action: 'enabled'
      });
    } else {
      if (product.price !== originalPrice) {
        product.priceHistory.push({ oldPrice: product.price, newPrice: originalPrice });
      }
      product.isPromotion = false;
      product.discount = 0;
      product.price = originalPrice;
      product.promoEndDate = null;
      const lastPromo = product.promotionHistory[product.promotionHistory.length - 1];
      if (lastPromo) {
        lastPromo.action = 'disabled';
        lastPromo.endDate = new Date();
      }
    }

    await product.save();

    return {
      message: 'Promotion mise à jour.',
      product
    };
  }

  async remove(productId, deletedByUserId) {
    if (!productId) {
      const error = new Error('productId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Produit introuvable.');
      error.status = 404;
      throw error;
    }

    removeImages(product.images || []);
    await product.softDelete(deletedByUserId || null);

    return {
      message: 'Produit supprimé.',
      product
    };
  }

  async stats(shopId) {
    const filters = {};
    if (shopId) filters.shopId = shopId;

    const [total, active, promotion, lowStock] = await Promise.all([
      Product.countDocuments(filters),
      Product.countDocuments({ ...filters, isActive: true }),
      Product.countDocuments({ ...filters, isPromotion: true }),
      Product.countDocuments({
        ...filters,
        $expr: { $lte: ['$stock.quantity', '$stock.lowStockAlert'] }
      })
    ]);

    return {
      total,
      active,
      promotion,
      lowStock
    };
  }
}

module.exports = new ProductService();
