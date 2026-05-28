import mongoose from "mongoose";

export const TIPOS_SAIDA = [
    "transporte",
    "fornecedor",
    "alimentacao",
    "contas",
    "anuncios",
    "outros",
];

const saidaSchema = new mongoose.Schema(
    {
        tipo: {
            type: String,
            required: true,
            enum: TIPOS_SAIDA,
        },
        valor: { type: Number, required: true, min: 0 },
        data: { type: Date, required: true, default: Date.now },
        observacao: { type: String, trim: true, default: "" },
        fornecedorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fornecedor",
            default: null,
        },
    },
    {
        timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
    }
);

saidaSchema.index({ data: -1 });
saidaSchema.index({ tipo: 1, data: -1 });

const Saida = mongoose.model("Saida", saidaSchema, "saidas");

export default Saida;
