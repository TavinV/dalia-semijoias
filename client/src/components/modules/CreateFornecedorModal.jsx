import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiSave,
} from "react-icons/fi";
import api from "../../api/axios";

const initialForm = { nome: "", telefone: "", cidade: "", observacao: "" };

// Mapeia mensagem do backend para o campo certo (erro inline)
const inferField = (msg = "") => {
  const m = msg.toLowerCase();
  if (m.includes("nome")) return "nome";
  if (m.includes("telefone")) return "telefone";
  if (m.includes("cidade")) return "cidade";
  if (m.includes("observa")) return "observacao";
  return null;
};

const CreateFornecedorModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null });
    }
  };

  const validateLocal = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = "O nome é obrigatório";
    else if (form.nome.trim().length < 2)
      errs.nome = "O nome deve ter pelo menos 2 caracteres";
    if (form.telefone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(form.telefone)) {
      errs.telefone = "Use o formato (00) 00000-0000";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLocal();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await api.post("/fornecedores", form);
      if (res.data.success) {
        onSuccess?.(res.data.data);
        setForm(initialForm);
        onClose();
      } else {
        const msg = res.data.message || "Erro ao cadastrar fornecedor";
        const field = inferField(msg);
        if (field) setFieldErrors({ [field]: msg });
        else setFieldErrors({ _form: msg });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Erro ao cadastrar fornecedor";
      const field = inferField(msg);
      if (field) setFieldErrors({ [field]: msg });
      else setFieldErrors({ _form: msg });
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
              <h2 className="font-fancy text-xl text-white">Novo Fornecedor</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
              {fieldErrors._form && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {fieldErrors._form}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Ex: Joias Atacado SP"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      fieldErrors.nome
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-[#967965]"
                    }`}
                    autoFocus
                  />
                </div>
                {fieldErrors.nome && (
                  <p className="text-xs text-red-600 mt-1.5">{fieldErrors.nome}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <FiPhone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none transition-colors ${
                        fieldErrors.telefone
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-[#967965]"
                      }`}
                    />
                  </div>
                  {fieldErrors.telefone && (
                    <p className="text-xs text-red-600 mt-1.5">
                      {fieldErrors.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleChange}
                      placeholder="São Paulo"
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors"
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
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ex: prazo de pagamento, contato preferido, condições especiais..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors resize-none"
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
                  Salvar fornecedor
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFornecedorModal;
