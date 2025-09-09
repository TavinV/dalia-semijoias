import Joi from "joi";

const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .messages({
            "string.base": "O nome deve ser um texto",
            "string.empty": "O nome não pode estar vazio",
            "string.min": "O nome deve ter no mínimo {#limit} caracteres",
            "string.max": "O nome deve ter no máximo {#limit} caracteres",
        }),

    description: Joi.string()
        .min(10)
        .max(1024)
        .messages({
            "string.base": "A descrição deve ser um texto",
            "string.empty": "A descrição não pode estar vazia",
            "string.min": "A descrição deve ter no mínimo {#limit} caracteres",
            "string.max": "A descrição deve ter no máximo {#limit} caracteres",
        }),

    price: Joi.number()
        .positive()
        .messages({
            "number.base": "O preço deve ser um número",
            "number.positive": "O preço deve ser maior que zero",
        }),

    category: Joi.string()
        .min(3)
        .max(255)
        .messages({
            "string.base": "A categoria deve ser um texto",
            "string.empty": "A categoria não pode estar vazia",
            "string.min": "A categoria deve ter no mínimo {#limit} caracteres",
            "string.max": "A categoria deve ter no máximo {#limit} caracteres",
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "O estoque deve ser um número",
            "number.integer": "O estoque deve ser um número inteiro",
            "number.min": "O estoque não pode ser negativo",
        }),

    material: Joi.string()
        .min(3)
        .max(255)
        .messages({
            "string.base": "O material deve ser um texto",
            "string.empty": "O material não pode estar vazio",
            "string.min": "O material deve ter no mínimo {#limit} caracteres",
            "string.max": "O material deve ter no máximo {#limit} caracteres",
        }),

    imageUrl: Joi.string().messages({
        "string.base": "A URL da imagem deve ser um texto válido",
    }),
})
    .min(1)
    .messages({
        "object.min": "É necessário fornecer pelo menos um campo para atualização",
    })
    .messages({
        "object.unknown": "O campo {{#label}} não é permitido"
    });

export default updateProductSchema;
