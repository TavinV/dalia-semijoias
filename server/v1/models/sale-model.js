import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const saleSchema = new mongoose.Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },
        items: { type: [saleItemSchema], required: true, validate: v => v.length > 0 },
        total: { type: Number, required: true, min: 0 },
        paid: { type: Boolean, default: false },
        paidAt: { type: Date, default: null },
        saleDate: { type: Date, default: Date.now },
        notes: { type: String, default: "", trim: true },
    },
    { timestamps: true }
);

saleSchema.index({ clientId: 1, saleDate: -1 });
saleSchema.index({ paid: 1, saleDate: -1 });

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
