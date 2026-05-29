import Saida from "../models/saida-model.js";
import saidaSchema, { updateSaidaSchema } from "../validation/saida-schema.js";

import {
    AppError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class SaidaServices {
    static async create(data) {
        try {
            const { error, value } = saidaSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);
            const clean = { ...value };
            if (!clean.fornecedorId) clean.fornecedorId = null;
            return await new Saida(clean).save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao criar saída: " + error.message);
        }
    }

    static async update(id, data) {
        try {
            const { error, value } = updateSaidaSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);
            if (value.fornecedorId === "") value.fornecedorId = null;
            const saida = await Saida.findByIdAndUpdate(id, value, {
                new: true,
                runValidators: true,
            });
            if (!saida) throw new NotFoundError("Saída não encontrada");
            return saida;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar saída: " + error.message);
        }
    }

    static async delete(id) {
        try {
            const saida = await Saida.findByIdAndDelete(id);
            if (!saida) throw new NotFoundError("Saída não encontrada");
            return { message: "Saída removida com sucesso" };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar saída: " + error.message);
        }
    }

    static async getAll({ tipo, dataInicio, dataFim } = {}) {
        try {
            const filter = {};
            if (tipo) filter.tipo = tipo;
            if (dataInicio || dataFim) {
                filter.data = {};
                if (dataInicio) filter.data.$gte = new Date(dataInicio);
                if (dataFim) filter.data.$lte = new Date(dataFim);
            }
            return await Saida.find(filter)
                .sort({ data: -1 })
                .populate("fornecedorId", "nome");
        } catch (error) {
            throw new AppError("Erro ao buscar saídas: " + error.message);
        }
    }

    static async getById(id) {
        try {
            const saida = await Saida.findById(id).populate(
                "fornecedorId",
                "nome"
            );
            if (!saida) throw new NotFoundError("Saída não encontrada");
            return saida;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar saída: " + error.message);
        }
    }
}

export default SaidaServices;
