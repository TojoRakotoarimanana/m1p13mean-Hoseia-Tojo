const { Shop, User } = require('../models');

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

  async listPending() {
    return Shop.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
  }

  async getByUser(userId) {
    if (!userId) {
      const error = new Error('userId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findOne({ userId, status: 'active', isActive: true })
      .populate('userId', 'firstName lastName email')
      .populate('category', 'name description');

    if (!shop) {
      const error = new Error('Aucune boutique active trouvée.');
      error.status = 404;
      throw error;
    }

    return shop;
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

  async approve(shopId, location) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { status: 'active', isActive: true, location },
      { new: true }
    );

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique validée et activée.',
      shop
    };
  }

  async reject(shopId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { status: 'rejected', isActive: false },
      { new: true }
    );

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique refusée.',
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

  async listAll() {
    try {
      const shops = await Shop.find()
        .populate('userId', 'firstName lastName email')
        .populate('category', 'name')
        .sort({ createdAt: -1 });

      return {
        total: shops.length,
        shops
      };
    } catch (error) {
      throw new Error('Erreur lors de la récupération des boutiques.');
    }
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
      message: 'Boutique suspendue avec succès.',
      shop
    };
  }

  async validateAdmin(shopId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { status: 'active', isActive: true },
      { new: true }
    ).populate('userId', 'firstName lastName email')
     .populate('category', 'name');

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique validée et activée avec succès.',
      shop
    };
  }

  async rejectAdmin(shopId) {
    if (!shopId) {
      const error = new Error('shopId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { status: 'rejected', isActive: false },
      { new: true }
    ).populate('userId', 'firstName lastName email')
     .populate('category', 'name');

    if (!shop) {
      const error = new Error('Boutique introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Boutique rejetée.',
      shop
    };
  }
}

module.exports = new ShopService();
