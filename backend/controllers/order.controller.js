const OrderService = require('../services/order.service');

exports.create = async (req, res) => {
    try {
        const result = await OrderService.createOrder(req.user._id, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la création de la commande.' });
    }
};

exports.list = async (req, res) => {
    try {
        const result = await OrderService.getOrders(req.user._id, req.query);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération des commandes.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const result = await OrderService.getOrderById(req.user._id, req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de la récupération de la commande.' });
    }
};

exports.cancel = async (req, res) => {
    try {
        const result = await OrderService.cancelOrder(req.user._id, req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur lors de l\'annulation de la commande.' });
    }
};
