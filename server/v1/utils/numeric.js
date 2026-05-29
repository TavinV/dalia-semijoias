// Helpers numéricos blindados contra NaN/Infinity.
// Todas as VIEWs e virtuals devem usar estes para garantir saídas seguras.

export const round2 = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round((n + Number.EPSILON) * 100) / 100;
};

export const safeDivide = (num, denom) => {
    const n = Number(num);
    const d = Number(denom);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return 0;
    return n / d;
};

// ROI = (lucro / custo) * 100, com guardas.
export const computeRoi = (lucro, custo) => {
    const c = Number(custo);
    if (!Number.isFinite(c) || c <= 0) return 0;
    const l = Number(lucro);
    if (!Number.isFinite(l)) return 0;
    return round2((l / c) * 100);
};
