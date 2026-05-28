import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiUser,
  FiDollarSign,
  FiEdit2,
} from "react-icons/fi";

import AdminHeader from "../components/layout/AdminHeader";
import { usePendencies } from "../hooks/useSales";
import { useAuth } from "../hooks/useAuth";
import EditSaleAmountModal from "../components/modules/EditSaleAmountModal";
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

const Pendencies = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { sales, loading, error, refetch } = usePendencies();
  const [editingSale, setEditingSale] = useState(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

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

  const total = sales.reduce((s, sale) => s + (sale.total || 0), 0);

  const handleMarkPaid = async (saleId) => {
    try {
      await api.patch(`/sales/${saleId}/pay`);
      refetch();
    } catch (err) {
      alert(err?.response?.data?.message || "Erro ao marcar como paga");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-fancy text-3xl sm:text-4xl text-gray-900 mb-2">
              Pendências
            </h1>
            <p className="text-gray-500 font-light">
              Vendas que ainda não foram pagas
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Total a receber
            </p>
            <p
              className={`font-fancy text-2xl ${
                total > 0 ? "text-orange-600" : "text-gray-900"
              }`}
            >
              R$ {total.toFixed(2)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Carregando pendências...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-red-600">{String(error)}</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="font-fancy text-lg text-gray-900 mb-2">
              Nenhuma pendência!
            </h3>
            <p className="text-gray-500 text-sm">
              Todas as suas vendas estão pagas. 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale, idx) => (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() =>
                        sale.clientId?._id && navigate(`/clients/${sale.clientId._id}`)
                      }
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-[#967965] transition-colors mb-1"
                    >
                      <FiUser size={14} className="text-[#967965]" />
                      {sale.clientId?.name || "Cliente removido"}
                    </button>

                    {sale.clientId?.phone && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <FiPhone size={11} /> {sale.clientId.phone}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">
                        Venda em {formatDate(sale.saleDate)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        <FiClock size={11} /> Pendente
                      </span>
                    </div>

                    <ul className="space-y-0.5">
                      {sale.items.map((it, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {it.quantity}x {it.name}
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
                    <p className="font-fancy text-2xl text-orange-600">
                      R$ {Number(sale.total).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-3">
                      <button
                        onClick={() => setEditingSale(sale)}
                        className="inline-flex items-center gap-1 p-1.5 text-gray-500 hover:text-[#967965] hover:bg-[#967965]/10 rounded-lg transition-colors"
                        title="Editar valor (pagamento parcial)"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleMarkPaid(sale._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <FiDollarSign size={12} /> Marcar paga
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {sales.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-orange-800">
              Você tem <strong>{sales.length}</strong> {sales.length === 1 ? "pendência" : "pendências"}{" "}
              somando <strong>R$ {total.toFixed(2)}</strong> a receber.
            </p>
          </div>
        )}
      </main>

      <EditSaleAmountModal
        sale={editingSale}
        isOpen={!!editingSale}
        onClose={() => setEditingSale(null)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Pendencies;
