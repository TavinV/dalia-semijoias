import Joi from "joi";

const saleItemSchema = Joi.object({
    productId: Joi.string().allow(null, ""),
    name: Joi.string().min(1).max(200).required().messages({
        "string.empty": "O nome do item é obrigatório",
        "any.required": "O nome do item é obrigatório",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "A quantidade deve ser um número",
        "number.min": "A quantidade mínima é 1",
        "any.required": "A quantidade é obrigatória",
    }),
    unitPrice: Joi.number().min(0).required().messages({
        "number.base": "O preço unitário deve ser um número",
        "number.min": "O preço unitário não pode ser negativo",
        "any.required": "O preço unitário é obrigatório",
    }),
});

const saleSchema = Joi.object({
    clientId: Joi.string().allow(null, "").optional(),
    items: Joi.array().items(saleItemSchema).min(1).required().messages({
        "array.min": "Adicione ao menos um item à venda",
        "any.required": "Itens são obrigatórios",
    }),
    total: Joi.number().min(0).required(),
    paid: Joi.boolean().default(false),
    saleDate: Joi.date().optional(),
    notes: Joi.string().allow("").max(500).optional(),
});

export const updateSaleSchema = Joi.object({
    items: Joi.array().items(saleItemSchema).min(1),
    total: Joi.number().min(0),
    paid: Joi.boolean(),
    saleDate: Joi.date(),
    notes: Joi.string().allow("").max(500),
}).min(1);

export default saleSchema;
