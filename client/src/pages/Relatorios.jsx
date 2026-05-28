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
  FiTrendingUp,
  FiBriefcase,
  FiTarget,
  FiAlertCircle,
  FiClock,
  FiShoppingBag,
  FiPackage,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useAllSales, usePendencies } from "../hooks/useSales";
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

const TIPO_COLOR = {
  transporte: "bg-blue-50 text-blue-700",
  fornecedor: "bg-[#967965]/10 text-[#7A5F4F]",
  alimentacao: "bg-orange-50 text-orange-700",
  contas: "bg-red-50 text-red-700",
  anuncios: "bg-purple-50 text-purple-700",
  outros: "bg-gray-100 text-gray-700",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-gray-900",
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </p>
        <p
          className={`mt-2 font-fancy text-2xl sm:text-3xl leading-tight break-words ${valueClass}`}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-gray-500 mt-1.5">{subtitle}</p>
        )}
      </div>
      <div className="w-10 h-10 rounded-xl bg-[#967965]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="text-[#967965]" size={20} />
      </div>
    </div>
  </motion.div>
);

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

const Relatorios = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products } = useProducts();
  const { sales } = useAllSales();
  const { sales: pendencias } = usePendencies();
  const [tipoSaida, setTipoSaida] = useState("");
  const { saidas, refetch: refetchSaidas } = useSaidas({
    tipo: tipoSaida || undefined,
  });

  const [tab, setTab] = useState("financeiro");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  // Resumo financeiro a partir do estoque atual (reativo a edições/cadastros)
  const fin = useMemo(() => {
    let inv = 0;
    let fat = 0;
    let totalUnidades = 0;
    for (const p of products || []) {
      const stock = Math.max(0, Number(p.stock) || 0);
      const price = Number(p.price) || 0;
      const custo = Number(p.custo) || 0;
      inv += custo * stock;
      fat += price * stock;
      totalUnidades += stock;
    }
    const lucro = fat - inv;
    const roi = inv > 0 ? (lucro / inv) * 100 : 0;
    return {
      investido: inv,
      faturamento: fat,
      lucro,
      roi,
      totalUnidades,
      totalProdutos: (products || []).length,
    };
  }, [products]);

  const vendasMes = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    let count = 0;
    let total = 0;
    let pecas = 0;
    for (const s of sales || []) {
      const dt = new Date(s.saleDate || s.createdAt);
      if (dt >= start) {
        count++;
        total += Number(s.total) || 0;
        pecas += (s.items || []).reduce(
          (a, it) => a + (Number(it.quantity) || 0),
          0,
        );
      }
    }
    return { count, total, pecas };
  }, [sales]);

  const totalPendencias = useMemo(
    () =>
      (pendencias || []).reduce((a, s) => a + (Number(s.total) || 0), 0),
    [pendencias],
  );

  const saidasTotal = useMemo(
    () => (saidas || []).reduce((a, s) => a + (Number(s.valor) || 0), 0),
    [saidas],
  );

  const saidasPorTipo = useMemo(() => {
    const m = {};
    for (const s of saidas || []) {
      m[s.tipo] = (m[s.tipo] || 0) + (Number(s.valor) || 0);
    }
    return m;
  }, [saidas]);

  // Resumo total acumulado real (faturamento líquido teórico)
  const balancoLiquido = vendasMes.total - saidasTotal;

  const handleDeleteSaida = async (id) => {
    if (!confirm("Apagar essa saída?")) return;
    try {
      await api.delete(`/saidas/${id}`);
      refetchSaidas();
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

  const roiClass =
    fin.roi > 100
      ? "text-emerald-700"
      : fin.roi < 100
        ? "text-red-600"
        : "text-gray-900";
  const lucroClass = fin.lucro >= 0 ? "text-emerald-700" : "text-red-600";
  const balancoClass = balancoLiquido >= 0 ? "text-emerald-700" : "text-red-600";

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-fancy text-3xl sm:text-4xl text-gray-900 mb-2">
            Relatórios
          </h1>
          <p className="text-gray-500 font-light">
            Investimento, faturamento potencial, vendas, pendências e saídas —
            atualizado conforme cadastros e edições de produtos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <TabButton
            active={tab === "financeiro"}
            onClick={() => setTab("financeiro")}
          >
            Resumo Financeiro
          </TabButton>
          <TabButton active={tab === "vendas"} onClick={() => setTab("vendas")}>
            Vendas
          </TabButton>
          <TabButton active={tab === "saidas"} onClick={() => setTab("saidas")}>
            Saídas
          </TabButton>
        </div>

        {/* TAB: Resumo Financeiro */}
        {tab === "financeiro" && (
          <div className="space-y-6">
            {/* 4 cards principais */}
            <div>
              <h2 className="font-fancy text-lg text-gray-700 mb-3">
                Sobre o estoque atual
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={FiDollarSign}
                  label="Total investido"
                  value={formatBRL(fin.investido)}
                  subtitle="custo × estoque atual"
                />
                <StatCard
                  icon={FiTrendingUp}
                  label="Faturamento potencial"
                  value={formatBRL(fin.faturamento)}
                  subtitle="preço × estoque atual"
                />
                <StatCard
                  icon={FiBriefcase}
                  label="Lucro potencial"
                  value={formatBRL(fin.lucro)}
                  valueClass={lucroClass}
                  subtitle="faturamento − investido"
                />
                <StatCard
                  icon={FiTarget}
                  label="ROI geral"
                  value={formatPct(fin.roi)}
                  valueClass={roiClass}
                  subtitle={
                    fin.roi > 100
                      ? "acima de 100% — saudável"
                      : fin.roi > 0
                        ? "abaixo de 100% — atenção"
                        : "sem retorno positivo"
                  }
                />
              </div>
            </div>

            {/* Indicadores complementares */}
            <div>
              <h2 className="font-fancy text-lg text-gray-700 mb-3">
                Movimento atual
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={FiPackage}
                  label="Produtos cadastrados"
                  value={fin.totalProdutos}
                  subtitle={`${fin.totalUnidades} peças em estoque`}
                />
                <StatCard
                  icon={FiShoppingBag}
                  label="Vendas no mês"
                  value={vendasMes.count}
                  subtitle={`${formatBRL(vendasMes.total)} faturado · ${vendasMes.pecas} peças`}
                />
                <StatCard
                  icon={FiAlertCircle}
                  label="Pendências"
                  value={formatBRL(totalPendencias)}
                  valueClass={
                    totalPendencias > 0 ? "text-orange-600" : "text-gray-900"
                  }
                  subtitle={`${(pendencias || []).length} venda(s) não paga(s)`}
                />
                <StatCard
                  icon={FiTrendingDown}
                  label="Saídas registradas"
                  value={formatBRL(saidasTotal)}
                  valueClass="text-red-600"
                  subtitle={`${(saidas || []).length} saída(s)`}
                />
              </div>
            </div>

            {/* Balanço */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="font-fancy text-lg text-gray-900 mb-1">
                Balanço do mês
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Vendas no mês menos saídas registradas (todas)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">
                    Entradas (vendas no mês)
                  </p>
                  <p className="font-fancy text-2xl text-emerald-700 mt-1">
                    + {formatBRL(vendasMes.total)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">
                    Saídas (total)
                  </p>
                  <p className="font-fancy text-2xl text-red-600 mt-1">
                    − {formatBRL(saidasTotal)}
                  </p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4 pt-3 sm:pt-0">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500">
                    Saldo
                  </p>
                  <p
                    className={`font-fancy text-2xl mt-1 ${balancoClass}`}
                  >
                    {balancoLiquido >= 0 ? "+" : ""}
                    {formatBRL(balancoLiquido)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Vendas */}
        {tab === "vendas" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={FiShoppingBag}
                label="Vendas no mês"
                value={vendasMes.count}
              />
              <StatCard
                icon={FiTrendingUp}
                label="Faturamento do mês"
                value={formatBRL(vendasMes.total)}
                valueClass="text-emerald-700"
              />
              <StatCard
                icon={FiPackage}
                label="Peças vendidas no mês"
                value={vendasMes.pecas}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-600">
                O detalhamento completo de vendas (top peças mais vendidas,
                histórico, estoque por categoria com filtros de período) está no
                Dashboard.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg text-sm transition-colors"
              >
                <FiShoppingBag size={14} /> Ir pro Dashboard
              </button>
            </div>
          </div>
        )}

        {/* TAB: Saídas */}
        {tab === "saidas" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-fancy text-xl text-gray-900">Saídas</h2>
                <p className="text-sm text-gray-500">
                  Transporte, fornecedor, alimentação, contas, anúncios e outros
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                <FiPlus size={16} /> Nova saída
              </motion.button>
            </div>

            {/* Filtros por tipo */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTipoSaida("")}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  tipoSaida === ""
                    ? "bg-[#967965] text-white shadow"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              {TIPO_SAIDA_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setTipoSaida(k)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    tipoSaida === k
                      ? "bg-[#967965] text-white shadow"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {TIPO_SAIDA_LABEL[k]}
                </button>
              ))}
            </div>

            {/* Total + breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                    Total de saídas{" "}
                    {tipoSaida && `(${TIPO_SAIDA_LABEL[tipoSaida]})`}
                  </p>
                  <p className="mt-1 font-fancy text-3xl sm:text-4xl text-red-600">
                    {formatBRL(saidasTotal)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FiTrendingDown className="text-red-600" size={22} />
                </div>
              </div>
              {!tipoSaida && Object.keys(saidasPorTipo).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-gray-100">
                  {TIPO_SAIDA_KEYS.map((k) => (
                    <div key={k}>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">
                        {TIPO_SAIDA_LABEL[k]}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {formatBRL(saidasPorTipo[k] || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lista */}
            {saidas.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
                <FiTag size={28} className="mx-auto text-gray-400 mb-3" />
                <h3 className="font-fancy text-lg text-gray-900 mb-1">
                  Nenhuma saída registrada
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  Comece registrando sua primeira saída.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg text-sm transition-colors"
                >
                  <FiPlus size={14} /> Registrar saída
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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
                          <p className="text-sm text-gray-400 italic">
                            Sem observação
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-fancy text-xl text-red-600">
                          {formatBRL(s.valor)}
                        </p>
                        <button
                          onClick={() => handleDeleteSaida(s._id)}
                          className="mt-1 p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Apagar"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                  {saidas.length}{" "}
                  {saidas.length === 1 ? "saída" : "saídas"}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <CreateSaidaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetchSaidas}
      />
    </div>
  );
};

export default Relatorios;
