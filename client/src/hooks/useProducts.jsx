import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        setLoading(true);
        api.get("/products")
            .then((res) => setProducts(res.data.data || []))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data || "Erro ao carregar produtos");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { products, loading, error, refetch };
}
