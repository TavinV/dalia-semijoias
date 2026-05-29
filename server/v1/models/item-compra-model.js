import mongoose from "mongoose";
import { round2 } from "../utils/numeric.js";

export const CATEGORIAS_FORNECEDOR = [
    "anel",
    "bracelete",
    "choker",
    "correntaria",
    "brinco",
    "pulseira_f",
    "pulseira_m",
    "corrente",
];

const itemCompraSchema = new mongoose.Schema(
    {
        compraId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompraFornecedor",
            required: true,
        },
        nomePeca: { type: String, required: true, trim: true },
        categoria: {
            type: String,
            required: true,
            enum: CATEGORIAS_FORNECEDOR,
        },
        quantidade: { type: Number, required: true, min: 1 },
        custoUnitario: { type: Number, required: true, min: 0 },
        custoEmbalagem: { type: Number, required: true, min: 0, default: 2.5 },
        precoVenda: { type: Number, required: true, min: 0 },
    },
    {
        timestamps: { createdAt: "criadoEm", updatedAt: "atualizadoEm" },
    }
);

itemCompraSchema.index({ compraId: 1 });
itemCompraSchema.index({ categoria: 1 });

// Virtuals correspondem à VIEW "vw_itens_compra_calculados"
itemCompraSchema.virtual("custoTotalUnit").get(function () {
    return round2((this.custoUnitario || 0) + (this.custoEmbalagem || 0));
});

itemCompraSchema.virtual("lucroUnit").get(function () {
    const ctu = (this.custoUnitario || 0) + (this.custoEmbalagem || 0);
    return round2((this.precoVenda || 0) - ctu);
});

itemCompraSchema.virtual("roiUnit").get(function () {
    const ctu = (this.custoUnitario || 0) + (this.custoEmbalagem || 0);
    if (ctu <= 0) return 0;
    const lu = (this.precoVenda || 0) - ctu;
    return round2((lu / ctu) * 100);
});

itemCompraSchema.virtual("faturamentoPotencial").get(function () {
    return round2((this.precoVenda || 0) * (this.quantidade || 0));
});

itemCompraSchema.virtual("lucroPotencial").get(function () {
    const ctu = (this.custoUnitario || 0) + (this.custoEmbalagem || 0);
    const lu = (this.precoVenda || 0) - ctu;
    return round2(lu * (this.quantidade || 0));
});

itemCompraSchema.virtual("margem").get(function () {
    const pv = this.precoVenda || 0;
    if (pv <= 0) return 0;
    const ctu = (this.custoUnitario || 0) + (this.custoEmbalagem || 0);
    const lu = pv - ctu;
    return round2((lu / pv) * 100);
});

itemCompraSchema.set("toJSON", { virtuals: true });
itemCompraSchema.set("toObject", { virtuals: true });

const ItemCompra = mongoose.model(
    "ItemCompra",
    itemCompraSchema,
    "itensCompra"
);

export default ItemCompra;
