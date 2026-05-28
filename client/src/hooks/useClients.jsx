import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useClients(search = "") {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        setLoading(true);
        const params = search ? { search } : {};
        api.get("/clients", { params })
            .then((res) => setClients(res.data.data || []))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.message || "Erro ao carregar clientes");
            })
            .finally(() => setLoading(false));
    }, [search]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { clients, loading, error, refetch, setClients };
}

export function useClient(id) {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(() => {
        if (!id) return;
        setLoading(true);
        api.get(`/clients/${id}`)
            .then((res) => setClient(res.data.data))
            .catch((err) => {
                console.log(err);
                setError(err.response?.data?.message || "Erro ao carregar cliente");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { client, loading, error, refetch };
}
