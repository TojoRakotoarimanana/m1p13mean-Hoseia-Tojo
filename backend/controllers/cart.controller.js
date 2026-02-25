const CartService = require('../services/cart.service');

exports.getCart = async (req, res) => {
    try {
        const result = await CartService.getCart(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération du panier.' });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const result = await CartService.addItem(req.user._id, productId, quantity);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de l\'ajout au panier.' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const result = await CartService.updateItem(req.user._id, req.params.itemId, quantity);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la mise à jour.' });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const result = await CartService.removeItem(req.user._id, req.params.itemId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la suppression.' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const result = await CartService.clearCart(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors du vidage du panier.' });
    }
};
