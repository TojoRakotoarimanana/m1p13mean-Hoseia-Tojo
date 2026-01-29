const { Shop } = require('../models');

class ShopService {
  async list(query) {
    const {
      category,
      status,
      isActive,
      floor,
      zone,
      shopNumber,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const filters = {};

    if (category) filters.category = category;
    if (status) filters.status = status;
    if (isActive !== undefined) filters.isActive = isActive === 'true' || isActive === true;
    if (floor) filters['location.floor'] = floor;
    if (zone) filters['location.zone'] = zone;
    if (shopNumber) filters['location.shopNumber'] = shopNumber;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Shop.find(filters)
        .populate('userId', 'firstName lastName email')
        .populate('category', 'name')
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limitNumber),
      Shop.countDocuments(filters)
    ]);

    return {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      items
    };
  }

  async getById(shopId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return shop;
  }

  async create(data) {
    const { userId, name, category } = data;

    if (!userId || !name || !category) {
      const error = new Error('userId, name et category sont obligatoires.');
      error.status = 400;
      throw error;
    }

    const shop = new Shop({
      userId,
      name,
      category,
      description: data.description,
      logo: data.logo,
      location: data.location,
      contact: data.contact,
      hours: data.hours,
      status: data.status
    });

    await shop.save();

    return {
      message: 'Boutique créée avec succès.',
      shop
    };
  }

  async update(shopId, data) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      {
        name: data.name,
        description: data.description,
        logo: data.logo,
        category: data.category,
        location: data.location,
        contact: data.contact,
        hours: data.hours,
        status: data.status,
        isActive: data.isActive
      },
      { new: true, runValidators: true }
    );

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique mise à jour avec succès.',
      shop
    };
  }

  async suspend(shopId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { status: 'suspended', isActive: false },
      { new: true }
    );

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique suspendue.',
      shop
    };
  }

  async remove(shopId, deletedByUserId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    await shop.softDelete(deletedByUserId || null);

    return {
      message: 'Boutique supprimée.',
      shop
    };
  }
}

module.exports = new ShopService();
