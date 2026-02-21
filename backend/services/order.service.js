const { Order, Cart, Product, Shop } = require('../models');
const NotificationService = require('./notification.service');

class OrderService {
    async createOrder(userId, data) {
        // 1. Récupérer le panier
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'name price images stock isActive shopId'
        });

        if (!cart || !cart.items.length) {
            const error = new Error('Votre panier est vide.');
            error.status = 400;
            throw error;
        }

        // 2. Valider les infos de livraison
        const deliveryInfo = data.deliveryInfo || {};
        if (!deliveryInfo.method) {
            deliveryInfo.method = 'pickup';
        }

        if (!['pickup', 'delivery'].includes(deliveryInfo.method)) {
            const error = new Error('Méthode de livraison invalide. Utilisez "pickup" ou "delivery".');
            error.status = 400;
            throw error;
        }

        if (deliveryInfo.method === 'delivery') {
            if (!deliveryInfo.address || !deliveryInfo.address.street || !deliveryInfo.address.city) {
                const error = new Error('L\'adresse de livraison (street, city) est obligatoire pour la livraison.');
                error.status = 400;
                throw error;
            }
        }

        if (!deliveryInfo.phone) {
            const error = new Error('Le numéro de téléphone est obligatoire.');
            error.status = 400;
            throw error;
        }

        // 3. Vérifier le stock de chaque produit
        const orderItems = [];
        for (const cartItem of cart.items) {
            const product = await Product.findById(cartItem.productId._id || cartItem.productId);
            if (!product) {
                const error = new Error(`Produit introuvable: ${cartItem.productId.name || cartItem.productId}.`);
                error.status = 404;
                throw error;
            }

            if (!product.isActive) {
                const error = new Error(`Le produit "${product.name}" n'est plus disponible.`);
                error.status = 400;
                throw error;
            }

            if (product.stock.quantity < cartItem.quantity) {
                const error = new Error(`Stock insuffisant pour "${product.name}". Disponible: ${product.stock.quantity}, demandé: ${cartItem.quantity}.`);
                error.status = 400;
                throw error;
            }

            orderItems.push({
                product,
                cartItem
            });
        }

        // 4. Déduire le stock
        for (const { product, cartItem } of orderItems) {
            product.stock.quantity -= cartItem.quantity;
            product.statistics.sold += cartItem.quantity;
            await product.save();
        }

        // 5. Construire les items de la commande et les sous-commandes par boutique
        const items = [];
        const shopOrdersMap = new Map();

        for (const { product, cartItem } of orderItems) {
            const subtotal = product.price * cartItem.quantity;
            const itemData = {
                productId: product._id,
                shopId: product.shopId,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                subtotal,
                image: product.images && product.images.length > 0 ? product.images[0] : undefined
            };
            items.push(itemData);

            // Grouper par boutique
            const shopIdStr = product.shopId.toString();
            if (!shopOrdersMap.has(shopIdStr)) {
                shopOrdersMap.set(shopIdStr, {
                    shopId: product.shopId,
                    status: 'pending',
                    items: [],
                    subtotal: 0
                });
            }
            const shopOrder = shopOrdersMap.get(shopIdStr);
            shopOrder.items.push(product._id);
            shopOrder.subtotal += subtotal;
        }

        // 6. Calculer le total
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

        // 7. Créer la commande (le numéro est généré par le pre-save du modèle)
        const order = new Order({
            customerId: userId,
            items,
            totalAmount,
            status: 'pending',
            deliveryInfo: {
                method: deliveryInfo.method,
                address: deliveryInfo.address || {},
                phone: deliveryInfo.phone
            },
            paymentInfo: {
                method: data.paymentMethod || 'cash',
                status: 'pending'
            },
            notes: data.notes || undefined,
            shopOrders: Array.from(shopOrdersMap.values())
        });

        await order.save();

        // 8. Mettre à jour les statistiques des boutiques
        for (const [shopIdStr, shopOrder] of shopOrdersMap.entries()) {
            await Shop.findByIdAndUpdate(shopIdStr, {
                $inc: {
                    'statistics.totalOrders': 1,
                    'statistics.totalRevenue': shopOrder.subtotal
                }
            });
        }

        // 9. Vider le panier
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        // 10. Créer une notification client
        try {
            await NotificationService.createNotification({
                userId,
                type: 'order',
                title: 'Commande confirmée',
                message: `Votre commande ${order.orderNumber} a été passée avec succès. Total: ${totalAmount.toLocaleString()} Ar.`,
                relatedId: order._id,
                relatedModel: 'Order'
            });
        } catch (notifError) {
            // Ne pas bloquer la commande si la notification échoue
            console.error('Erreur lors de la création de la notification:', notifError.message);
        }

        return {
            message: 'Commande passée avec succès.',
            order
        };
    }

    async getOrders(userId, query = {}) {
        const {
            page = 1,
            limit = 10,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = query;

        const filters = { customerId: userId };
        if (status) filters.status = status;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const [items, total] = await Promise.all([
            Order.find(filters)
                .populate('items.shopId', 'name')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limitNumber),
            Order.countDocuments(filters)
        ]);

        return {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
            items
        };
    }

    async getOrderById(userId, orderId) {
        if (!orderId) {
            const error = new Error('orderId est obligatoire.');
            error.status = 400;
            throw error;
        }

        const order = await Order.findOne({ _id: orderId, customerId: userId })
            .populate('customerId', 'firstName lastName email phone')
            .populate('items.productId', 'name price images')
            .populate('items.shopId', 'name')
            .populate('shopOrders.shopId', 'name');

        if (!order) {
            const error = new Error('Commande introuvable.');
            error.status = 404;
            throw error;
        }

        // Transformer pour le frontend (compatibilité avec les templates existants)
        const orderObj = order.toObject();
        orderObj.customer = orderObj.customerId;
        orderObj.paymentMethod = orderObj.paymentInfo?.method;

        return orderObj;
    }

    async cancelOrder(userId, orderId) {
        if (!orderId) {
            const error = new Error('orderId est obligatoire.');
            error.status = 400;
            throw error;
        }

        const order = await Order.findOne({ _id: orderId, customerId: userId });
        if (!order) {
            const error = new Error('Commande introuvable.');
            error.status = 404;
            throw error;
        }

        if (order.status !== 'pending') {
            const error = new Error(`Impossible d'annuler une commande avec le statut "${order.status}". Seules les commandes en attente peuvent être annulées.`);
            error.status = 400;
            throw error;
        }

        // Restaurer le stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: {
                    'stock.quantity': item.quantity,
                    'statistics.sold': -item.quantity
                }
            });
        }

        // Mettre à jour les statistiques des boutiques
        for (const shopOrder of order.shopOrders) {
            await Shop.findByIdAndUpdate(shopOrder.shopId, {
                $inc: {
                    'statistics.totalOrders': -1,
                    'statistics.totalRevenue': -shopOrder.subtotal
                }
            });
        }

        order.status = 'cancelled';
        await order.save();

        // Notification d'annulation
        try {
            await NotificationService.createNotification({
                userId,
                type: 'order',
                title: 'Commande annulée',
                message: `Votre commande ${order.orderNumber} a été annulée.`,
                relatedId: order._id,
                relatedModel: 'Order'
            });
        } catch (notifError) {
            console.error('Erreur lors de la création de la notification:', notifError.message);
        }

        return {
            message: 'Commande annulée avec succès. Le stock a été restauré.',
            order
        };
    }
}

module.exports = new OrderService();
