// Matching de busca: multi-palavra, AND, com sinônimos e sem acentos
// Ex.: "brinco ouro" casa com produto category=brincos + material="Ouro 18k"
// Ex.: "anel prateado feminino" casa com anéis em prata femininos
// Cada termo precisa achar match em algum dos campos do produto.

const SYNONYMS = {
    ouro: ["ouro", "dourado", "dourada", "gold"],
    dourado: ["ouro", "dourado", "dourada"],
    dourada: ["ouro", "dourado", "dourada"],
    prata: ["prata", "prateado", "prateada", "silver"],
    prateado: ["prata", "prateado", "prateada"],
    prateada: ["prata", "prateado", "prateada"],
    // singulares ↔ plurais comuns de categoria
    brinco: ["brinco", "brincos"],
    brincos: ["brinco", "brincos"],
    anel: ["anel", "aneis"],
    aneis: ["anel", "aneis"],
    colar: ["colar", "colares"],
    colares: ["colar", "colares"],
    pulseira: ["pulseira", "pulseiras"],
    pulseiras: ["pulseira", "pulseiras"],
    bracelete: ["bracelete", "braceletes"],
    braceletes: ["bracelete", "braceletes"],
    corrente: ["corrente", "correntes", "correntaria"],
    correntes: ["corrente", "correntes", "correntaria"],
    piercing: ["piercing", "piercings"],
    piercings: ["piercing", "piercings"],
    tornozeleira: ["tornozeleira", "tornozeleiras"],
    tornozeleiras: ["tornozeleira", "tornozeleiras"],
    choker: ["choker", "chokers"],
    chokers: ["choker", "chokers"],
    bodychain: ["bodychain", "body", "chain", "chains"],
    lenco: ["lenco", "lencos"],
    lencos: ["lenco", "lencos"],
};

export const normalize = (s) =>
    (s || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();

export const matchesQuery = (product, query) => {
    if (!query) return true;
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return true;

    const haystack = [
        product.name,
        product.description,
        product.category,
        product.material,
        product.gender,
    ]
        .map(normalize)
        .join(" ");

    return terms.every((term) => {
        const candidates = SYNONYMS[term] || [term];
        return candidates.some((c) => haystack.includes(c));
    });
};
