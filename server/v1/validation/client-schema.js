import Joi from "joi";

const clientSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "O nome do cliente é obrigatório",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres",
            "string.max": "O nome não pode passar de {#limit} caracteres",
            "any.required": "O nome do cliente é obrigatório",
        }),

    phone: Joi.string()
        .min(8)
        .max(20)
        .required()
        .messages({
            "string.empty": "O telefone é obrigatório",
            "string.min": "O telefone deve ter pelo menos {#limit} caracteres",
            "string.max": "O telefone não pode passar de {#limit} caracteres",
            "any.required": "O telefone é obrigatório",
        }),
});

export const updateClientSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().min(8).max(20),
}).min(1);

export default clientSchema;
