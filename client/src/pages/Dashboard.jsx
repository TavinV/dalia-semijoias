// Dashboard.jsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiLogOut,
  FiSettings,
  FiBell,
  FiSearch,
  FiPlus,
  FiFilter,
  FiDownload,
} from "react-icons/fi";
import { LuHeart } from "react-icons/lu";
import { motion } from "framer-motion";

import Logo from "../components/ui/Logo";
import AdminHeader from "../components/layout/AdminHeader";
import { useProducts } from "../hooks/useProducts";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading, logout } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("week");

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
            <button className="p-2 hover:bg-white rounded-lg transition-colors relative">
              <FiBell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <FiSettings size={20} className="text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-white rounded-lg transition-colors"
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

        {/* Barra de Ações e Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors text-sm"
            />
          </div>

          {/* Ações Rápidas */}
          <div className="flex flex-wrap items-center gap-3">
            <QuickAction
              icon={FiPlus}
              label="Novo Produto"
              onClick={() => navigate("/admin/products/new")}
              color="emerald"
            />
            <QuickAction icon={FiFilter} label="Filtrar" onClick={() => {}} />
            <QuickAction
              icon={FiDownload}
              label="Exportar"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Filtros de Período (opcional) */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
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
            <ProductsTable searchTerm={searchTerm} />
          )}
        </div>

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
