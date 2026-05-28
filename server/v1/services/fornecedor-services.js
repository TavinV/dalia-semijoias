import Fornecedor from "../models/fornecedor-model.js";
import CompraFornecedor from "../models/compra-fornecedor-model.js";
import ItemCompra from "../models/item-compra-model.js";
import fornecedorSchema, {
    updateFornecedorSchema,
} from "../validation/fornecedor-schema.js";

import {
    AppError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class FornecedorServices {
    static async create(data) {
        try {
            const { error, value } = fornecedorSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const fornecedor = new Fornecedor(value);
            return await fornecedor.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar fornecedor: " + error.message);
        }
    }

    static async update(id, data) {
        try {
            const { error, value } = updateFornecedorSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const fornecedor = await Fornecedor.findByIdAndUpdate(id, value, {
                new: true,
                runValidators: true,
            });
            if (!fornecedor) throw new NotFoundError("Fornecedor não encontrado");
            return fornecedor;
        } catch (error) {
            if (error instanceof AppError) throw error;
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
}

export default FornecedorServices;
