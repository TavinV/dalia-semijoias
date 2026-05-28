import SaleServices from "../services/sale-services.js";
import ApiResponse from "../utils/api-response.js";

import {
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

const saleController = {
    async createSale(req, res) {
        try {
            const sale = await SaleServices.createSale(req.body);
            return ApiResponse.CREATED(res, sale, "Venda registrada com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao registrar venda: " + error.message);
        }
    },

    async updateSale(req, res) {
        try {
            const { id } = req.params;
            const sale = await SaleServices.updateSale(id, req.body);
            return ApiResponse.OK(res, sale, "Venda atualizada com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao atualizar venda: " + error.message);
        }
    },

    async deleteSale(req, res) {
        try {
            const { id } = req.params;
            await SaleServices.deleteSale(id);
            return ApiResponse.OK(res, null, "Venda removida com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao deletar venda: " + error.message);
        }
    },

    async markAsPaid(req, res) {
        try {
            const { id } = req.params;
            const sale = await SaleServices.markAsPaid(id);
            return ApiResponse.OK(res, sale, "Venda marcada como paga");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao marcar venda: " + error.message);
        }
    },

    async getSalesByClient(req, res) {
        try {
            const { clientId } = req.params;
            const sales = await SaleServices.getSalesByClient(clientId);
            return ApiResponse.OK(res, sales);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar vendas: " + error.message);
        }
    },

    async getUnpaidSales(req, res) {
        try {
            const sales = await SaleServices.getUnpaidSales();
            return ApiResponse.OK(res, sales);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar pendências: " + error.message);
        }
    },

    async getAllSales(req, res) {
        try {
            const sales = await SaleServices.getAllSales();
            return ApiResponse.OK(res, sales);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar vendas: " + error.message);
        }
    },

    async getTopVendidosNoMes(req, res) {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 5, 20);
            const rows = await SaleServices.getTopVendidosNoMes(limit);
            return ApiResponse.OK(res, rows);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar top vendidos: " + error.message);
        }
    },
};

export default saleController;
