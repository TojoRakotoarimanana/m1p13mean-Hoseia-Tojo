const ProductService = require('../services/product.service');
const { processImages } = require('../utils/upload');

exports.create = async (req, res) => {
  try {
    const images = await processImages(req.files || []);
    const result = await ProductService.create(req.body, images);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création.' });
  }
};

exports.listByShop = async (req, res) => {
  try {
    const result = await ProductService.listByShop(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.stats = async (req, res) => {
  try {
    const result = await ProductService.stats(req.query.shopId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await ProductService.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération.' });
  }
};

exports.update = async (req, res) => {
  try {
    const images = await processImages(req.files || []);
    const result = await ProductService.update(req.params.id, req.body, images);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await ProductService.remove(req.params.id, req.body.deletedByUserId);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const result = await ProductService.updateStock(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour du stock.' });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const result = await ProductService.updatePromotion(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour de la promotion.' });
  }
};
