import Sale from "../models/sale-model.js";
import Client from "../models/client-model.js";
import saleSchema, { updateSaleSchema } from "../validation/sale-schema.js";

import {
    AppError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class SaleServices {
    static async createSale(data) {
        try {
            const { error } = saleSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const client = await Client.findById(data.clientId);
            if (!client) throw new NotFoundError("Cliente não encontrado");

            const sale = new Sale({
                ...data,
                paidAt: data.paid ? new Date() : null,
            });
            return await sale.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar venda: " + error.message);
        }
    }

    static async updateSale(id, data) {
        try {
            const { error } = updateSaleSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            if (data.paid === true) data.paidAt = new Date();
            if (data.paid === false) data.paidAt = null;

            const sale = await Sale.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });
            if (!sale) throw new NotFoundError("Venda não encontrada");
            return sale;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar venda: " + error.message);
        }
    }

    static async deleteSale(id) {
        try {
            const sale = await Sale.findByIdAndDelete(id);
            if (!sale) throw new NotFoundError("Venda não encontrada");
            return { message: "Venda removida com sucesso" };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar venda: " + error.message);
        }
    }

    static async markAsPaid(id) {
        try {
            const sale = await Sale.findByIdAndUpdate(
                id,
                { paid: true, paidAt: new Date() },
                { new: true }
            );
            if (!sale) throw new NotFoundError("Venda não encontrada");
            return sale;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao marcar venda como paga: " + error.message);
        }
    }

    static async getSalesByClient(clientId) {
        try {
            return await Sale.find({ clientId }).sort({ saleDate: -1 });
        } catch (error) {
            throw new AppError("Erro ao buscar vendas do cliente: " + error.message);
        }
    }

    static async getUnpaidSales() {
        try {
            return await Sale.find({ paid: false })
                .sort({ saleDate: -1 })
                .populate("clientId", "name phone");
        } catch (error) {
            throw new AppError("Erro ao buscar pendências: " + error.message);
        }
    }

    static async getAllSales() {
        try {
            return await Sale.find()
                .sort({ saleDate: -1 })
                .populate("clientId", "name phone");
        } catch (error) {
            throw new AppError("Erro ao buscar vendas: " + error.message);
        }
    }

    static async getSaleById(id) {
        try {
            const sale = await Sale.findById(id).populate("clientId", "name phone");
            if (!sale) throw new NotFoundError("Venda não encontrada");
            return sale;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar venda: " + error.message);
        }
    }

    // PÚBLICO: top peças vendidas no mês atual.
    // Retorna apenas { name, qty }, sem expor cliente nem valores.
    static async getTopVendidosNoMes(limit = 5) {
        try {
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const rows = await Sale.aggregate([
                { $match: { saleDate: { $gte: inicioMes } } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.name",
                        qty: { $sum: "$items.quantity" },
                    },
                },
                { $sort: { qty: -1 } },
                { $limit: limit },
                { $project: { _id: 0, name: "$_id", qty: 1 } },
            ]);
            return rows;
        } catch (error) {
            throw new AppError("Erro ao buscar top vendidos: " + error.message);
        }
    }
}

export default SaleServices;
