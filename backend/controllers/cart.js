import Carts from '../models/Cart.js';
import Products from '../models/Product.js';
import {createError} from "../error.js";

export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { productId, quantity = 1 } = req.body;
        if (!userId || !productId) return res.status(400).json({ message: "Thiếu tham số" });

        let cart = await Carts.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.productId === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += Number(quantity);
            } else {
                cart.products.push({ productId, quantity: Number(quantity) });
            }
            await cart.save();
        } else {
            const newCart = new Carts({ userId, products: [{ productId, quantity: Number(quantity) }] });
            await newCart.save();
            cart = newCart;
        }

        res.status(200).json({ message: "Sản phẩm đã được thêm vào giỏ hàng", cart });
    } catch (error) {
        next(createError(500, "Lỗi khi thêm sản phẩm vào giỏ hàng"));
    }
};

export const getCart = async (req, res, next) => {
    try {
        const requestedUserId = String(req.params.userId);
        const requesterId = req.user?.id ? String(req.user.id) : null;
        if (!requesterId || requesterId !== requestedUserId) {
            return res.status(403).json({ message: "Không có quyền truy cập giỏ hàng này" });
        }

        const cart = await Carts.findOne({ userId: requestedUserId });
        if (!cart) {
            return res.status(200).json({ products: [] });
        }

        // Populate product details
        const detailed = await Promise.all(
            cart.products.map(async (p) => {
                try {
                    const prod = await Products.findById(p.productId).lean();
                    if (!prod) return null;
                    return {
                        id: prod._id.toString(),
                        productName: prod.productName,
                        currentPrice: prod.currentPrice,
                        shopID: prod.shopID,
                        shopName: prod.shopName,
                        img: prod.imgs && prod.imgs.length > 0 ? prod.imgs[0] : prod.thumbnail || "",
                        quantity: p.quantity,
                    };
                } catch (e) {
                    return null;
                }
            })
        );

        res.status(200).json({ products: detailed.filter(Boolean) });
    } catch (error) {
        next(createError(500, "Lỗi khi lấy giỏ hàng"));
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { productId } = req.body;
        if (!userId || !productId) return res.status(400).json({ message: "Thiếu tham số" });
        const cart = await Carts.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        cart.products = cart.products.filter((p) => p.productId !== productId);
        await cart.save();
        res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    } catch (error) {
        next(createError(500, "Lỗi khi xóa sản phẩm khỏi giỏ hàng"));
    }
};

export const updateQuantity = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { productId, quantity } = req.body;
        if (!userId || !productId) return res.status(400).json({ message: "Thiếu tham số" });
        const cart = await Carts.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
        const idx = cart.products.findIndex((p) => p.productId === productId);
        if (idx === -1) return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ" });
        const q = Number(quantity);
        if (q <= 0) {
            cart.products.splice(idx, 1);
        } else {
            cart.products[idx].quantity = q;
        }
        await cart.save();
        res.status(200).json({ message: "Cập nhật giỏ hàng thành công" });
    } catch (error) {
        next(createError(500, "Lỗi khi cập nhật giỏ hàng"));
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body.userId;
        if (!userId) return res.status(400).json({ message: "Thiếu tham số" });
        await Carts.findOneAndUpdate({ userId }, { $set: { products: [] } }, { upsert: true });
        res.status(200).json({ message: "Đã xóa giỏ hàng" });
    } catch (error) {
        next(createError(500, "Lỗi khi xóa giỏ hàng"));
    }
};
