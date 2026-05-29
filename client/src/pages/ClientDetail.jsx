import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiEdit2,
  FiPhone,
  FiPlus,
  FiTrash2,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { useClient } from "../hooks/useClients";
import { useSalesByClient } from "../hooks/useSales";
import { useAuth } from "../hooks/useAuth";
import CreateSaleModal from "../components/modules/CreateSaleModal";
import EditClientModal from "../components/modules/EditClientModal";
import api from "../api/axios";

const formatDate = (d) => {
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

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { client, loading: clientLoading, refetch: refetchClient } = useClient(id);
  const { sales, loading: salesLoading, refetch: refetchSales } =
    useSalesByClient(id);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || isAuthenticated === null || clientLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-fancy">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F5F0EB]">
        <AdminHeader />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Cliente não encontrado.</p>
          <button
            onClick={() => navigate("/clients")}
            className="mt-4 text-[#967965] hover:underline"
          >
            Voltar para clientes
          </button>
        </main>
      </div>
    );
  }

  const totalSpent = sales.reduce((s, sale) => s + (sale.total || 0), 0);
  const unpaidTotal = sales
    .filter((s) => !s.paid)
    .reduce((s, sale) => s + (sale.total || 0), 0);

  const handleMarkPaid = async (saleId) => {
    try {
      await api.patch(`/sales/${saleId}/pay`);
      refetchSales();
    } catch (err) {
      alert(err?.response?.data?.message || "Erro ao marcar como paga");
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (!confirm("Tem certeza que deseja apagar esta venda?")) return;
    try {
      await api.delete(`/sales/${saleId}`);
      refetchSales();
    } catch (err) {
      alert(err?.response?.data?.message || "Erro ao apagar venda");
    }
  };

  const handleDeleteClient = async () => {
    if (
      !confirm(
        "Apagar este cliente vai remover também todo o histórico de compras dele. Continuar?"
      )
    )
      return;
    try {
      await api.delete(`/clients/${client._id}`);
      navigate("/clients");
    } catch (err) {
      alert(err?.response?.data?.message || "Erro ao apagar cliente");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#967965] mb-6"
        >
          <FiArrowLeft size={16} /> Voltar para clientes
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#967965]/10 flex items-center justify-center">
                <FiUser className="text-[#967965]" size={28} />
              </div>
              <div>
                <h1 className="font-fancy text-2xl sm:text-3xl text-gray-900">
                  {client.name}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                  <FiPhone size={13} /> {client.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditClientOpen(true)}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Editar"
              >
                <FiEdit2 size={18} className="text-gray-600" />
              </button>
              <button
                onClick={handleDeleteClient}
                className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Apagar cliente"
              >
                <FiTrash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Compras</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{sales.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total gasto</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                R$ {totalSpent.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Em aberto</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  unpaidTotal > 0 ? "text-orange-600" : "text-gray-900"
                }`}
              >
                R$ {unpaidTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-fancy text-xl text-gray-900">Histórico de Compras</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSaleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg shadow-sm transition-colors text-sm"
          >
            <FiPlus size={16} /> Registrar venda
          </motion.button>
        </div>

        {salesLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando histórico...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">
              Nenhuma compra registrada para este cliente ainda.
            </p>
            <button
              onClick={() => setSaleModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#967965] hover:bg-[#7A5F4F] text-white rounded-lg text-sm transition-colors"
            >
              <FiPlus size={14} /> Registrar primeira venda
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(sale.saleDate)}
                      </span>
                      {sale.paid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <FiCheckCircle size={11} /> Paga
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <FiClock size={11} /> Pendente
                        </span>
                      )}
                    </div>

                    <ul className="space-y-1 mb-2">
                      {sale.items.map((it, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 flex items-center justify-between"
                        >
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          <span className="text-gray-500">
                            R$ {(it.quantity * it.unitPrice).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {sale.notes && (
                      <p className="text-xs text-gray-500 italic mt-2">
                        “{sale.notes}”
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-fancy text-2xl text-[#967965]">
                      R$ {Number(sale.total).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      {!sale.paid && (
                        <button
                          onClick={() => handleMarkPaid(sale._id)}
                          className="px-3 py-1.5 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          Marcar paga
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSale(sale._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Apagar"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CreateSaleModal
        clientId={client._id}
        clientName={client.name}
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSuccess={refetchSales}
      />
      <EditClientModal
        client={client}
        isOpen={editClientOpen}
        onClose={() => setEditClientOpen(false)}
        onSuccess={refetchClient}
      />
    </div>
  );
};

export default ClientDetail;
