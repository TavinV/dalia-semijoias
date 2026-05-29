import FornecedorServices from "../services/fornecedor-services.js";
import ApiResponse from "../utils/api-response.js";

import {
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

const fornecedorController = {
    async createFornecedor(req, res) {
        try {
            const fornecedor = await FornecedorServices.create(req.body);
            return ApiResponse.CREATED(
                res,
                fornecedor,
                "Fornecedor cadastrado com sucesso"
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof ConflictError) {
                return ApiResponse.CONFLICT(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao criar fornecedor: " + error.message
            );
        }
    },

    async updateFornecedor(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await FornecedorServices.update(id, req.body);
            return ApiResponse.OK(
                res,
                fornecedor,
                "Fornecedor atualizado com sucesso"
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof ConflictError) {
                return ApiResponse.CONFLICT(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao atualizar fornecedor: " + error.message
            );
        }
    },

    async deleteFornecedor(req, res) {
        try {
            const { id } = req.params;
            const result = await FornecedorServices.delete(id);
            return ApiResponse.OK(res, result, "Fornecedor removido com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao deletar fornecedor: " + error.message
            );
        }
    },

    async getAllFornecedores(req, res) {
        try {
            const { search, incluirInativos } = req.query;
            const fornecedores = await FornecedorServices.getAll({
                search: search || "",
                incluirInativos: incluirInativos !== "false",
            });
            return ApiResponse.OK(res, fornecedores);
        } catch (error) {
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar fornecedores: " + error.message
            );
        }
    },

    async getFornecedorById(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await FornecedorServices.getById(id);
            return ApiResponse.OK(res, fornecedor);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao buscar fornecedor: " + error.message
            );
        }
    },

    async toggleAtivo(req, res) {
        try {
            const { id } = req.params;
            const fornecedor = await FornecedorServices.toggleAtivo(id);
            return ApiResponse.OK(
                res,
                fornecedor,
                `Fornecedor ${fornecedor.ativo ? "ativado" : "desativado"} com sucesso`
            );
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao alterar status do fornecedor: " + error.message
            );
        }
    },

    async getResumoFornecedor(req, res) {
        try {
            const { id } = req.params;
            const resumo = await FornecedorServices.resumoPorFornecedor(id);
            return ApiResponse.OK(res, resumo);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(
                res,
                "Erro ao gerar resumo: " + error.message
            );
        }
    },
};

export default fornecedorController;
