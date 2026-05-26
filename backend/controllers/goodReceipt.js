import GoodReceipt from "../models/GoodReceipt.js";
import Product from "../models/Product.js";
import { createError } from "../error.js";
import {
  recalculateProductStock,
} from "../utils/inventory.js";

const formatReceiptDateLabel = (value) => {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const getReceiptDayRange = (value) => {
    const date = value instanceof Date ? new Date(value) : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
};

const buildGoodReceiptName = async ({ importedDate, shopId, excludeReceiptId }) => {
    const dayRange = getReceiptDayRange(importedDate);

    if (!dayRange || !shopId) {
        return "";
    }

    const query = {
        shopId,
        importedDate: {
            $gte: dayRange.start,
            $lt: dayRange.end,
        },
    };

    if (excludeReceiptId) {
        query._id = { $ne: excludeReceiptId };
    }

    const receiptCount = await GoodReceipt.countDocuments(query);

    return `${formatReceiptDateLabel(dayRange.start)} nhập kho lần ${receiptCount + 1}`;
};

export const createGoodReceipt = async (req, res, next) => {
    try {
        const { productId, quantity, importedDate, expirationDate } = req.body;

        if (!productId) {
            return next(createError(400, "Thiếu thông tin sản phẩm"));
        }

        const parsedQuantity = Number(quantity);
        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            return next(createError(400, "Số lượng nhập không hợp lệ"));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
        }

        const nextSoldQuantity = Number(req.body.soldQuantity ?? 0);
        if (!Number.isFinite(nextSoldQuantity) || nextSoldQuantity < 0 || nextSoldQuantity > parsedQuantity) {
            return next(createError(400, "Số lượng đã bán không hợp lệ"));
        }

        const nextImportedDate = new Date(importedDate);
        const nextExpirationDate = new Date(expirationDate);

        if (Number.isNaN(nextImportedDate.getTime()) || Number.isNaN(nextExpirationDate.getTime())) {
            return next(createError(400, "Ngày nhập hoặc hạn sử dụng không hợp lệ"));
        }

        const receiptName = await buildGoodReceiptName({
            importedDate: nextImportedDate,
            shopId: product.shopID,
        });

        const newGoodReceipt = new GoodReceipt({
            name: receiptName,
            productId,
            quantity: parsedQuantity,
            importedDate: nextImportedDate,
            expirationDate: nextExpirationDate,
            soldQuantity: nextSoldQuantity,
            shopId: product.shopID,
        });

        await newGoodReceipt.save();
        await recalculateProductStock(productId);
        res.status(200).json("Tạo phiếu nhập hàng thành công");
    } catch (error) {
        next(error);
    }
};

export const getGoodReceipts = async (req, res, next) => {
    try {
        const goodReceipts = await GoodReceipt.find().sort({ createdAt: -1 });
        res.status(200).json(goodReceipts);
    } catch (error) {
        next(createError(500, "Lấy danh sách phiếu nhập hàng thất bại"));
    }
};

export const getGoodReceiptByShopId = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const goodReceipts = await GoodReceipt.find({ shopId }).sort({ createdAt: -1 });
        res.status(200).json(goodReceipts);
    } catch (error) {
        next(createError(500, "Lấy danh sách phiếu nhập hàng theo cửa hàng thất bại"));
    }
};

export const getGoodReceiptByProductId = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const goodReceipts = await GoodReceipt.find({ productId }).sort({ importedDate: 1, createdAt: 1 });
        res.status(200).json(goodReceipts);
    } catch (error) {
        next(createError(500, "Lấy danh sách phiếu nhập theo sản phẩm thất bại"));
    }
};

export const deleteGoodReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const receipt = await GoodReceipt.findById(id);

        if (!receipt) {
            return next(createError(404, "Không tìm thấy phiếu nhập hàng"));
        }

        await GoodReceipt.findByIdAndDelete(id);
        await recalculateProductStock(receipt.productId);
        res.status(200).json("Xóa phiếu nhập hàng thành công");
    } catch (error) {
        next(createError(500, "Xóa phiếu nhập hàng thất bại"));
    }
};

export const updateGoodReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentReceipt = await GoodReceipt.findById(id);
        if (!currentReceipt) {
            return next(createError(404, "Không tìm thấy phiếu nhập hàng"));
        }

        const nextProductId = req.body.productId || currentReceipt.productId;
        const nextQuantity = Number(req.body.quantity ?? currentReceipt.quantity);
        const nextSoldQuantity = Number(req.body.soldQuantity ?? currentReceipt.soldQuantity ?? 0);

        if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
            return next(createError(400, "Số lượng nhập không hợp lệ"));
        }
        if (!Number.isFinite(nextSoldQuantity) || nextSoldQuantity < 0 || nextSoldQuantity > nextQuantity) {
            return next(createError(400, "Số lượng đã bán không hợp lệ"));
        }

        const nextProduct = await Product.findById(nextProductId);
        if (!nextProduct) {
            return next(createError(404, "Không tìm thấy thông tin sản phẩm"));
        }

        const nextImportedDateValue = req.body.importedDate ?? currentReceipt.importedDate;
        const nextExpirationDateValue = req.body.expirationDate ?? currentReceipt.expirationDate;
        const nextImportedDate = new Date(nextImportedDateValue);
        const nextExpirationDate = new Date(nextExpirationDateValue);

        if (Number.isNaN(nextImportedDate.getTime()) || Number.isNaN(nextExpirationDate.getTime())) {
            return next(createError(400, "Ngày nhập hoặc hạn sử dụng không hợp lệ"));
        }

        const shouldRegenerateName =
            req.body.importedDate !== undefined ||
            nextProduct.shopID !== currentReceipt.shopId ||
            !currentReceipt.name;

        const nextName = shouldRegenerateName
            ? await buildGoodReceiptName({
                importedDate: nextImportedDate,
                shopId: nextProduct.shopID,
                excludeReceiptId: id,
            })
            : currentReceipt.name;

        await GoodReceipt.findByIdAndUpdate(
            id,
            {
                ...req.body,
                productId: nextProductId,
                quantity: nextQuantity,
                soldQuantity: nextSoldQuantity,
                shopId: nextProduct.shopID,
                name: nextName,
                importedDate: nextImportedDate,
                expirationDate: nextExpirationDate,
            },
            { new: true },
        );

        const productIdsToRecalculate = new Set([currentReceipt.productId, nextProductId]);
        for (const productId of productIdsToRecalculate) {
            await recalculateProductStock(productId);
        }

        res.status(200).json("Cập nhật phiếu nhập hàng thành công");
    } catch (error) {
        next(createError(500, "Cập nhật phiếu nhập hàng thất bại"));
    }
};