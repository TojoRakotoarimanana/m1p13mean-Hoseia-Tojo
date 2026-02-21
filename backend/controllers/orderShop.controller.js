const OrderShopService = require('../services/orderShop.service');

exports.list = async (req, res) => {
  try {
    const result = await OrderShopService.list(req.user._id, req.query);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await OrderShopService.getById(req.user._id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const result = await OrderShopService.updateStatus(req.user._id, req.params.id, req.body.status);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
  }
};

exports.stats = async (req, res) => {
  try {
    const result = await OrderShopService.stats(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Erreur serveur.' });
  }
};
