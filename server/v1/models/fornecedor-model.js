import mongoose from "mongoose";

const fornecedorSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true, unique: true },
        telefone: { type: String, trim: true, default: "" },
        cidade: { type: String, trim: true, default: "" },
        observacao: { type: String, trim: true, default: "" },
        ativo: { type: Boolean, default: true },
    },
    {
        timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
    }
);

fornecedorSchema.index({ ativo: 1 });

fornecedorSchema.set("toJSON", { virtuals: true });
fornecedorSchema.set("toObject", { virtuals: true });

const Fornecedor = mongoose.model("Fornecedor", fornecedorSchema);

export default Fornecedor;
