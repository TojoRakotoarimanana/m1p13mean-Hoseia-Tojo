const CatalogService = require('../services/catalog.service');

exports.getProducts = async (req, res) => {
  try {
    const result = await CatalogService.getPublicProducts(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération des produits.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const result = await CatalogService.getProductDetails(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération du produit.' });
  }
};

exports.getShops = async (req, res) => {
  try {
    const result = await CatalogService.getActiveShops(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération des boutiques.' });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const result = await CatalogService.getShopDetails(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération de la boutique.' });
  }
};

exports.getPromotions = async (req, res) => {
  try {
    const result = await CatalogService.getPromotions(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération des promotions.' });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.query.q || req.query.search;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Paramètre de recherche requis (q ou search).' });
    }
    
    const result = await CatalogService.globalSearch(searchTerm, req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la recherche.' });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    const result = await CatalogService.incrementProductViews(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour des vues.' });
  }
};