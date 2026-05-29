import Client from "../models/client-model.js";
import Sale from "../models/sale-model.js";
import clientSchema, { updateClientSchema } from "../validation/client-schema.js";

import {
    AppError,
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../errors/errors.js";

class ClientServices {
    static async createClient(data) {
        try {
            const { error } = clientSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const existing = await Client.findOne({ phone: data.phone });
            if (existing) throw new ConflictError("Já existe um cliente com este telefone");

            const client = new Client(data);
            return await client.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error.code === 11000) {
                throw new ConflictError("Cliente já existe");
            }
            throw new AppError("Erro ao criar cliente: " + error.message);
        }
    }

    static async updateClient(id, data) {
        try {
            const { error } = updateClientSchema.validate(data);
            if (error) throw new ValidationError(error.details[0].message);

            const client = await Client.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });
            if (!client) throw new NotFoundError("Cliente não encontrado");
            return client;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao atualizar cliente: " + error.message);
        }
    }

    static async deleteClient(id) {
        try {
            const client = await Client.findByIdAndDelete(id);
            if (!client) throw new NotFoundError("Cliente não encontrado");
            await Sale.deleteMany({ clientId: id });
            return { message: "Cliente deletado com sucesso" };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao deletar cliente: " + error.message);
        }
    }

    static async getAllClients(search = "") {
        try {
            const filter = search
                ? {
                      $or: [
                          { name: { $regex: new RegExp(search, "i") } },
                          { phone: { $regex: new RegExp(search, "i") } },
                      ],
                  }
                : {};
            return await Client.find(filter).sort({ name: 1 });
        } catch (error) {
            throw new AppError("Erro ao buscar clientes: " + error.message);
        }
    }

    static async getClientById(id) {
        try {
            const client = await Client.findById(id);
            if (!client) throw new NotFoundError("Cliente não encontrado");
            return client;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Erro ao buscar cliente: " + error.message);
        }
    }
}

export default ClientServices;
