import mongoose from "mongoose";

const GoodReceiptSchema = new mongoose.Schema
(
    {
        name: {
            type: String,
            default: "",
        },
        productId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        importedDate: {
            type: Date,
            required: true,
        },
        shopId: {
            type: String,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        soldQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        expiredAt: {
            type: Date,
            default: null,
        },
    },
    { 
        timestamps: true
    }
)

export default mongoose.model("GoodReceipt", GoodReceiptSchema);