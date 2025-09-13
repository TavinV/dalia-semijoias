import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    dalia_id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    material: { type: String, required: true },
    gender: {type: String, default: "feminino"}
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product; 