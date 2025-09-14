import { useEffect, useState } from "react";
import api from "../api/axios";

export function useSearchProducts(query) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delay = setTimeout(() => {
            setLoading(true);
            api.get(`/products?name=${encodeURIComponent(query)}`)
                .then(res => setResults(res.data.data))
                .finally(() => setLoading(false));
        }, 400); // debounce 400ms

        return () => clearTimeout(delay);
    }, [query]);

    return { results, loading };
}
