import User from "../models/User.js";
import Product from "../models/Product.js";
import { createError } from "../error.js";


export const getShopDetails = async (req, res, next) => 
{
    try
    {
        const shop = await User.findById(req.params.id).select("-password");
        if (!shop)
        {
            return next(createError(404, "Không tìm thấy thông tin cửa hàng"));
        }
        else
        {
            const products = await Product.find({ shopID: req.params.id }).sort({ createdAt: -1 });
            res.status(200).json({
                shop,
                products,
                productsCount: products.length,
            });
        }
    }
    catch (err)
    {
        next(err);
    }
}

export const getAllShops = async (req, res, next) => {
  try {
    const shops = await User.find({ role: "shop" });
    res.status(200).json(shops);
  }
    catch (err) {
        next(err);
    }
};