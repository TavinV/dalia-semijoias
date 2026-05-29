import Joi from "joi";

// Aceita "(00) 0000-0000" ou "(00) 00000-0000". Permite vazio.
const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

const fornecedorSchema = Joi.object({
    nome: Joi.string().min(2).max(150).required().messages({
        "string.empty": "O nome do fornecedor é obrigatório",
        "string.min": "O nome deve ter pelo menos {#limit} caracteres",
        "string.max": "O nome não pode passar de {#limit} caracteres",
        "any.required": "O nome do fornecedor é obrigatório",
    }),

    telefone: Joi.string()
        .pattern(telefoneRegex)
        .allow("")
        .optional()
        .messages({
            "string.pattern.base":
                "Telefone deve estar no formato (00) 00000-0000",
        }),

    cidade: Joi.string().max(100).allow("").optional().messages({
        "string.max": "A cidade não pode passar de {#limit} caracteres",
    }),

    observacao: Joi.string().max(500).allow("").optional().messages({
        "string.max": "A observação não pode passar de {#limit} caracteres",
    }),

    ativo: Joi.boolean().optional(),
});

export const updateFornecedorSchema = Joi.object({
    nome: Joi.string().min(2).max(150),
    telefone: Joi.string().pattern(telefoneRegex).allow(""),
    cidade: Joi.string().max(100).allow(""),
    observacao: Joi.string().max(500).allow(""),
    ativo: Joi.boolean(),
}).min(1);

export default fornecedorSchema;
