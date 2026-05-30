// Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiLogOut,
  FiSettings,
  FiBell,
  FiPlus,
  FiFilter,
  FiDownload,
  FiAward,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiArchive,
} from "react-icons/fi";
import { LuHeart } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../components/ui/Logo";
import AdminHeader from "../components/layout/AdminHeader";
import { useProducts } from "../hooks/useProducts";
import { useAllSales } from "../hooks/useSales";
import { useAuth } from "../hooks/useAuth";
import ProductsTable from "../components/modules/ProductsTable";

// Componente de Card de Estatística
const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-light mb-1">{label}</p>
        <p className="text-2xl  font-bold text-gray-900">{value}</p>
        {change && (
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <FiTrendingUp size={12} />
            {change} em relação ao mês passado
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center`}
      >
        <Icon className={`text-${color}-600`} size={24} />
      </div>
    </div>
  </motion.div>
);

// Componente de Ação Rápida
const QuickAction = ({ icon: Icon, label, onClick, color = "gray" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-[#967965] hover:shadow-md transition-all duration-300 w-full sm:w-auto"
  >
    <div
      className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center`}
    >
      <Icon className={`text-${color}-600`} size={16} />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </motion.button>
);

// ---------- Helpers de período / formato ----------
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = () => {
  const d = startOfToday();
  const dow = d.getDay(); // 0=domingo
  const diff = dow === 0 ? 6 : dow - 1; // semana começa segunda
  d.setDate(d.getDate() - diff);
  return d;
};

const startOfMonth = () => {
  const d = startOfToday();
  d.setDate(1);
  return d;
};

const startOfYear = () => {
  const d = startOfToday();
  d.setMonth(0, 1);
  return d;
};

const isInPeriod = (date, periodKey) => {
  if (!date) return false;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  if (periodKey === "todos") return true;
  if (periodKey === "hoje") return d >= startOfToday();
  if (periodKey === "esta semana") return d >= startOfWeek();
  if (periodKey === "este mês") return d >= startOfMonth();
  if (periodKey === "este ano") return d >= startOfYear();
  return true;
};

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

