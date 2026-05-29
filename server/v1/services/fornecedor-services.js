import mongoose from "mongoose";
import Fornecedor from "../models/fornecedor-model.js";
import CompraFornecedor from "../models/compra-fornecedor-model.js";
import ItemCompra from "../models/item-compra-model.js";
import fornecedorSchema, {
    updateFornecedorSchema,
} from "../validation/fornecedor-schema.js";
import { round2, computeRoi } from "../utils/numeric.js";

import {
    AppError,
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class FornecedorServices {
    static async create(data) {
        try {
            const { error, value } = fornecedorSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const existing = await Fornecedor.findOne({
                nome: { $regex: new RegExp(`^${value.nome}$`, "i") },
            });
            if (existing) {
                throw new ConflictError(
                    "Já existe um fornecedor cadastrado com esse nome"
                );
            }

            const fornecedor = new Fornecedor(value);
            return await fornecedor.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error.code === 11000) {
                throw new ConflictError(
                    "Já existe um fornecedor cadastrado com esse nome"
                );
            }
            throw new AppError("Erro ao criar fornecedor: " + error.message);
        }
    }

    static async update(id, data) {
        try {
            const { error, value } = updateFornecedorSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            if (value.nome) {
                const existing = await Fornecedor.findOne({
                    _id: { $ne: id },
                    nome: { $regex: new RegExp(`^${value.nome}$`, "i") },
                });
                if (existing) {
                    throw new ConflictError(
                        "Já existe outro fornecedor com esse nome"
                    );
                }
            }

            const fornecedor = await Fornecedor.findByIdAndUpdate(id, value, {
                new: true,
                runValidators: true,
            });
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");
            return fornecedor;
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error.code === 11000) {
                throw new ConflictError(
                    "Já existe outro fornecedor com esse nome"
                );
            }
            throw new AppError("Erro ao atualizar fornecedor: " + error.message);
        }
    }

    // Hard delete com cascade: remove fornecedor → compras → itens
    static async delete(id) {
        try {
            const fornecedor = await Fornecedor.findByIdAndDelete(id);
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");

            const compras = await CompraFornecedor.find(
                { fornecedorId: id },
                "_id"
            );
            const compraIds = compras.map((c) => c._id);

            if (compraIds.length > 0) {
                await ItemCompra.deleteMany({ compraId: { $in: compraIds } });
                await CompraFornecedor.deleteMany({ fornecedorId: id });
            }

            return {
                message: "Fornecedor removido com sucesso",
                comprasRemovidas: compraIds.length,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar fornecedor: " + error.message);
        }
    }

    static async toggleAtivo(id) {
        try {
            const fornecedor = await Fornecedor.findById(id);
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");

            fornecedor.ativo = !fornecedor.ativo;
            await fornecedor.save();
            return fornecedor;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Erro ao alterar status do fornecedor: " + error.message
            );
        }
    }

    static async getAll({ search = "", incluirInativos = true } = {}) {
        try {
            const filter = {};
            if (!incluirInativos) filter.ativo = true;

            if (search) {
                const rx = new RegExp(search, "i");
                filter.$or = [
                    { nome: { $regex: rx } },
                    { cidade: { $regex: rx } },
                    { telefone: { $regex: rx } },
                ];
            }

            return await Fornecedor.find(filter).sort({ nome: 1 });
        } catch (error) {
            throw new AppError(
                "Erro ao buscar fornecedores: " + error.message
            );
        }
    }

    static async getById(id) {
        try {
            const fornecedor = await Fornecedor.findById(id);
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");
            return fornecedor;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar fornecedor: " + error.message);
        }
    }

    // ============ VIEW: vw_resumo_fornecedor ============
    // Agrupa todas as compras e itens de um fornecedor em métricas únicas.
    // roiMedio é ponderado pelo custo total (lucroSum / custoSum * 100),
    // que é o ROI agregado financeiramente correto.
    static async resumoPorFornecedor(id) {
        try {
            const fornecedor = await Fornecedor.findById(id);
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");

            const objectId = new mongoose.Types.ObjectId(id);

            const [comprasAgg, itensAgg] = await Promise.all([
                CompraFornecedor.aggregate([
                    { $match: { fornecedorId: objectId } },
                    {
                        $group: {
                            _id: "$fornecedorId",
                            totalCompras: { $sum: 1 },
                            totalInvestido: { $sum: "$valorTotalPago" },
                            ultimaCompra: { $max: "$dataCompra" },
                        },
                    },
                ]),
                ItemCompra.aggregate([
                    {
                        $lookup: {
                            from: CompraFornecedor.collection.name,
                            localField: "compraId",
                            foreignField: "_id",
                            as: "_compra",
                        },
                    },
                    { $unwind: "$_compra" },
                    { $match: { "_compra.fornecedorId": objectId } },
                    {
                        $addFields: {
                            _custoTotal: {
                                $multiply: [
                                    {
                                        $add: [
                                            "$custoUnitario",
                                            "$custoEmbalagem",
                                        ],
                                    },
                                    "$quantidade",
                                ],
                            },
                            _faturamento: {
                                $multiply: ["$precoVenda", "$quantidade"],
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
                            _id: null,
                            totalPecas: { $sum: "$quantidade" },
                            faturamentoPotencial: { $sum: "$_faturamento" },
                            lucroPotencial: { $sum: "$_lucro" },
                            custoSomaTotal: { $sum: "$_custoTotal" },
                        },
                    },
                ]),
            ]);

            const c = comprasAgg[0] || {};
            const i = itensAgg[0] || {};

            return {
                fornecedorId: id,
                fornecedorNome: fornecedor.nome,
                totalCompras: c.totalCompras || 0,
                totalInvestido: round2(c.totalInvestido || 0),
                totalPecas: i.totalPecas || 0,
                faturamentoPotencial: round2(i.faturamentoPotencial || 0),
                lucroPotencial: round2(i.lucroPotencial || 0),
                roiMedio: computeRoi(i.lucroPotencial, i.custoSomaTotal),
                ultimaCompra: c.ultimaCompra || null,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Erro ao gerar resumo do fornecedor: " + error.message
            );
        }
    }
}

export default FornecedorServices;
