import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useComprasPorFornecedor(fornecedorId) {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!fornecedorId) return;
    setLoading(true);
    api
      .get(`/compras-fornecedor/fornecedor/${fornecedorId}`)
      .then((res) => setCompras(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar compras");
      })
      .finally(() => setLoading(false));
  }, [fornecedorId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { compras, loading, error, refetch, setCompras };
}

export function useCompraDetalhe(compraId) {
  const [compra, setCompra] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!compraId) return;
    setLoading(true);
    api
      .get(`/compras-fornecedor/${compraId}`)
      .then((res) => {
        setCompra(res.data.data?.compra || null);
        setItens(res.data.data?.itens || []);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar compra");
      })
      .finally(() => setLoading(false));
  }, [compraId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { compra, itens, loading, error, refetch };
}

export function useComprasPorMes({ fornecedorId } = {}) {
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    const params = fornecedorId ? { fornecedorId } : {};
    api
      .get(`/compras-fornecedor/por-mes`, { params })
      .then((res) => setLinhas(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar relatório");
      })
      .finally(() => setLoading(false));
  }, [fornecedorId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { linhas, loading, error, refetch };
}

export function useEstoquePorCategoria() {
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    api
      .get(`/compras-fornecedor/estoque-por-categoria`)
      .then((res) => setLinhas(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar estoque");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { linhas, loading, error, refetch };
}
