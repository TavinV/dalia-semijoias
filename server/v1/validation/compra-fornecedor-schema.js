import Joi from "joi";
import { CATEGORIAS_FORNECEDOR } from "../models/item-compra-model.js";

const itemCompraSchema = Joi.object({
    nomePeca: Joi.string().min(1).max(200).required().messages({
        "string.empty": "O nome da peça é obrigatório",
        "any.required": "O nome da peça é obrigatório",
    }),

    categoria: Joi.string()
        .valid(...CATEGORIAS_FORNECEDOR)
        .required()
        .messages({
            "any.only": `A categoria deve ser uma de: ${CATEGORIAS_FORNECEDOR.join(", ")}`,
            "any.required": "A categoria é obrigatória",
        }),

    quantidade: Joi.number().integer().min(1).required().messages({
        "number.base": "A quantidade deve ser um número",
        "number.integer": "A quantidade deve ser um número inteiro",
        "number.min": "A quantidade mínima é 1",
        "any.required": "A quantidade é obrigatória",
    }),

    custoUnitario: Joi.number().min(0).required().messages({
        "number.base": "O custo unitário deve ser um número",
        "number.min": "O custo unitário não pode ser negativo",
        "any.required": "O custo unitário é obrigatório",
    }),

    custoEmbalagem: Joi.number().min(0).default(2.5).messages({
        "number.base": "O custo da embalagem deve ser um número",
        "number.min": "O custo da embalagem não pode ser negativo",
    }),

    precoVenda: Joi.number().min(0).required().messages({
        "number.base": "O preço de venda deve ser um número",
        "number.min": "O preço de venda não pode ser negativo",
        "any.required": "O preço de venda é obrigatório",
    }),
});

// Compra "isolada" (sem itens) — para casos de edição da compra em si
const compraFornecedorSchema = Joi.object({
    fornecedorId: Joi.string().required().messages({
        "any.required": "O fornecedor é obrigatório",
        "string.empty": "O fornecedor é obrigatório",
    }),

    dataCompra: Joi.date().required().messages({
        "date.base": "A data da compra deve ser uma data válida",
        "any.required": "A data da compra é obrigatória",
    }),

    valorTotalPago: Joi.number().min(0).required().messages({
        "number.base": "O valor total pago deve ser um número",
        "number.min": "O valor total pago não pode ser negativo",
        "any.required": "O valor total pago é obrigatório",
    }),

    quantidadeTotalPecas: Joi.number().integer().min(0).required().messages({
        "number.base": "A quantidade total de peças deve ser um número",
        "number.integer": "A quantidade total deve ser inteira",
        "number.min": "A quantidade total não pode ser negativa",
        "any.required": "A quantidade total de peças é obrigatória",
    }),

    observacao: Joi.string().max(500).allow("").optional(),
});

// Compra COM itens (caso de uso comum: criar tudo de uma vez)
export const compraComItensSchema = compraFornecedorSchema.keys({
    itens: Joi.array().items(itemCompraSchema).min(1).required().messages({
        "array.min": "Adicione ao menos um item à compra",
        "any.required": "Itens são obrigatórios",
    }),
});

export const updateCompraFornecedorSchema = Joi.object({
    fornecedorId: Joi.string(),
    dataCompra: Joi.date(),
    valorTotalPago: Joi.number().min(0),
    quantidadeTotalPecas: Joi.number().integer().min(0),
    observacao: Joi.string().max(500).allow(""),
}).min(1);

export const itemCompraJoi = itemCompraSchema;

export const updateItemCompraSchema = Joi.object({
    nomePeca: Joi.string().min(1).max(200),
    categoria: Joi.string().valid(...CATEGORIAS_FORNECEDOR),
    quantidade: Joi.number().integer().min(1),
    custoUnitario: Joi.number().min(0),
    custoEmbalagem: Joi.number().min(0),
    precoVenda: Joi.number().min(0),
}).min(1);

export default compraFornecedorSchema;