// ---------- Sub-section: Vendas no período ----------
const VendasSection = ({ sales, products, loading, period, category }) => {
  // Mapa productId → product pra lookup de categoria
  const productById = useMemo(() => {
    const m = {};
    for (const p of products || []) m[p._id] = p;
    return m;
  }, [products]);

  // Mapa nome (lowercase) → categoria, fallback se productId não vier
  const categoriaByName = useMemo(() => {
    const m = {};
    for (const p of products || []) {
      if (p.name) m[p.name.toLowerCase().trim()] = p.category;
    }
    return m;
  }, [products]);

  const itemCategoria = (it) => {
    if (it?.productId && productById[it.productId])
      return productById[it.productId].category;
    if (it?.name) {
      const c = categoriaByName[it.name.toLowerCase().trim()];
      if (c) return c;
    }
    return null;
  };

  // Vendas filtradas por período + categoria
  const filteredSales = useMemo(() => {
    return (sales || []).filter((s) => {
      const dt = s.saleDate || s.createdAt;
      if (!isInPeriod(dt, period)) return false;
      if (category === "todos") return true;
      return (s.items || []).some((it) => itemCategoria(it) === category);
    });
  }, [sales, period, category, productById, categoriaByName]);

  // Stats do período
  const totalVendas = filteredSales.length;
  const faturamento = filteredSales.reduce(
    (acc, s) => acc + (Number(s.total) || 0),
    0,
  );
  const pecasVendidas = filteredSales.reduce(
    (acc, s) =>
      acc +
      (s.items || []).reduce(
        (a, it) => a + (Number(it.quantidade) || Number(it.quantity) || 0),
        0,
      ),
    0,
  );

  // Top 4 peças mais vendidas NO MÊS (sempre do mês atual, independente do período)
  const topMes = useMemo(() => {
    const agg = {};
    for (const s of sales || []) {
      const dt = s.saleDate || s.createdAt;
      if (!isInPeriod(dt, "este mês")) continue;
      for (const it of s.items || []) {
        const key = (it.name || "").trim() || "(sem nome)";
        const qty = Number(it.quantity) || Number(it.quantidade) || 0;
        if (!agg[key]) agg[key] = { name: key, qty: 0, faturamento: 0 };
        agg[key].qty += qty;
        agg[key].faturamento +=
          qty * (Number(it.unitPrice) || Number(it.preco) || 0);
      }
    }
    return Object.values(agg)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  }, [sales]);

  // Histórico (mais recentes primeiro)
  const historico = useMemo(() => {
    const arr = [...filteredSales];
    arr.sort(
      (a, b) =>
        new Date(b.saleDate || b.createdAt) -
        new Date(a.saleDate || a.createdAt),
    );
    return arr.slice(0, 20);
  }, [filteredSales]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-fancy text-2xl text-gray-900 mb-1 flex items-center gap-2">
            <FiBarChart2 className="text-[#967965]" /> Vendas no período
          </h2>
          <p className="text-xs text-gray-500">
            Filtrando: <strong>{period}</strong>
            {category !== "todos" && (
              <>
                {" "}
                · Categoria: <strong>{category}</strong>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Stats do período */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Vendas
          </p>
          <p className="font-fancy text-3xl text-gray-900 mt-2">
            {totalVendas}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Faturamento
          </p>
          <p className="font-fancy text-3xl text-[#967965] mt-2">
            {formatBRL(faturamento)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Peças vendidas
          </p>
          <p className="font-fancy text-3xl text-gray-900 mt-2">
            {pecasVendidas}
          </p>
        </div>
      </div>

      {/* Top 4 peças do mês */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FiAward className="text-[#967965]" />
          <h3 className="font-fancy text-lg text-gray-900">
            Top 4 peças mais vendidas no mês
          </h3>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Carregando...
          </p>
        ) : topMes.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Nenhuma venda registrada no mês ainda.
          </p>
        ) : (
          <ol className="space-y-2">
            {topMes.map((p, idx) => (
              <li
                key={p.name}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#967965] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {p.name}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {p.qty} {p.qty === 1 ? "peça" : "peças"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {formatBRL(p.faturamento)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Histórico de vendas no período */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <FiClock className="text-[#967965]" />
          <h3 className="font-fancy text-lg text-gray-900">
            Histórico de vendas
          </h3>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            Carregando...
          </p>
        ) : historico.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            Sem vendas no período selecionado.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {historico.map((s) => {
              const cliente = s.clientId?.name || "Cliente";
              const qty = (s.items || []).reduce(
                (a, it) =>
                  a + (Number(it.quantity) || Number(it.quantidade) || 0),
                0,
              );
              return (
                <li
                  key={s._id}
                  className="px-5 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {cliente}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateBR(s.saleDate || s.createdAt)} ·{" "}
                      {qty} {qty === 1 ? "peça" : "peças"}
                      {!s.paid && (
                        <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px]">
                          Pendente
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {formatBRL(s.total)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

// ---------- Sub-section: Estoque por Categoria ----------
const EstoqueCategoriaSection = ({ sales, products, period, category }) => {
  const productById = useMemo(() => {
    const m = {};
    for (const p of products || []) m[p._id] = p;
    return m;
  }, [products]);

  const categoriaByName = useMemo(() => {
    const m = {};
    for (const p of products || []) {
      if (p.name) m[p.name.toLowerCase().trim()] = p.category;
    }
    return m;
  }, [products]);

  const itemCategoria = (it) => {
    if (it?.productId && productById[it.productId])
      return productById[it.productId].category;
    if (it?.name) {
      const c = categoriaByName[it.name.toLowerCase().trim()];
      if (c) return c;
    }
    return null;
  };

  // Vendas no período pra contar peças vendidas
  const vendidasNoPeriodoPorNome = useMemo(() => {
    const m = {};
    for (const s of sales || []) {
      const dt = s.saleDate || s.createdAt;
      if (!isInPeriod(dt, period)) continue;
      for (const it of s.items || []) {
        const k = (it.name || "").toLowerCase().trim();
        if (!k) continue;
        m[k] = (m[k] || 0) + (Number(it.quantity) || Number(it.quantidade) || 0);
      }
    }
    return m;
  }, [sales, period]);

  // Agrupa produtos por categoria
  const categorias = useMemo(() => {
    const list = (products || []).filter(
      (p) => category === "todos" || p.category === category,
    );
    const agg = {};
    for (const p of list) {
      const cat = p.category || "Sem categoria";
      if (!agg[cat]) {
        agg[cat] = {
          categoria: cat,
          produtos: [],
          totalEstoque: 0,
          faturamentoPotencial: 0,
          precoSoma: 0,
          precoCount: 0,
          vendidasNoPeriodo: 0,
        };
      }
      const stock = Math.max(0, Number(p.stock) || 0);
      const price = Number(p.price) || 0;
      agg[cat].produtos.push(p);
      agg[cat].totalEstoque += stock;
      agg[cat].faturamentoPotencial += price * stock;
      if (price > 0) {
        agg[cat].precoSoma += price;
        agg[cat].precoCount += 1;
      }
      const vendidas =
        vendidasNoPeriodoPorNome[(p.name || "").toLowerCase().trim()] || 0;
      agg[cat].vendidasNoPeriodo += vendidas;
    }
    return Object.values(agg).map((a) => ({
      ...a,
      precoMedio: a.precoCount > 0 ? a.precoSoma / a.precoCount : 0,
    }));
  }, [products, category, vendidasNoPeriodoPorNome]);

  return (
    <div className="mt-8">
      <h2 className="font-fancy text-2xl text-gray-900 mb-1 flex items-center gap-2">
        <FiArchive className="text-[#967965]" /> Estoque por Categoria
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Vendidas no período <strong>{period}</strong>
        {category !== "todos" && (
          <>
            {" "}
            · Categoria: <strong>{category}</strong>
          </>
        )}
      </p>

      {categorias.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">
            Nenhuma categoria com produtos pra mostrar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categorias.map((c) => (
            <CategoriaEstoqueCard
              key={c.categoria}
              data={c}
              vendidasMap={vendidasNoPeriodoPorNome}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoriaEstoqueCard = ({ data, vendidasMap }) => {
  const [open, setOpen] = useState(false);
  const alerta = data.vendidasNoPeriodo > data.totalEstoque;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-fancy text-lg text-gray-900 capitalize">
              {data.categoria}
            </h3>
            {alerta && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                Vendido &gt; comprado
              </span>
            )}
          </div>
          {open ? (
            <FiChevronUp className="text-gray-400" />
          ) : (
            <FiChevronDown className="text-gray-400" />
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Em estoque
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {data.totalEstoque}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Vendidas no período
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {data.vendidasNoPeriodo}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Preço médio
            </p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">
              {formatBRL(data.precoMedio)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Fat. potencial
            </p>
            <p className="text-lg font-bold text-[#967965] mt-0.5">
              {formatBRL(data.faturamentoPotencial)}
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {data.produtos.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">
                  Nenhum produto nesta categoria.
                </p>
              ) : (
                data.produtos.map((p) => {
                  const vendidas =
                    vendidasMap[(p.name || "").toLowerCase().trim()] || 0;
                  const stock = Math.max(0, Number(p.stock) || 0);
                  const overSold = vendidas > stock + vendidas;
                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-lg p-3 border border-gray-100 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Estoque: <strong>{stock}</strong> · Vendidas no período:{" "}
                          <strong>{vendidas}</strong>
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#967965] flex-shrink-0">
                        {formatBRL(p.price)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading, logout } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useAllSales();
  const [selectedPeriod, setSelectedPeriod] = useState("este mês");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-fancy">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((acc, p) => acc + (p.stock || 0), 0) || 0;
  const totalValue =
    products?.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0) || 0;
  const lowStock = products?.filter((p) => p.stock < 5).length || 0;

  const stats = [
    {
      icon: FiPackage,
      label: "Total de Produtos",
      value: totalProducts,
      color: "blue",
    },
    {
      icon: FiShoppingBag,
      label: "Estoque Total",
      value: `${totalStock} unidades`,
      color: "green",
    },
    {
      icon: FiDollarSign,
      label: "Valor em Estoque",
      value: `R$ ${totalValue.toFixed(2)}`,
      color: "purple",
      change: "+12.5%",
    },
    { icon: LuHeart, label: "Estoque Baixo", value: lowStock, color: "rose" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header do Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-fancy text-3xl sm:text-4xl text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-500 font-light">
              Gerencie seus produtos e acompanhe suas métricas
            </p>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Sair"
            >
              <FiLogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cards de Estatística */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="flex justify-end mb-6">
          <QuickAction
            icon={FiPlus}
            label="Novo Produto"
            onClick={() => navigate("/create-product")}
            color="emerald"
          />
        </div>

        {/* Filtros de Período (agora funcionais — aplicam-se às seções de Vendas e Estoque por Categoria abaixo) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            {["Hoje", "Esta semana", "Este mês", "Este ano", "Todos"].map(
              (period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period.toLowerCase())}
                  className={`
                  px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all
                  ${
                    selectedPeriod === period.toLowerCase()
                      ? "bg-[#967965] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }
                `}
                >
                  {period}
                </button>
              ),
            )}
          </div>

        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-fancy text-xl text-gray-900 mb-1">
                  Produtos
                </h2>
                <p className="text-sm text-gray-500">
                  Gerencie todos os seus produtos em um só lugar
                </p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                {totalProducts} itens
              </span>
            </div>
          </div>

          {productsLoading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Carregando produtos...</p>
            </div>
          ) : (
            <ProductsTable />
          )}
        </div>

        {/* ============ NOVA SEÇÃO: VENDAS NO PERÍODO ============ */}
        <VendasSection
          sales={sales}
          products={products}
          loading={salesLoading}
          period={selectedPeriod}
          category={selectedCategory}
        />

        {/* ============ NOVA SEÇÃO: ESTOQUE POR CATEGORIA ============ */}
        <EstoqueCategoriaSection
          sales={sales}
          products={products}
          period={selectedPeriod}
          category={selectedCategory}
        />

        {/* Rodapé do Dashboard */}
        <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
          <p>© 2025 Dália Concept - Painel Administrativo</p>
          <p>v2.0.0</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
