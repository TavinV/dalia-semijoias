import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiTag,
  FiSave,
} from "react-icons/fi";
import api from "../../api/axios";
import {
  TIPO_SAIDA_KEYS,
  TIPO_SAIDA_LABEL,
} from "../../hooks/useSaidas";

const todayISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};

const initialForm = {
  tipo: "transporte",
  valor: "",
  data: todayISO(),
  observacao: "",
};

const CreateSaidaModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.valor || Number(form.valor) < 0) {
      setError("Informe um valor válido");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        tipo: form.tipo,
        valor: Number(form.valor),
        data: new Date(form.data + "T12:00:00").toISOString(),
        observacao: form.observacao,
      };
      const res = await api.post("/saidas", payload);
      if (res.data.success) {
        onSuccess?.(res.data.data);
        setForm(initialForm);
        onClose();
      } else {
        setError(res.data.message || "Erro ao registrar saída");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao registrar saída");
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
              <h2 className="font-fancy text-xl text-white">Nova Saída</h2>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <div className="relative">
                  <FiTag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] bg-white"
                    required
                  >
                    {TIPO_SAIDA_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {TIPO_SAIDA_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$) *
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
                      name="valor"
                      value={form.valor}
                      onChange={handleChange}
                      placeholder="0,00"
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <FiCalendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    <input
                      type="date"
                      name="data"
                      value={form.data}
                      onChange={handleChange}
                      max={todayISO()}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação
                </label>
                <div className="relative">
                  <FiFileText
                    className="absolute left-3 top-3 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Detalhes da saída..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] resize-none"
                  />
                </div>
              </div>

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
                  Registrar saída
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateSaidaModal;
