import mongoose from "mongoose";
import CompraFornecedor from "../models/compra-fornecedor-model.js";
import ItemCompra from "../models/item-compra-model.js";
import Fornecedor from "../models/fornecedor-model.js";
import {
    compraComItensSchema,
    updateCompraFornecedorSchema,
    itemCompraJoi,
    updateItemCompraSchema,
} from "../validation/compra-fornecedor-schema.js";
import { round2, computeRoi } from "../utils/numeric.js";

import {
    AppError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class CompraFornecedorServices {
    // Cria a compra + itens em uma chamada. Se a inserção dos itens falhar,
    // a compra é removida pra não deixar lixo no banco.
    static async createComItens(data) {
        try {
            const { error, value } = compraComItensSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const fornecedor = await Fornecedor.findById(value.fornecedorId);
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");

            const { itens, ...compraData } = value;
            const compra = await new CompraFornecedor(compraData).save();

            try {
                const itensCriados = await ItemCompra.insertMany(
                    itens.map((it) => ({ ...it, compraId: compra._id }))
                );
                return { compra, itens: itensCriados };
            } catch (err) {
                await CompraFornecedor.findByIdAndDelete(compra._id).catch(
                    () => {}
                );
                throw new AppError(
                    "Erro ao salvar itens da compra: " + err.message
                );
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao registrar compra: " + error.message);
        }
    }

    static async update(id, data) {
        try {
            const { error, value } = updateCompraFornecedorSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const compra = await CompraFornecedor.findByIdAndUpdate(id, value, {
                new: true,
                runValidators: true,
            });
            if (!compra) throw new NotFoundError("Compra não encontrada");
            return compra;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar compra: " + error.message);
        }
    }

    static async delete(id) {
        try {
            const compra = await CompraFornecedor.findByIdAndDelete(id);
            if (!compra) throw new NotFoundError("Compra não encontrada");

            const r = await ItemCompra.deleteMany({ compraId: id });
            return {
                message: "Compra removida com sucesso",
                itensRemovidos: r.deletedCount,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar compra: " + error.message);
        }
    }

    static async getById(id) {
        try {
            const compra = await CompraFornecedor.findById(id).populate(
                "fornecedorId",
                "nome telefone cidade"
            );
            if (!compra) throw new NotFoundError("Compra não encontrada");

            const itens = await ItemCompra.find({ compraId: id }).sort({
                criadoEm: 1,
            });
            return { compra, itens };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar compra: " + error.message);
        }
    }

    static async getByFornecedor(fornecedorId) {
        try {
            return await CompraFornecedor.find({ fornecedorId }).sort({
                dataCompra: -1,
            });
        } catch (error) {
            throw new AppError(
                "Erro ao buscar compras do fornecedor: " + error.message
            );
        }
    }

    static async getAll() {
        try {
            return await CompraFornecedor.find()
                .sort({ dataCompra: -1 })
                .populate("fornecedorId", "nome telefone cidade");
        } catch (error) {
            throw new AppError("Erro ao buscar compras: " + error.message);
        }
    }

    // ---------- Itens ----------

    static async addItem(compraId, data) {
        try {
            const { error, value } = itemCompraJoi.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const compra = await CompraFornecedor.findById(compraId);
            if (!compra) throw new NotFoundError("Compra não encontrada");

            return await new ItemCompra({ ...value, compraId }).save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao adicionar item: " + error.message);
        }
    }

    static async updateItem(itemId, data) {
        try {
            const { error, value } = updateItemCompraSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const item = await ItemCompra.findByIdAndUpdate(itemId, value, {
                new: true,
                runValidators: true,
            });
            if (!item) throw new NotFoundError("Item não encontrado");
            return item;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar item: " + error.message);
        }
    }

    static async deleteItem(itemId) {
        try {
            const item = await ItemCompra.findByIdAndDelete(itemId);
            if (!item) throw new NotFoundError("Item não encontrado");
            return { message: "Item removido com sucesso" };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar item: " + error.message);
        }
    }

    static async getItensByCompra(compraId) {
        try {
            return await ItemCompra.find({ compraId }).sort({ criadoEm: 1 });
        } catch (error) {
            throw new AppError("Erro ao buscar itens: " + error.message);
        }
    }

    // ============ VIEW: vw_compras_por_mes ============
    // Agrupa por (mês-ano, fornecedor) e calcula totais financeiros.
    // Filtro opcional por fornecedorId.
    static async comprasPorMes({ fornecedorId } = {}) {
        try {
            const pipeline = [];

            if (fornecedorId) {
                pipeline.push({
                    $match: {
                        fornecedorId: new mongoose.Types.ObjectId(fornecedorId),
                    },
                });
            }

            pipeline.push(
                {
                    $lookup: {
                        from: "fornecedores",
                        localField: "fornecedorId",
                        foreignField: "_id",
                        as: "_fornecedor",
                    },
                },
                { $unwind: "$_fornecedor" },
                {
                    $lookup: {
                        from: "itensCompra",
                        localField: "_id",
                        foreignField: "compraId",
                        as: "_itens",
                    },
                },
                {
                    $addFields: {
                        _mesAno: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$dataCompra",
                            },
                        },
                        _totalPecas: { $sum: "$_itens.quantidade" },
                        _faturamento: {
                            $sum: {
                                $map: {
                                    input: "$_itens",
                                    as: "it",
                                    in: {
                                        $multiply: [
                                            "$$it.precoVenda",
                                            "$$it.quantidade",
                                        ],
                                    },
                                },
                            },
                        },
                        _custoTotal: {
                            $sum: {
                                $map: {
                                    input: "$_itens",
                                    as: "it",
                                    in: {
                                        $multiply: [
                                            {
                                                $add: [
                                                    "$$it.custoUnitario",
                                                    "$$it.custoEmbalagem",
                                                ],
                                            },
                                            "$$it.quantidade",
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            mesAno: "$_mesAno",
                            fornecedorId: "$fornecedorId",
                            fornecedorNome: "$_fornecedor.nome",
                        },
                        totalInvestido: { $sum: "$valorTotalPago" },
                        totalPecas: { $sum: "$_totalPecas" },
                        faturamentoPotencial: { $sum: "$_faturamento" },
                        lucroPotencial: {
                            $sum: { $subtract: ["$_faturamento", "$_custoTotal"] },
                        },
                        custoSomaTotal: { $sum: "$_custoTotal" },
                    },
                },
                { $sort: { "_id.mesAno": -1, "_id.fornecedorNome": 1 } }
            );

            const rows = await CompraFornecedor.aggregate(pipeline);

            return rows.map((r) => ({
                mesAno: r._id.mesAno,
                fornecedorId: r._id.fornecedorId,
                fornecedorNome: r._id.fornecedorNome,
                totalInvestido: round2(r.totalInvestido || 0),
                totalPecas: r.totalPecas || 0,
                faturamentoPotencial: round2(r.faturamentoPotencial || 0),
                lucroPotencial: round2(r.lucroPotencial || 0),
                roiMedio: computeRoi(r.lucroPotencial, r.custoSomaTotal),
            }));
        } catch (error) {
            throw new AppError(
                "Erro ao agregar compras por mês: " + error.message
            );
        }
    }

    // ============ VIEW: vw_estoque_por_categoria ============
    // Soma itens por categoria, com totais financeiros.
    static async estoquePorCategoria() {
        try {
            const rows = await ItemCompra.aggregate([
                {
                    $addFields: {
                        _custoTotalUnit: {
                            $add: ["$custoUnitario", "$custoEmbalagem"],
                        },
                        _faturamento: {
                            $multiply: ["$precoVenda", "$quantidade"],
                        },
                    },
                },
                {
                    $addFields: {
                        _custoTotal: {
                            $multiply: ["$_custoTotalUnit", "$quantidade"],
                        },
                    },
                },
                {
                    $addFields: {
                        _lucro: {
                            $subtract: ["$_faturamento", "$_custoTotal"],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$categoria",
                        totalUnidades: { $sum: "$quantidade" },
                        custoTotal: { $sum: "$_custoTotal" },
                        faturamentoPotencial: { $sum: "$_faturamento" },
                        lucroPotencial: { $sum: "$_lucro" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            return rows.map((r) => ({
                categoria: r._id,
                totalUnidades: r.totalUnidades || 0,
                custoTotal: round2(r.custoTotal || 0),
                faturamentoPotencial: round2(r.faturamentoPotencial || 0),
                lucroPotencial: round2(r.lucroPotencial || 0),
                roiMedio: computeRoi(r.lucroPotencial, r.custoTotal),
            }));
        } catch (error) {
            throw new AppError(
                "Erro ao agregar estoque por categoria: " + error.message
            );
        }
    }
}

export default CompraFornecedorServices;
