import CompraFornecedorServices from "../services/compra-fornecedor-services.js";
import ApiResponse from "../utils/api-response.js";

import {
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

const compraFornecedorController = {
    async createCompra(req, res) {
        try {
            const result = await CompraFornecedorServices.createComItens(req.body);
            return ApiResponse.CREATED(
                res,
                result,
                "Compra registrada com sucesso"
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao registrar compra: " + error.message
            );
        }
    },

    async updateCompra(req, res) {
        try {
            const { id } = req.params;
            const compra = await CompraFornecedorServices.update(id, req.body);
            return ApiResponse.OK(res, compra, "Compra atualizada com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao atualizar compra: " + error.message
            );
        }
    },

    async deleteCompra(req, res) {
        try {
            const { id } = req.params;
            const result = await CompraFornecedorServices.delete(id);
            return ApiResponse.OK(res, result, "Compra removida com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao deletar compra: " + error.message
            );
        }
    },

    async getCompraById(req, res) {
        try {
            const { id } = req.params;
            const result = await CompraFornecedorServices.getById(id);
            return ApiResponse.OK(res, result);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar compra: " + error.message
            );
        }
    },

    async getComprasByFornecedor(req, res) {
        try {
            const { fornecedorId } = req.params;
            const compras = await CompraFornecedorServices.getByFornecedor(
                fornecedorId
            );
            return ApiResponse.OK(res, compras);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar compras do fornecedor: " + error.message
            );
        }
    },

    async getAllCompras(req, res) {
        try {
            const compras = await CompraFornecedorServices.getAll();
            return ApiResponse.OK(res, compras);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar compras: " + error.message
            );
        }
    },

    // VIEW: vw_compras_por_mes
    async getComprasPorMes(req, res) {
        try {
            const { fornecedorId } = req.query;
            const rows = await CompraFornecedorServices.comprasPorMes({
                fornecedorId,
            });
            return ApiResponse.OK(res, rows);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao gerar relatório de compras por mês: " + error.message
            );
        }
    },

    // VIEW: vw_estoque_por_categoria
    async getEstoquePorCategoria(req, res) {
        try {
            const rows = await CompraFornecedorServices.estoquePorCategoria();
            return ApiResponse.OK(res, rows);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao gerar relatório de estoque por categoria: " +
                    error.message
            );
        }
    },

    // ---------- Itens ----------

    async addItem(req, res) {
        try {
            const { id } = req.params;
            const item = await CompraFornecedorServices.addItem(id, req.body);
            return ApiResponse.CREATED(
                res,
                item,
                "Item adicionado com sucesso"
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao adicionar item: " + error.message
            );
        }
    },

    async updateItem(req, res) {
        try {
            const { itemId } = req.params;
            const item = await CompraFornecedorServices.updateItem(
                itemId,
                req.body
            );
            return ApiResponse.OK(res, item, "Item atualizado com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao atualizar item: " + error.message
            );
        }
    },

    async deleteItem(req, res) {
        try {
            const { itemId } = req.params;
            const result = await CompraFornecedorServices.deleteItem(itemId);
            return ApiResponse.OK(res, result, "Item removido com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao deletar item: " + error.message
            );
        }
    },

    async getItensByCompra(req, res) {
        try {
            const { id } = req.params;
            const itens = await CompraFornecedorServices.getItensByCompra(id);
            return ApiResponse.OK(res, itens);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar itens da compra: " + error.message
            );
        }
    },
};

export default compraFornecedorController;
