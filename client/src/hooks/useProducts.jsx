import { useEffect, useState } from "react";
import api from "../api/axios";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/products")
            .then((res) => {
                setProducts(res.data.data); // supondo que sua API retorna um array de produtos
            })
            .catch((err) => {
                console.log(err)
                setError(err.response?.data || "Erro ao carregar produtos");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { products, loading, error };
}
