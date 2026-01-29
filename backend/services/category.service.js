const { Category } = require('../models');

class CategoryService {
  async list(type) {
    const filters = {};
    if (type) filters.type = type;
    return Category.find(filters).sort({ name: 1 });
  }

  async getById(categoryId) {
    if (!categoryId) {
      const error = new Error('categoryId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Catégorie introuvable.');
      error.status = 404;
      throw error;
    }

    return category;
  }

  async create(data) {
    const { name, type } = data;
    if (!name || !type) {
      const error = new Error('name et type sont obligatoires.');
      error.status = 400;
      throw error;
    }

    const category = new Category({
      name,
      type,
      description: data.description,
      icon: data.icon,
      isActive: data.isActive !== undefined ? data.isActive : true
    });

    await category.save();

    return {
      message: 'Catégorie créée avec succès.',
      category
    };
  }

  async update(categoryId, data) {
    if (!categoryId) {
      const error = new Error('categoryId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: data.name,
        type: data.type,
        description: data.description,
        icon: data.icon,
        isActive: data.isActive
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      const error = new Error('Catégorie introuvable.');
      error.status = 404;
      throw error;
    }

    return {
      message: 'Catégorie mise à jour avec succès.',
      category
    };
  }

  async remove(categoryId, deletedByUserId) {
    if (!categoryId) {
      const error = new Error('categoryId est obligatoire.');
      error.status = 400;
      throw error;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Catégorie introuvable.');
      error.status = 404;
      throw error;
    }

    await category.softDelete(deletedByUserId || null);

    return {
      message: 'Catégorie supprimée.',
      category
    };
  }
}

module.exports = new CategoryService();
