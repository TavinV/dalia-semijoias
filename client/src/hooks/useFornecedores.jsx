import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useFornecedores({ search = "", incluirInativos = true } = {}) {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (!incluirInativos) params.incluirInativos = false;
    api
      .get("/fornecedores", { params })
      .then((res) => setFornecedores(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar fornecedores");
      })
      .finally(() => setLoading(false));
  }, [search, incluirInativos]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { fornecedores, loading, error, refetch, setFornecedores };
}

export function useFornecedor(id) {
  const [fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/fornecedores/${id}`)
      .then((res) => setFornecedor(res.data.data))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar fornecedor");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { fornecedor, loading, error, refetch };
}

export function useResumoFornecedor(id) {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/fornecedores/${id}/resumo`)
      .then((res) => setResumo(res.data.data))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar resumo");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { resumo, loading, error, refetch };
}
