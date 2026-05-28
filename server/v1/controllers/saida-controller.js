import SaidaServices from "../services/saida-services.js";
import ApiResponse from "../utils/api-response.js";

import {
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

const saidaController = {
    async createSaida(req, res) {
        try {
            const saida = await SaidaServices.create(req.body);
            return ApiResponse.CREATED(res, saida, "Saída registrada com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao criar saída: " + error.message);
        }
    },

    async updateSaida(req, res) {
        try {
            const { id } = req.params;
            const saida = await SaidaServices.update(id, req.body);
            return ApiResponse.OK(res, saida, "Saída atualizada com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao atualizar saída: " + error.message);
        }
    },

    async deleteSaida(req, res) {
        try {
            const { id } = req.params;
            await SaidaServices.delete(id);
            return ApiResponse.OK(res, null, "Saída removida com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao deletar saída: " + error.message);
        }
    },

    async getAllSaidas(req, res) {
        try {
            const { tipo, dataInicio, dataFim } = req.query;
            const saidas = await SaidaServices.getAll({ tipo, dataInicio, dataFim });
            return ApiResponse.OK(res, saidas);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar saídas: " + error.message);
        }
    },

    async getSaidaById(req, res) {
        try {
            const { id } = req.params;
            const saida = await SaidaServices.getById(id);
            return ApiResponse.OK(res, saida);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao buscar saída: " + error.message);
        }
    },
};

export default saidaController;
