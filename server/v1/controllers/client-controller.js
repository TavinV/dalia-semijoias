import ClientServices from "../services/client-services.js";
import ApiResponse from "../utils/api-response.js";

import {
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

const clientController = {
    async createClient(req, res) {
        try {
            const client = await ClientServices.createClient(req.body);
            return ApiResponse.CREATED(res, client, "Cliente cadastrado com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof ConflictError) {
                return ApiResponse.CONFLICT(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao criar cliente: " + error.message);
        }
    },

    async updateClient(req, res) {
        try {
            const { id } = req.params;
            const client = await ClientServices.updateClient(id, req.body);
            return ApiResponse.OK(res, client, "Cliente atualizado com sucesso");
        } catch (error) {
            if (error instanceof ValidationError) {
                return ApiResponse.BADREQUEST(res, error.message);
            }
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao atualizar cliente: " + error.message);
        }
    },

    async deleteClient(req, res) {
        try {
            const { id } = req.params;
            await ClientServices.deleteClient(id);
            return ApiResponse.OK(res, null, "Cliente removido com sucesso");
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao deletar cliente: " + error.message);
        }
    },

    async getAllClients(req, res) {
        try {
            const { search } = req.query;
            const clients = await ClientServices.getAllClients(search);
            return ApiResponse.OK(res, clients);
        } catch (error) {
            return ApiResponse.ERROR(res, "Erro ao buscar clientes: " + error.message);
        }
    },

    async getClientById(req, res) {
        try {
            const { id } = req.params;
            const client = await ClientServices.getClientById(id);
            return ApiResponse.OK(res, client);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return ApiResponse.NOTFOUND(res, error.message);
            }
            return ApiResponse.ERROR(res, "Erro ao buscar cliente: " + error.message);
        }
    },
};

export default clientController;
