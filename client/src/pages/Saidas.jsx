import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiTag,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiTrendingDown,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { useAuth } from "../hooks/useAuth";
import {
  useSaidas,
  TIPO_SAIDA_KEYS,
  TIPO_SAIDA_LABEL,
} from "../hooks/useSaidas";
import CreateSaidaModal from "../components/modules/CreateSaidaModal";
import api from "../api/axios";

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDateBR = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const TIPO_COLOR = {
  transporte: "bg-blue-50 text-blue-700",
  fornecedor: "bg-[#967965]/10 text-[#7A5F4F]",
  alimentacao: "bg-orange-50 text-orange-700",
  contas: "bg-red-50 text-red-700",
  anuncios: "bg-purple-50 text-purple-700",
  outros: "bg-gray-100 text-gray-700",
};

const Saidas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tipo, setTipo] = useState("");
  const { saidas, loading, refetch } = useSaidas({ tipo: tipo || undefined });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  const totais = useMemo(() => {
    const out = { total: 0, porTipo: {} };
    for (const s of saidas) {
      const v = Number(s.valor) || 0;
      out.total += v;
      out.porTipo[s.tipo] = (out.porTipo[s.tipo] || 0) + v;
    }
    return out;
  }, [saidas]);

  const handleDelete = async (id) => {
    if (!confirm("Apagar essa saída?")) return;
    try {
      await api.delete(`/saidas/${id}`);
      refetch();
    } catch (err) {
      alert(err?.response?.data?.message || "Erro ao apagar saída");
    }
  };

  if (authLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-fancy">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-fancy text-3xl sm:text-4xl text-gray-900 mb-2">
              Saídas
            </h1>
            <p className="text-gray-500 font-light">
              Registre todas as saídas — transporte, fornecedor, alimentação, contas, anúncios e outros
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg shadow-md transition-colors whitespace-nowrap"
          >
            <FiPlus size={18} /> Nova Saída
          </motion.button>
        </div>

        {/* Total + breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Total de saídas {tipo && `(${TIPO_SAIDA_LABEL[tipo]})`}
              </p>
              <p className="mt-2 font-fancy text-3xl sm:text-4xl text-red-600">
                {formatBRL(totais.total)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <FiTrendingDown className="text-red-600" size={22} />
            </div>
          </div>
          {!tipo && Object.keys(totais.porTipo).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-gray-100">
              {TIPO_SAIDA_KEYS.map((k) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    {TIPO_SAIDA_LABEL[k]}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formatBRL(totais.porTipo[k] || 0)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filtro por tipo */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setTipo("")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tipo === "" ? "bg-[#967965] text-white shadow" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Todos
          </button>
          {TIPO_SAIDA_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setTipo(k)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                tipo === k ? "bg-[#967965] text-white shadow" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {TIPO_SAIDA_LABEL[k]}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando saídas...</p>
          </div>
        ) : saidas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTag size={32} className="text-gray-400" />
            </div>
            <h3 className="font-fancy text-lg text-gray-900 mb-2">
              Nenhuma saída registrada
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Comece registrando sua primeira saída.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg transition-colors"
            >
              <FiPlus size={16} /> Registrar saída
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {saidas.map((s) => (
                <motion.li
                  key={s._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                          TIPO_COLOR[s.tipo] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {TIPO_SAIDA_LABEL[s.tipo] || s.tipo}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiCalendar size={11} /> {formatDateBR(s.data)}
                      </span>
                    </div>
                    {s.observacao ? (
                      <p className="text-sm text-gray-700">{s.observacao}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Sem observação</p>
                    )}
                    {s.fornecedorId?.nome && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Fornecedor: {s.fornecedorId.nome}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-fancy text-xl text-red-600">
                      {formatBRL(s.valor)}
                    </p>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="mt-1 p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Apagar saída"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              {saidas.length} {saidas.length === 1 ? "saída" : "saídas"}
            </div>
          </div>
        )}
      </main>

      <CreateSaidaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Saidas;
