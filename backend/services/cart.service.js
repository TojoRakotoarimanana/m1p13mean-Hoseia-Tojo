const { Cart, Product } = require('../models');

class CartService {
    async getCart(userId) {
        let cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                select: 'name price originalPrice isPromotion images stock isActive shopId'
            })
            .populate({
                path: 'items.shopId',
                select: 'name'
            });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
            await cart.save();
        }

        return cart;
    }

    async addItem(userId, productId, quantity = 1) {
        if (!productId) {
            const error = new Error('productId est obligatoire.');
            error.status = 400;
            throw error;
        }

        const product = await Product.findById(productId).populate('shopId', 'name');
        if (!product) {
            const error = new Error('Produit introuvable.');
            error.status = 404;
            throw error;
        }

        if (!product.isActive) {
            const error = new Error('Ce produit n\'est plus disponible.');
            error.status = 400;
            throw error;
        }

        const qty = Math.max(1, Number(quantity) || 1);

        if (product.stock.quantity < qty) {
            const error = new Error(`Stock insuffisant. Disponible: ${product.stock.quantity}.`);
            error.status = 400;
            throw error;
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === productId.toString()
        );

        if (existingItem) {
            const newQty = existingItem.quantity + qty;
            if (product.stock.quantity < newQty) {
                const error = new Error(`Stock insuffisant. Disponible: ${product.stock.quantity}, déjà dans le panier: ${existingItem.quantity}.`);
                error.status = 400;
                throw error;
            }
            existingItem.quantity = newQty;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                productId: product._id,
                shopId: product.shopId._id || product.shopId,
                quantity: qty,
                price: product.price
            });
        }

        cart.calculateTotal();
        await cart.save();

        // Populate pour le retour
        await cart.populate([
            { path: 'items.productId', select: 'name price originalPrice isPromotion images stock isActive shopId' },
            { path: 'items.shopId', select: 'name' }
        ]);

        return {
            message: 'Produit ajouté au panier.',
            cart
        };
    }

    async updateItem(userId, itemId, quantity) {
        if (!itemId) {
            const error = new Error('itemId est obligatoire.');
            error.status = 400;
            throw error;
        }

        if (quantity === undefined || quantity === null) {
            const error = new Error('La quantité est obligatoire.');
            error.status = 400;
            throw error;
        }

        const qty = Number(quantity);
        if (qty < 1) {
            const error = new Error('La quantité doit être au moins 1.');
            error.status = 400;
            throw error;
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error = new Error('Panier introuvable.');
            error.status = 404;
            throw error;
        }

        const item = cart.items.id(itemId);
        if (!item) {
            const error = new Error('Article introuvable dans le panier.');
            error.status = 404;
            throw error;
        }

        // Vérifier le stock
        const product = await Product.findById(item.productId);
        if (!product) {
            const error = new Error('Produit introuvable.');
            error.status = 404;
            throw error;
        }

        if (product.stock.quantity < qty) {
            const error = new Error(`Stock insuffisant. Disponible: ${product.stock.quantity}.`);
            error.status = 400;
            throw error;
        }

        item.quantity = qty;
        item.price = product.price;
        cart.calculateTotal();
        await cart.save();

        await cart.populate([
            { path: 'items.productId', select: 'name price originalPrice isPromotion images stock isActive shopId' },
            { path: 'items.shopId', select: 'name' }
        ]);

        return {
            message: 'Quantité mise à jour.',
            cart
        };
    }

    async removeItem(userId, itemId) {
        if (!itemId) {
            const error = new Error('itemId est obligatoire.');
            error.status = 400;
            throw error;
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error = new Error('Panier introuvable.');
            error.status = 404;
            throw error;
        }

        const item = cart.items.id(itemId);
        if (!item) {
            const error = new Error('Article introuvable dans le panier.');
            error.status = 404;
            throw error;
        }

        cart.items.pull(itemId);
        cart.calculateTotal();
        await cart.save();

        return {
            message: 'Article retiré du panier.',
            cart
        };
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            const error = new Error('Panier introuvable.');
            error.status = 404;
            throw error;
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        return {
            message: 'Panier vidé.',
            cart
        };
    }
}

module.exports = new CartService();
