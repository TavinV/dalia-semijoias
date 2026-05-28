import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useSalesByClient(clientId) {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        if (!clientId) return;
        setLoading(true);
        api.get(`/sales/client/${clientId}`)
            .then((res) => setSales(res.data.data || []))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.message || "Erro ao carregar vendas");
            })
            .finally(() => setLoading(false));
    }, [clientId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { sales, loading, error, refetch, setSales };
}

export function useAllSales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        setLoading(true);
        api.get("/sales")
            .then((res) => setSales(res.data.data || []))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.message || "Erro ao carregar vendas");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { sales, loading, error, refetch, setSales };
}

export function usePendencies() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        setLoading(true);
        api.get("/sales/unpaid")
            .then((res) => setSales(res.data.data || []))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.message || "Erro ao carregar pendências");
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { sales, loading, error, refetch, setSales };
}
