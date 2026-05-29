import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiDollarSign, FiSave } from "react-icons/fi";
import api from "../../api/axios";

const EditSaleAmountModal = ({ sale, isOpen, onClose, onSuccess }) => {
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sale) {
      setTotal(String(sale.total ?? ""));
      setError(null);
    }
  }, [sale]);

  if (!sale) return null;

  const originalTotal = Number(sale.total || 0);
  const newTotal = Number(total || 0);
  const paidAmount = Math.max(0, originalTotal - newTotal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number.isNaN(newTotal) || newTotal < 0) {
      setError("Informe um valor válido (zero ou mais)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = { total: newTotal };
      if (newTotal === 0) payload.paid = true;
      const res = await api.put(`/sales/${sale._id}`, payload);
      if (res.data.success) {
        onSuccess?.(res.data.data);
        onClose();
      } else {
        setError(res.data.message || "Erro ao atualizar valor");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao atualizar valor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-fancy text-xl text-white">Editar pendência</h2>
                {sale.clientId?.name && (
                  <p className="text-white/80 text-sm mt-0.5">
                    Cliente: {sale.clientId.name}
                  </p>
                )}
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="bg-[#967965]/5 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Valor original da venda
                </p>
                <p className="font-fancy text-2xl text-gray-700">
                  R$ {originalTotal.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novo valor em aberto
                </label>
                <div className="relative">
                  <FiDollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#967965]"
                    placeholder="0,00"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ex.: cliente pagou parte e quer ficar devendo só uma parte.
                  Coloque o valor que <strong>ainda falta</strong> pagar.
                </p>
              </div>

              {paidAmount > 0 && newTotal > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Cliente pagou agora:{" "}
                    <strong>R$ {paidAmount.toFixed(2)}</strong>
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Continua devendo R$ {newTotal.toFixed(2)}
                  </p>
                </div>
              )}

              {newTotal === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Valor zerado — a venda será marcada como{" "}
                    <strong>paga</strong>.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-lg flex items-center gap-2 text-white transition-colors ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#967965] hover:bg-[#7A5F4F]"
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSave size={16} />
                  )}
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditSaleAmountModal;
