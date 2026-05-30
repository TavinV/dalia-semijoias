// Vendas.jsx — aba para registrar vendas (avulsas ou vinculadas a um cliente existente)
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiPlus,
  FiCheckCircle,
  FiSearch,
  FiX,
  FiUser,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import CreateSaleModal from "../components/modules/CreateSaleModal";
import { useAuth } from "../hooks/useAuth";
import { useClients } from "../hooks/useClients";

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Vendas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const { clients } = useClients();

  const [open, setOpen] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  // Cliente selecionado (null = venda avulsa, sem dados da pessoa)
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return (clients || [])
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          (c.phone || "").toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [search, clients]);

  if (authLoading || isAuthenticated === null) return <p>Carregando...</p>;

  const pickClient = (c) => {
    setSelectedClient(c);
    setSearch("");
    setShowResults(false);
  };

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-[#F5F0EB] px-4 py-8 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-7 sm:px-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <FiShoppingBag className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="font-fancy text-2xl sm:text-3xl text-white">
                    Registrar venda
                  </h1>
                  <p className="text-white/80 text-sm mt-0.5">
                    Com cliente cadastrado ou venda avulsa
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Seletor de cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente <span className="text-gray-400 font-normal">(opcional)</span>
                </label>

                {selectedClient ? (
                  <div className="flex items-center justify-between gap-3 p-3 bg-[#967965]/8 border border-[#967965]/25 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#967965]/20 flex items-center justify-center flex-shrink-0">
                        <FiUser className="text-[#967965]" size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedClient.name}
                        </p>
                        {selectedClient.phone && (
                          <p className="text-xs text-gray-500 truncate">
                            {selectedClient.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedClient(null)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                      title="Remover cliente (venda avulsa)"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <FiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowResults(true);
                      }}
                      onFocus={() => setShowResults(true)}
                      placeholder="Buscar cliente que já comprou (nome ou telefone)..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-[#967965]"
                    />
                    {showResults && matches.length > 0 && (
                      <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                        {matches.map((c) => (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => pickClient(c)}
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center justify-between gap-2"
                          >
                            <span className="text-sm text-gray-800 truncate">
                              {c.name}
                            </span>
                            {c.phone && (
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {c.phone}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                      Deixe em branco para registrar uma <strong>venda avulsa</strong>{" "}
                      (sem dados da pessoa).
                    </p>
                  </div>
                )}
              </div>

              {/* Botão registrar */}
              <button
                onClick={() => setOpen(true)}
                className="w-full py-4 px-6 rounded-xl bg-[#967965] hover:bg-[#7A5F4F] text-white font-fancy text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiPlus size={18} />
                {selectedClient
                  ? `Registrar venda para ${selectedClient.name.split(" ")[0]}`
                  : "Registrar venda avulsa"}
              </button>
            </div>
          </div>

          {/* Confirmação da última venda */}
          <AnimatePresence>
            {lastSale && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 bg-white rounded-2xl shadow-sm border border-green-100 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Venda registrada com sucesso!
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Total: {formatBRL(lastSale?.total)}
                    {lastSale?.paid ? " · paga" : " · pendente"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <CreateSaleModal
        clientId={selectedClient?._id || null}
        clientName={selectedClient?.name || null}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={(s) => setLastSale(s)}
      />
    </>
  );
};

export default Vendas;
