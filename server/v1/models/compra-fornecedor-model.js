import mongoose from "mongoose";

const compraFornecedorSchema = new mongoose.Schema(
    {
        fornecedorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fornecedor",
            required: true,
        },
        dataCompra: { type: Date, required: true },
        valorTotalPago: { type: Number, required: true, min: 0 },
        quantidadeTotalPecas: { type: Number, required: true, min: 0 },
        observacao: { type: String, trim: true, default: "" },
    },
    {
        timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
    }
);

compraFornecedorSchema.index({ fornecedorId: 1, dataCompra: -1 });
compraFornecedorSchema.index({ dataCompra: -1 });

compraFornecedorSchema.set("toJSON", { virtuals: true });
compraFornecedorSchema.set("toObject", { virtuals: true });

const CompraFornecedor = mongoose.model(
    "CompraFornecedor",
    compraFornecedorSchema,
    "comprasFornecedor"
);

export default CompraFornecedor;
