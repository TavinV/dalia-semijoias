import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

export function useSaidas({ tipo, dataInicio, dataFim } = {}) {
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    const params = {};
    if (tipo) params.tipo = tipo;
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    api
      .get("/saidas", { params })
      .then((res) => setSaidas(res.data.data || []))
      .catch((err) => {
        console.log(err);
        setError(err.response?.data?.message || "Erro ao carregar saídas");
      })
      .finally(() => setLoading(false));
  }, [tipo, dataInicio, dataFim]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { saidas, loading, error, refetch };
}

export const TIPO_SAIDA_LABEL = {
  transporte: "Transporte",
  fornecedor: "Fornecedor",
  alimentacao: "Alimentação",
  contas: "Contas",
  anuncios: "Anúncios",
  outros: "Outros",
};

export const TIPO_SAIDA_KEYS = Object.keys(TIPO_SAIDA_LABEL);
