import ProductServices from "../services/product-services.js";
import ApiResponse from "../utils/api-response.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {
    ConflictError,
    NotFoundError,
    ValidationError,
    AppError
} from "../errors/errors.js";

const productController = {
    async createProduct(req, res) {
        try {
            const { name, description, price, category, stock, material } = req.body;

            if (!name || !description || !price || !category || !stock || !material) {
                throw new ValidationError("Todos os campos são obrigatórios");
            }

            if (!req.file) {
                throw new ValidationError("Imagem do produto é obrigatória");
            }

            const dalia_id =
                name.trim().split(/\s+/)[0].toLowerCase() +
                "-" +
                Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0");

            // pega a URL pública do Cloudinary
            const imageUrl = req.file.path;

            const product = await ProductServices.createProduct({
                ...req.body,
                dalia_id,
                imageUrl,
            });

            return ApiResponse.CREATED(res, product, "Produto criado com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof ConflictError) {
                return ApiResponse.CONFLICT(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao criar produto: " + error.message);
        }
    },

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            let produto;

            if (req.file) {
                const imageUrl = req.file.path; // URL do Cloudinary
                console.log("URL FINAL: " + imageUrl)
                produto = await ProductServices.updateProduct(id, {
                    ...req.body,
                    imageUrl,
                });
            } else {
                produto = await ProductServices.updateProduct(id, req.body);
            }
            
            return ApiResponse.OK(res, produto, "Produto atualizado com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao atualizar produto: " + error.message);
        }
    },

    async deleteProduct(req, res) {
        try {
            // Excluir a imagem tambem

            const { id } = req.params;
            const { imageUrl } = await ProductServices.deleteProduct(id);

            // Excluir a imagem do sistema de arquivos
            if (imageUrl) {
                const imagePath = path.join(__dirname, '../../uploads', imageUrl);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Erro ao excluir imagem: ", err);
                    }
                });
            }

            return ApiResponse.OK(res, null, 'Produto deletado com sucesso');
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, 'Erro ao deletar produto: ' + error.message);
        }
    },

    async getProductByDaliaId(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductServices.getProductByDaliaId(id);
            return ApiResponse.OK(res, product);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, 'Erro ao buscar produto: ' + error.message);
        }
    },

    async getAllProducts(req, res) {
        try {
            const name = req.query.name;

            if (name) {
                const products = await ProductServices.getProductsByName(name);
                return ApiResponse.OK(res, products);
            }

            const products = await ProductServices.getAllProducts();
            return ApiResponse.OK(res, products);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, 'Erro ao buscar produtos: ' + error.message);
        }
    }
}

export default productController;