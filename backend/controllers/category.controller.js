const CategoryService = require('../services/category.service');

exports.list = async (req, res) => {
  try {
    const result = await CategoryService.list(req.query.type);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await CategoryService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await CategoryService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await CategoryService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await CategoryService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
};
