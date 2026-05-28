import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiBriefcase,
  FiCalendar,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { useAuth } from "../hooks/useAuth";
import { useFornecedores } from "../hooks/useFornecedores";
import api from "../api/axios";
import CreateFornecedorModal from "../components/modules/CreateFornecedorModal";
import CreateCompraFornecedorModal from "../components/modules/CreateCompraFornecedorModal";

const formatBRL = (v) => {
  const n = Number(v) || 0;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatPct = (v) => {
  const n = Number(v) || 0;
  return `${n.toFixed(1).replace(".", ",")}%`;
};

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

// Hook auxiliar — carrega resumo de cada fornecedor em paralelo
const useResumosBatch = (fornecedores) => {
  const [resumos, setResumos] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fornecedores || fornecedores.length === 0) {
      setResumos({});
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      fornecedores.map((f) =>
        api
          .get(`/fornecedores/${f._id}/resumo`)
          .then((r) => [f._id, r.data.data])
          .catch(() => [f._id, null]),
      ),
    ).then((pairs) => {
      if (cancelled) return;
      setResumos(Object.fromEntries(pairs));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fornecedores]);

  return { resumos, loading };
};

const TopCard = ({ icon: Icon, label, value, valueClass = "text-gray-900" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </p>
        <p
          className={`mt-2 font-fancy text-2xl sm:text-3xl leading-tight break-words ${valueClass}`}
        >
          {value}
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-[#967965]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="text-[#967965]" size={20} />
      </div>
    </div>
  </motion.div>
);

const FornecedorCard = ({ fornecedor, resumo, onVerDetalhes, onNovaCompra }) => {
  const totalCompras = resumo?.totalCompras ?? 0;
  const totalInvestido = resumo?.totalInvestido ?? 0;
  const faturamento = resumo?.faturamentoPotencial ?? 0;
  // Lucro = faturamento - investido (fórmula da spec da página)
  const lucroPotencial = faturamento - totalInvestido;
  const roiMedio = totalInvestido > 0 ? (lucroPotencial / totalInvestido) * 100 : 0;
  const roiClass =
    roiMedio > 100
      ? "text-emerald-700"
      : roiMedio < 100
        ? "text-red-600"
        : "text-gray-700";
  const lucroClass =
    lucroPotencial >= 0 ? "text-emerald-700" : "text-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: fornecedor.ativo ? 1 : 0.55, y: 0 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5 sm:p-6">
        {/* Mobile + Desktop: header com nome */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-fancy text-xl sm:text-2xl text-gray-900 break-words">
                {fornecedor.nome}
              </h3>
              {!fornecedor.ativo && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  Inativo
                </span>
              )}
            </div>
            {(fornecedor.telefone || fornecedor.cidade) && (
              <p className="text-xs text-gray-500 mt-1">
                {[fornecedor.cidade, fornecedor.telefone]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>

        {/* Métricas — grid responsivo: mobile 2 col / desktop 6 col */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Compras
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {totalCompras}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Investido
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1 break-words">
              {formatBRL(totalInvestido)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Faturamento pot.
            </p>
            <p className="text-lg font-bold text-gray-900 mt-1 break-words">
              {formatBRL(faturamento)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Lucro pot.
            </p>
            <p
              className={`text-lg font-bold mt-1 break-words ${lucroClass}`}
            >
              {formatBRL(lucroPotencial)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              ROI médio
            </p>
            <p className={`text-lg font-bold mt-1 ${roiClass}`}>
              {formatPct(roiMedio)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Última compra
            </p>
            <p className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-1">
              <FiCalendar size={12} className="text-gray-400" />
              {formatDateBR(resumo?.ultimaCompra)}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            onClick={() => onVerDetalhes(fornecedor)}
            className="px-4 py-2 text-sm border border-[#967965] text-[#967965] hover:bg-[#967965] hover:text-white transition-colors rounded-lg"
          >
            Ver detalhes
          </button>
          <button
            onClick={() => onNovaCompra(fornecedor)}
            className="px-4 py-2 text-sm bg-[#967965] hover:bg-[#7A5F4F] text-white transition-colors rounded-lg flex items-center justify-center gap-1.5"
          >
            <FiPlus size={14} /> Nova compra
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Fornecedores = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { fornecedores, loading: lLoading, refetch } = useFornecedores();
  const { resumos, loading: rLoading } = useResumosBatch(fornecedores);

  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [novaCompraFor, setNovaCompraFor] = useState(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  const totais = useMemo(() => {
    let inv = 0;
    let fat = 0;
    for (const f of fornecedores) {
      const r = resumos[f._id];
      if (!r) continue;
      inv += Number(r.totalInvestido) || 0;
      fat += Number(r.faturamentoPotencial) || 0;
    }
    const lucro = fat - inv;
    const roi = inv > 0 ? (lucro / inv) * 100 : 0;
    return { totalInvestido: inv, faturamento: fat, lucro, roi };
  }, [fornecedores, resumos]);

  const ordenados = useMemo(() => {
    const arr = [...fornecedores];
    // 1) ativos antes de inativos
    // 2) dentro de cada grupo: maior investido primeiro
    arr.sort((a, b) => {
      if (a.ativo !== b.ativo) return a.ativo ? -1 : 1;
      const ia = resumos[a._id]?.totalInvestido || 0;
      const ib = resumos[b._id]?.totalInvestido || 0;
      return ib - ia;
    });
    return arr;
  }, [fornecedores, resumos]);

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

  const loading = lLoading || rLoading;
  const roiClass =
    totais.roi > 100
      ? "text-emerald-700"
      : totais.roi < 100
        ? "text-red-600"
        : "text-gray-900";
  const lucroClass = totais.lucro >= 0 ? "text-emerald-700" : "text-red-600";

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Título + botão sempre visível */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-fancy text-3xl sm:text-4xl text-gray-900 mb-2">
              Fornecedores
            </h1>
            <p className="text-gray-500 font-light">
              Acompanhe investimento, faturamento potencial e ROI por fornecedor
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalNovoOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg shadow-md transition-colors whitespace-nowrap"
          >
            <FiPlus size={18} /> Cadastrar Fornecedor
          </motion.button>
        </div>

        {/* 4 cards de resumo geral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <TopCard
            icon={FiDollarSign}
            label="Total investido"
            value={formatBRL(totais.totalInvestido)}
          />
          <TopCard
            icon={FiTrendingUp}
            label="Potencial de faturamento"
            value={formatBRL(totais.faturamento)}
          />
          <TopCard
            icon={FiBriefcase}
            label="Lucro potencial"
            value={formatBRL(totais.lucro)}
            valueClass={lucroClass}
          />
          <TopCard
            icon={FiTarget}
            label="ROI geral"
            value={formatPct(totais.roi)}
            valueClass={roiClass}
          />
        </div>

        {/* Lista de fornecedores */}
        {loading && fornecedores.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando fornecedores...</p>
          </div>
        ) : fornecedores.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers size={32} className="text-gray-400" />
            </div>
            <h3 className="font-fancy text-lg text-gray-900 mb-2">
              Nenhum fornecedor cadastrado
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Comece cadastrando seu primeiro fornecedor.
            </p>
            <button
              onClick={() => setModalNovoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg transition-colors"
            >
              <FiPlus size={16} /> Cadastrar fornecedor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenados.map((f) => (
              <FornecedorCard
                key={f._id}
                fornecedor={f}
                resumo={resumos[f._id]}
                onVerDetalhes={(fo) => navigate(`/admin/fornecedores/${fo._id}`)}
                onNovaCompra={(fo) => setNovaCompraFor(fo)}
              />
            ))}
            <p className="text-xs text-gray-400 text-right pt-2">
              {fornecedores.length}{" "}
              {fornecedores.length === 1 ? "fornecedor" : "fornecedores"}
            </p>
          </div>
        )}
      </main>

      <CreateFornecedorModal
        isOpen={modalNovoOpen}
        onClose={() => setModalNovoOpen(false)}
        onSuccess={refetch}
      />
      <CreateCompraFornecedorModal
        fornecedorId={novaCompraFor?._id}
        fornecedorNome={novaCompraFor?.nome}
        isOpen={!!novaCompraFor}
        onClose={() => setNovaCompraFor(null)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Fornecedores;
