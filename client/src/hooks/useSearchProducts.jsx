import { useEffect, useState, useMemo } from "react";
import { useProducts } from "./useProducts";
import { matchesQuery, isUltimasUnidadesQuery } from "../utils/searchMatch";

// Busca multi-palavra do lado do cliente, com sinônimos
// (ex.: "brinco ouro" → brincos com material Ouro 18k)
// Também reconhece "últimas unidades" → peças com estoque exatamente 1
export function useSearchProducts(query) {
    const { products, loading } = useProducts();
    const [debounced, setDebounced] = useState(query);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(query), 250);
        return () => clearTimeout(t);
    }, [query]);

    const results = useMemo(() => {
        if (!debounced || !products) return [];
        if (isUltimasUnidadesQuery(debounced)) {
            return products.filter((p) => (Number(p.stock) || 0) === 1);
        }
        return products.filter((p) => matchesQuery(p, debounced));
    }, [debounced, products]);

    return { results, loading };
}
