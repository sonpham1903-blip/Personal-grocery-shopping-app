import GoodReceipt from "../models/GoodReceipt.js";
import Product from "../models/Product.js";

const getReceiptAvailability = (receipt) => {
  const importedQuantity = Number(receipt.quantity || 0);
  const soldQuantity = Number(receipt.soldQuantity || 0);
  return Math.max(0, importedQuantity - soldQuantity);
};

export const recalculateProductStock = async (productId) => {
  const now = new Date();
  const receipts = await GoodReceipt.find({
    productId,
    expiredAt: null,
    expirationDate: { $gt: now },
  }).sort({ importedDate: 1, createdAt: 1 });

  const totalQuantity = receipts.reduce(
    (total, receipt) => total + getReceiptAvailability(receipt),
    0,
  );

  await Product.findByIdAndUpdate(productId, {
    $set: { inStock: totalQuantity },
  });
};


export const syncAllProductStocks = async () => {
  const products = await Product.find({}, { _id: 1 });

  await Promise.all(
    products.map(async (product) => {
      await recalculateProductStock(product._id.toString());
    }),
  );
};

export const allocateReceiptStock = async (productId, quantity) => {
  const now = new Date();
  const receipts = await GoodReceipt.find({
    productId,
    expiredAt: null,
    expirationDate: { $gt: now },
  }).sort({ importedDate: 1, createdAt: 1 });

  const availableStock = receipts.reduce(
    (total, receipt) => total + getReceiptAvailability(receipt),
    0,
  );
  console.log("[inventory] receipt stock snapshot", {
    productId,
    requestedQuantity: Number(quantity || 0),
    availableStock,
    receipts: receipts.map((receipt) => ({
      id: receipt._id.toString(),
      quantity: Number(receipt.quantity || 0),
      soldQuantity: Number(receipt.soldQuantity || 0),
      remaining: getReceiptAvailability(receipt),
      importedDate: receipt.importedDate,
      expirationDate: receipt.expirationDate,
      expiredAt: receipt.expiredAt,
    })),
  });

  if (availableStock < Number(quantity || 0)) {
    throw new Error("Sản phẩm không đủ tồn kho từ các phiếu nhập còn hiệu lực");
  }

  let remaining = Number(quantity || 0);
  const allocations = [];

  for (const receipt of receipts) {
    if (remaining <= 0) {
      break;
    }

    const availableQuantity = getReceiptAvailability(receipt);
    if (availableQuantity <= 0) {
      continue;
    }

    const allocatedQuantity = Math.min(availableQuantity, remaining);
    receipt.soldQuantity = Number(receipt.soldQuantity || 0) + allocatedQuantity;
    await receipt.save();

    allocations.push({
      goodReceiptId: receipt._id.toString(),
      quantity: allocatedQuantity,
    });
    remaining -= allocatedQuantity;
  }

  return allocations;
};

export const releaseReceiptAllocations = async (allocations = []) => {
  await Promise.all(
    allocations.map(async (allocation) => {
      const receipt = await GoodReceipt.findById(allocation.goodReceiptId);
      if (!receipt) {
        return;
      }

      receipt.soldQuantity = Math.max(
        0,
        Number(receipt.soldQuantity || 0) - Number(allocation.quantity || 0),
      );
      await receipt.save();
    }),
  );
};

export const processExpiredReceipts = async () => {
  const now = new Date();
  const expiredReceipts = await GoodReceipt.find({
    expirationDate: { $lte: now },
    expiredAt: null,
  });

  const affectedProductIds = new Set();

  await Promise.all(
    expiredReceipts.map(async (receipt) => {
      receipt.expiredAt = now;
      await receipt.save();
      affectedProductIds.add(receipt.productId);
    }),
  );

  await Promise.all(
    Array.from(affectedProductIds).map((productId) =>
      recalculateProductStock(productId),
    ),
  );
};

export const startReceiptExpiryScheduler = () => {
  const scheduleNextRun = () => {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(24, 0, 0, 0);
    const delay = nextRun.getTime() - now.getTime();

    setTimeout(async () => {
      try {
        await processExpiredReceipts();
      } catch (error) {
        console.error("Failed to process expired receipts:", error);
      }

      scheduleNextRun();
    }, delay);
  };

  scheduleNextRun();
};