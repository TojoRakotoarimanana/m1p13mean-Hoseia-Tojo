const ShopService = require('../services/shop.service');

exports.list = async (req, res) => {
  try {
    const result = await ShopService.list(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.listPending = async (req, res) => {
  try {
    const result = await ShopService.listPending();
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const result = await ShopService.getByUser(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await ShopService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await ShopService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await ShopService.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
};

exports.suspend = async (req, res) => {
  try {
    const result = await ShopService.suspend(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suspension.' });
  }
};

exports.approve = async (req, res) => {
  try {
    const result = await ShopService.approve(req.params.id, req.body.location);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la validation.' });
  }
};

exports.reject = async (req, res) => {
  try {
    const result = await ShopService.reject(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors du refus.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await ShopService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
};
