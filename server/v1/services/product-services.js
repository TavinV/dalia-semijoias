import Product from "../models/product-model.js";
import productSchema from "../validation/product-schema.js";
import updateProductSchema from "../validation/update-product-schema.js";

import {
    ConflictError,
    NotFoundError,
    ValidationError,
    AppError
} from "../errors/errors.js";

class ProductServices {
    // Criar produto
    static async createProduct(productData) {
        try {
            const { error } = productSchema.validate(productData);
            if (error) throw new ValidationError(error.details[0].message);

            const existing = await Product.findOne({ dalia_id: productData.dalia_id });
            if (existing) throw new ConflictError("Já existe um produto com este dalia_id");

            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            if (error instanceof ConflictError) throw error;
            if (error.code === 11000) {
                throw new ConflictError("Produto já existe");
            }
            throw new AppError("Erro ao criar produto: " + error.message);
        }
    }

    // Atualizar produto por dalia_id

    static async updateProduct(dalia_id, updateData) {
        try {
            const { error } = updateProductSchema.validate(updateData);
            if (error) throw new ValidationError(error.details[0].message);

            const product = await Product.findOneAndUpdate(
                { dalia_id },
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) throw new NotFoundError("Produto não encontrado");
            return product;
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao atualizar produto: " + error.message);
        }
    }

    // Deduzir estoque
    static async decreaseStock(dalia_id, quantity) {
        try {
            if (quantity <= 0) throw new ValidationError("Quantidade deve ser maior que 0");

            const product = await Product.findOne({ dalia_id });
            if (!product) throw new NotFoundError("Produto não encontrado");

            if (product.stock < quantity) {
                throw new ConflictError("Estoque insuficiente");
            }

            product.stock -= quantity;
            await product.save();
            return product;
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            if (error instanceof NotFoundError) throw error;
            if (error instanceof ConflictError) throw error;
            throw new AppError("Erro ao deduzir estoque: " + error.message);
        }
    }

    // Aumentar estoque
    static async increaseStock(dalia_id, quantity) {
        try {
            if (quantity <= 0) throw new ValidationError("Quantidade deve ser maior que 0");

            const product = await Product.findOne({ dalia_id });
            if (!product) throw new NotFoundError("Produto não encontrado");

            product.stock += quantity;
            await product.save();
            return product;
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao aumentar estoque: " + error.message);
        }
    }

    // Buscar todos os produtos
    static async getAllProducts(filter = {}) {
        try {
            const products = await Product.find(filter);
            if (!products || products.length === 0) throw new NotFoundError("Nenhum produto encontrado");
            return products;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao buscar produtos: " + error.message);
        }
    }

    // Buscar por nome (case-insensitive, contém)
    static async getProductsByName(name) {
        try {
            const products = await Product.find({
                name: { $regex: new RegExp(name, "i") }
            });
            if (!products || products.length === 0) throw new NotFoundError("Nenhum produto encontrado com este nome");
            return products;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao buscar produtos por nome: " + error.message);
        }
    }

    // Buscar por dalia_id
    static async getProductByDaliaId(dalia_id) {
        try {
            const product = await Product.findOne({ dalia_id });
            if (!product) throw new NotFoundError("Produto não encontrado");
            return product;
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao buscar produto por dalia_id: " + error.message);
        }
    }

    // Deletar produto por dalia_id
    static async deleteProduct(dalia_id) {
        try {
            const product = await Product.findOneAndDelete({ dalia_id });
            if (!product) throw new NotFoundError("Produto não encontrado");
            return { message: "Produto deletado com sucesso", imageUrl: product.imageUrl };
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new AppError("Erro ao deletar produto: " + error.message);
        }
    }
}

export default ProductServices;
