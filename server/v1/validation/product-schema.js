import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "O nome do produto é obrigatório",
            "string.min": "O nome deve ter pelo menos {#limit} caracteres",
            "string.max": "O nome não pode passar de {#limit} caracteres",
            "any.required": "O nome do produto é obrigatório"
        }),

    dalia_id: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "O dalia_id é obrigatório",
            "any.required": "O dalia_id é obrigatório"
        }),

    description: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.empty": "A descrição é obrigatória",
            "string.min": "A descrição deve ter pelo menos {#limit} caracteres",
            "string.max": "A descrição não pode passar de {#limit} caracteres"
        }),

    price: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            "number.base": "O preço deve ser um número",
            "number.positive": "O preço deve ser maior que 0",
            "any.required": "O preço é obrigatório"
        }),

    imageUrl: Joi.string()
        .required()
        .messages({
            "string.empty": "A URL da imagem é obrigatória",
            "any.required": "A imagem é obrigatória"
        }),

    category: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "A categoria é obrigatória",
            "string.min": "A categoria deve ter pelo menos {#limit} caracteres",
            "string.max": "A categoria não pode passar de {#limit} caracteres"
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "O estoque deve ser um número inteiro",
            "number.min": "O estoque não pode ser negativo",
            "any.required": "O estoque é obrigatório"
        }),

    material: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "O material é obrigatório",
            "string.min": "O material deve ter pelo menos {#limit} caracteres",
            "string.max": "O material não pode passar de {#limit} caracteres"
        })
});

export default productSchema;
