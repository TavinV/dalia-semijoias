import { useEffect, useState, useMemo } from "react";
import { useProducts } from "./useProducts";
import { matchesQuery } from "../utils/searchMatch";

// Busca multi-palavra do lado do cliente, com sinônimos
// (ex.: "brinco ouro" → brincos com material Ouro 18k)
export function useSearchProducts(query) {
    const { products, loading } = useProducts();
    const [debounced, setDebounced] = useState(query);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(query), 250);
        return () => clearTimeout(t);
    }, [query]);

    const results = useMemo(() => {
        if (!debounced || !products) return [];
        return products.filter((p) => matchesQuery(p, debounced));
    }, [debounced, products]);

    return { results, loading };
}
