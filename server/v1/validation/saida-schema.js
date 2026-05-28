import Joi from "joi";
import { TIPOS_SAIDA } from "../models/saida-model.js";

const saidaSchema = Joi.object({
    tipo: Joi.string()
        .valid(...TIPOS_SAIDA)
        .required()
        .messages({
            "any.only": `Tipo deve ser um de: ${TIPOS_SAIDA.join(", ")}`,
            "any.required": "O tipo é obrigatório",
        }),
    valor: Joi.number().min(0).required().messages({
        "number.base": "O valor deve ser um número",
        "number.min": "O valor não pode ser negativo",
        "any.required": "O valor é obrigatório",
    }),
    data: Joi.date().optional(),
    observacao: Joi.string().max(500).allow("").optional(),
    fornecedorId: Joi.string().allow(null, "").optional(),
});

export const updateSaidaSchema = Joi.object({
    tipo: Joi.string().valid(...TIPOS_SAIDA),
    valor: Joi.number().min(0),
    data: Joi.date(),
    observacao: Joi.string().max(500).allow(""),
    fornecedorId: Joi.string().allow(null, ""),
}).min(1);

export default saidaSchema;
