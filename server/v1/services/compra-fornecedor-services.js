import CompraFornecedor from "../models/compra-fornecedor-model.js";
import ItemCompra from "../models/item-compra-model.js";
import Fornecedor from "../models/fornecedor-model.js";
import {
    compraComItensSchema,
    updateCompraFornecedorSchema,
    itemCompraJoi,
    updateItemCompraSchema,
} from "../validation/compra-fornecedor-schema.js";

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
}

export default CompraFornecedorServices;
