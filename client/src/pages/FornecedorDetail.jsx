import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiPlus,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingBag,
  FiPackage,
  FiTarget,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { useAuth } from "../hooks/useAuth";
import { useFornecedor, useResumoFornecedor } from "../hooks/useFornecedores";
import {
  useComprasPorFornecedor,
  useComprasPorMes,
} from "../hooks/useComprasFornecedor";
import EditFornecedorModal from "../components/modules/EditFornecedorModal";
import CreateCompraFornecedorModal, {
  CATEGORIA_LABEL,
} from "../components/modules/CreateCompraFornecedorModal";
import api from "../api/axios";

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatPct = (v) =>
  `${(Number(v) || 0).toFixed(1).replace(".", ",")}%`;

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

const StatCard = ({ icon: Icon, label, value, valueClass = "text-gray-900" }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#967965]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="text-[#967965]" size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </p>
        <p
          className={`mt-1 font-fancy text-xl sm:text-2xl leading-tight break-words ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);

const CompraRow = ({ compra }) => {
  const [open, setOpen] = useState(false);
  const [itens, setItens] = useState(null);
  const [loadingItens, setLoadingItens] = useState(false);

  const toggle = async () => {
    if (!open && itens === null) {
      setLoadingItens(true);
      try {
        const res = await api.get(`/compras-fornecedor/${compra._id}/itens`);
        setItens(res.data.data || []);
      } catch (err) {
        console.log(err);
        setItens([]);
      } finally {
        setLoadingItens(false);
      }
    }
    setOpen((o) => !o);
  };

  // Calc tier ROI (verde >=100%, amarelo 50-99%, vermelho <50%)
  const fat = Number(compra._faturamento || 0);
  const inv = Number(compra.valorTotalPago || 0);
  const lucro = fat - inv;
  const roi = inv > 0 ? (lucro / inv) * 100 : 0;
  const roiClass =
    roi >= 100
      ? "text-emerald-700"
      : roi >= 50
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar size={14} className="text-gray-400" />
            {formatDateBR(compra.dataCompra)}
          </div>
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1 text-xs text-[#967965] hover:text-[#7A5F4F] font-medium"
          >
            {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            {open ? "Ocultar itens" : "Ver itens"}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Peças
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {compra.quantidadeTotalPecas || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Valor pago
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {formatBRL(inv)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Fat. potencial
            </p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {formatBRL(fat)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Lucro pot.
            </p>
            <p
              className={`text-base font-bold mt-0.5 ${lucro >= 0 ? "text-emerald-700" : "text-red-600"}`}
            >
              {formatBRL(lucro)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              ROI
            </p>
            <p className={`text-base font-bold mt-0.5 ${roiClass}`}>
              {formatPct(roi)}
            </p>
          </div>
        </div>
        {compra.observacao && (
          <p className="text-xs text-gray-500 italic mt-3">
            "{compra.observacao}"
          </p>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 sm:p-5">
              {loadingItens ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  Carregando itens...
                </div>
              ) : !itens || itens.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhum item nesta compra.
                </p>
              ) : (
                <div className="space-y-2">
                  {itens.map((it) => (
                    <div
                      key={it._id}
                      className="bg-white rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {it.nomePeca}
                          </p>
                          <p className="text-xs text-gray-500">
                            {CATEGORIA_LABEL[it.categoria] || it.categoria} ·{" "}
                            {it.quantidade}x
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#967965]">
                          {formatBRL(it.precoVenda)}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px]">
                        <div>
                          <p className="text-gray-400">Custo</p>
                          <p className="font-medium text-gray-700">
                            {formatBRL(it.custoUnitario)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Embalagem</p>
                          <p className="font-medium text-gray-700">
                            {formatBRL(it.custoEmbalagem)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total/un</p>
                          <p className="font-medium text-gray-700">
                            {formatBRL(it.custoTotalUnit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Lucro/un</p>
                          <p
                            className={`font-medium ${(it.lucroUnit || 0) >= 0 ? "text-emerald-700" : "text-red-600"}`}
                          >
                            {formatBRL(it.lucroUnit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">ROI</p>
                          <p className="font-medium text-gray-700">
                            {formatPct(it.roiUnit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Margem</p>
                          <p className="font-medium text-gray-700">
                            {formatPct(it.margem)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MesRow = ({ atual, anterior }) => {
  const lucroAtual = atual.lucroPotencial || 0;
  const lucroAnt = anterior?.lucroPotencial;
  let variacao = null;
  if (lucroAnt != null) {
    variacao = lucroAtual - lucroAnt;
  }
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-fancy text-lg text-gray-900">{atual.mesAno}</p>
        {variacao != null && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              variacao > 0
                ? "bg-emerald-50 text-emerald-700"
                : variacao < 0
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {variacao > 0 ? (
              <FiTrendingUp size={11} />
            ) : variacao < 0 ? (
              <FiTrendingDown size={11} />
            ) : null}
            {variacao > 0 ? "+" : ""}
            {formatBRL(variacao)}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Investido
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {formatBRL(atual.totalInvestido)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Peças
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {atual.totalPecas || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Fat. potencial
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {formatBRL(atual.faturamentoPotencial)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Lucro
          </p>
          <p
            className={`text-base font-bold mt-0.5 ${lucroAtual >= 0 ? "text-emerald-700" : "text-red-600"}`}
          >
            {formatBRL(lucroAtual)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            ROI
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            {formatPct(atual.roiMedio)}
          </p>
        </div>
      </div>
    </div>
  );
};

const CategoriaCard = ({ row }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
    <p className="font-fancy text-lg text-gray-900 mb-3">
      {CATEGORIA_LABEL[row.categoria] || row.categoria}
    </p>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">
          Peças
        </p>
        <p className="text-lg font-bold text-gray-900 mt-0.5">
          {row.totalUnidades}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">
          Custo total
        </p>
        <p className="text-base font-bold text-gray-900 mt-0.5">
          {formatBRL(row.custoTotal)}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">
          Fat. potencial
        </p>
        <p className="text-base font-bold text-gray-900 mt-0.5">
          {formatBRL(row.faturamentoPotencial)}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">
          ROI
        </p>
        <p
          className={`text-base font-bold mt-0.5 ${
            row.roiMedio >= 100
              ? "text-emerald-700"
              : row.roiMedio >= 50
                ? "text-amber-600"
                : "text-red-600"
          }`}
        >
          {formatPct(row.roiMedio)}
        </p>
      </div>
    </div>
  </div>
);

// Carrega itens de todas as compras pra agregar por categoria deste fornecedor
const useItensPorCategoriaDoFornecedor = (compras) => {
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!compras || compras.length === 0) {
      setLinhas([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(
      compras.map((c) =>
        api
          .get(`/compras-fornecedor/${c._id}/itens`)
          .then((r) => r.data.data || [])
          .catch(() => []),
      ),
    ).then((listas) => {
      if (cancelled) return;
      const todosItens = listas.flat();
      const agg = {};
      for (const it of todosItens) {
        const k = it.categoria;
        if (!agg[k]) {
          agg[k] = {
            categoria: k,
            totalUnidades: 0,
            custoTotal: 0,
            faturamentoPotencial: 0,
            lucroPotencial: 0,
          };
        }
        const q = it.quantidade || 0;
        const custoTotalUnit = (it.custoUnitario || 0) + (it.custoEmbalagem || 0);
        const fat = (it.precoVenda || 0) * q;
        const custo = custoTotalUnit * q;
        agg[k].totalUnidades += q;
        agg[k].custoTotal += custo;
        agg[k].faturamentoPotencial += fat;
        agg[k].lucroPotencial += fat - custo;
      }
      const out = Object.values(agg).map((r) => ({
        ...r,
        roiMedio:
          r.custoTotal > 0 ? (r.lucroPotencial / r.custoTotal) * 100 : 0,
      }));
      out.sort((a, b) => b.faturamentoPotencial - a.faturamentoPotencial);
      setLinhas(out);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [compras]);

  return { linhas, loading };
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
      active
        ? "bg-[#967965] text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

const FornecedorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { fornecedor, loading: fLoading, refetch: refetchFornecedor } = useFornecedor(id);
  const { resumo, refetch: refetchResumo } = useResumoFornecedor(id);
  const { compras, refetch: refetchCompras } = useComprasPorFornecedor(id);
  const { linhas: porMes } = useComprasPorMes({ fornecedorId: id });
  const { linhas: porCategoria } = useItensPorCategoriaDoFornecedor(compras);

  const [tab, setTab] = useState("historico");
  const [editOpen, setEditOpen] = useState(false);
  const [novaCompraOpen, setNovaCompraOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  const primeiraCompra = useMemo(() => {
    if (!compras || compras.length === 0) return null;
    const sorted = [...compras].sort(
      (a, b) => new Date(a.dataCompra) - new Date(b.dataCompra),
    );
    return sorted[0].dataCompra;
  }, [compras]);

  // Compras "enriquecidas" com _faturamento computado client-side
  // (precisamos dos itens — buscamos junto)
  const [comprasEnriquecidas, setComprasEnriquecidas] = useState([]);
  useEffect(() => {
    if (!compras || compras.length === 0) {
      setComprasEnriquecidas([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      compras.map((c) =>
        api
          .get(`/compras-fornecedor/${c._id}/itens`)
          .then((r) => {
            const itens = r.data.data || [];
            const fat = itens.reduce(
              (s, it) => s + (it.precoVenda || 0) * (it.quantidade || 0),
              0,
            );
            return { ...c, _faturamento: fat };
          })
          .catch(() => ({ ...c, _faturamento: 0 })),
      ),
    ).then((arr) => {
      if (cancelled) return;
      arr.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));
      setComprasEnriquecidas(arr);
    });
    return () => {
      cancelled = true;
    };
  }, [compras]);

  if (authLoading || isAuthenticated === null || fLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-fancy">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!fornecedor) {
    return (
      <div className="min-h-screen bg-[#F5F0EB]">
        <AdminHeader />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Fornecedor não encontrado.</p>
          <button
            onClick={() => navigate("/admin/fornecedores")}
            className="mt-4 text-[#967965] hover:underline"
          >
            Voltar para fornecedores
          </button>
        </main>
      </div>
    );
  }

  // WhatsApp link
  const phoneDigits = (fornecedor.telefone || "").replace(/\D/g, "");
  const whatsappUrl = phoneDigits
    ? `https://wa.me/55${phoneDigits}`
    : null;

  // Resumo (com fórmulas da spec)
  const totalInvestido = resumo?.totalInvestido || 0;
  const faturamento = resumo?.faturamentoPotencial || 0;
  const lucro = faturamento - totalInvestido;
  const roi = totalInvestido > 0 ? (lucro / totalInvestido) * 100 : 0;
  const totalCompras = resumo?.totalCompras || 0;
  const totalPecas = resumo?.totalPecas || 0;

  const roiClass =
    roi >= 100
      ? "text-emerald-700"
      : roi >= 50
        ? "text-amber-600"
        : "text-red-600";
  const lucroClass = lucro >= 0 ? "text-emerald-700" : "text-red-600";

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/admin/fornecedores")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#967965] mb-6"
        >
          <FiArrowLeft size={16} /> Voltar para fornecedores
        </button>

        {/* Cabeçalho do fornecedor */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-fancy text-2xl sm:text-3xl text-gray-900 break-words">
                  {fornecedor.nome}
                </h1>
                {!fornecedor.ativo && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                    Inativo
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                {fornecedor.telefone && (
                  <span className="inline-flex items-center gap-1.5">
                    <FiPhone size={13} className="text-gray-400" />
                    {fornecedor.telefone}
                  </span>
                )}
                {fornecedor.cidade && (
                  <span className="inline-flex items-center gap-1.5">
                    <FiMapPin size={13} className="text-gray-400" />
                    {fornecedor.cidade}
                  </span>
                )}
              </div>
              {fornecedor.observacao && (
                <p className="text-xs text-gray-500 italic mt-2 max-w-2xl">
                  {fornecedor.observacao}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <FiPhone size={14} /> Abrir WhatsApp
                </a>
              )}
              <button
                onClick={() => setEditOpen(true)}
                className="px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <FiEdit2 size={14} /> Editar fornecedor
              </button>
              <button
                onClick={() => setNovaCompraOpen(true)}
                className="px-4 py-2 text-sm bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <FiPlus size={14} /> Nova compra
              </button>
            </div>
          </div>
        </div>

        {/* 8 cards de resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FiDollarSign}
            label="Total investido"
            value={formatBRL(totalInvestido)}
          />
          <StatCard
            icon={FiTrendingUp}
            label="Fat. potencial"
            value={formatBRL(faturamento)}
          />
          <StatCard
            icon={FiBriefcase}
            label="Lucro potencial"
            value={formatBRL(lucro)}
            valueClass={lucroClass}
          />
          <StatCard
            icon={FiTarget}
            label="ROI médio"
            value={formatPct(roi)}
            valueClass={roiClass}
          />
          <StatCard
            icon={FiShoppingBag}
            label="Compras"
            value={totalCompras}
          />
          <StatCard
            icon={FiPackage}
            label="Total de peças"
            value={totalPecas}
          />
          <StatCard
            icon={FiCalendar}
            label="Primeira compra"
            value={formatDateBR(primeiraCompra)}
          />
          <StatCard
            icon={FiCalendar}
            label="Última compra"
            value={formatDateBR(resumo?.ultimaCompra)}
          />
        </div>

        {/* Abas */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <TabButton
            active={tab === "historico"}
            onClick={() => setTab("historico")}
          >
            Histórico
          </TabButton>
          <TabButton active={tab === "mes"} onClick={() => setTab("mes")}>
            Por mês
          </TabButton>
          <TabButton
            active={tab === "categoria"}
            onClick={() => setTab("categoria")}
          >
            Por categoria
          </TabButton>
        </div>

        {/* Conteúdo das abas */}
        {tab === "historico" && (
          <>
            {comprasEnriquecidas.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingBag size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">
                  Nenhuma compra registrada para este fornecedor ainda.
                </p>
                <button
                  onClick={() => setNovaCompraOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg text-sm transition-colors"
                >
                  <FiPlus size={14} /> Registrar primeira compra
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {comprasEnriquecidas.map((c) => (
                  <CompraRow key={c._id} compra={c} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "mes" && (
          <>
            {porMes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-sm">
                  Sem dados para agrupar por mês ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {porMes.map((mes, idx) => (
                  <MesRow
                    key={mes.mesAno}
                    atual={mes}
                    anterior={porMes[idx + 1]}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "categoria" && (
          <>
            {porCategoria.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-sm">
                  Sem itens para agrupar por categoria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {porCategoria.map((row) => (
                  <CategoriaCard key={row.categoria} row={row} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <EditFornecedorModal
        fornecedor={fornecedor}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={refetchFornecedor}
      />
      <CreateCompraFornecedorModal
        fornecedorId={fornecedor._id}
        fornecedorNome={fornecedor.nome}
        isOpen={novaCompraOpen}
        onClose={() => setNovaCompraOpen(false)}
        onSuccess={() => {
          refetchResumo();
          refetchCompras();
        }}
      />
    </div>
  );
};

export default FornecedorDetail;
