import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPackage,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiSave,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import api from "../../api/axios";
import { useProducts } from "../../hooks/useProducts";

const ItemRow = ({ item, index, onChange, onRemove, products }) => {
  const [mode, setMode] = useState(item.productId ? "catalog" : "free");
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    return (products || [])
      .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8);
  }, [search, products]);

  const handlePickProduct = (product) => {
    onChange(index, {
      ...item,
      productId: product._id,
      name: product.name,
      unitPrice: product.price,
    });
    setSearch("");
    setShowResults(false);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    if (newMode === "free") {
      onChange(index, { ...item, productId: null });
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex bg-white border border-gray-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => toggleMode("catalog")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === "catalog"
                ? "bg-[#967965] text-white"
                : "text-gray-600 hover:text-[#967965]"
            }`}
          >
            <FiPackage size={14} /> Catálogo
          </button>
          <button
            type="button"
            onClick={() => toggleMode("free")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === "free"
                ? "bg-[#967965] text-white"
                : "text-gray-600 hover:text-[#967965]"
            }`}
          >
            <FiEdit3 size={14} /> Texto livre
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          title="Remover item"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      {mode === "catalog" && !item.productId && (
        <div className="relative mb-3">
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
            placeholder="Buscar produto pelo nome..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          />
          {showResults && filteredProducts.length > 0 && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
              {filteredProducts.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => handlePickProduct(p)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="text-sm text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-500">
                    R$ {Number(p.price).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_90px_120px] gap-3">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(index, { ...item, name: e.target.value })}
          placeholder="Nome do produto/serviço"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          required
        />
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            onChange(index, {
              ...item,
              quantity: parseInt(e.target.value || "1", 10),
            })
          }
          placeholder="Qtd"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          value={item.unitPrice}
          onChange={(e) =>
            onChange(index, {
              ...item,
              unitPrice: parseFloat(e.target.value || "0"),
            })
          }
          placeholder="Preço unit."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          required
        />
      </div>

      <div className="text-right text-xs text-gray-500 mt-2">
        Subtotal: R$ {(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
      </div>
    </div>
  );
};

const blankItem = () => ({
  productId: null,
  name: "",
  quantity: 1,
  unitPrice: 0,
});

const todayISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};

const CreateSaleModal = ({ clientId, clientName, isOpen, onClose, onSuccess }) => {
  const { products } = useProducts();
  const [items, setItems] = useState([blankItem()]);
  const [paid, setPaid] = useState(false);
  const [notes, setNotes] = useState("");
  const [saleDate, setSaleDate] = useState(todayISO());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + Number(it.quantity || 0) * Number(it.unitPrice || 0),
        0
      ),
    [items]
  );

  const updateItem = (i, next) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? next : it)));
  };

  const removeItem = (i) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  };

  const addItem = () => setItems((prev) => [...prev, blankItem()]);

  const reset = () => {
    setItems([blankItem()]);
    setPaid(false);
    setNotes("");
    setSaleDate(todayISO());
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const invalid = items.find(
      (it) => !it.name?.trim() || !it.quantity || it.unitPrice == null
    );
    if (invalid) {
      setError("Preencha nome, quantidade e preço de todos os itens");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        clientId,
        items: items.map((it) => ({
          productId: it.productId || null,
          name: it.name.trim(),
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
        })),
        total: Number(total.toFixed(2)),
        paid,
        notes,
        saleDate: saleDate ? new Date(saleDate + "T12:00:00").toISOString() : undefined,
      };
      const res = await api.post("/sales", payload);
      if (res.data.success) {
        onSuccess?.(res.data.data);
        reset();
        onClose();
      } else {
        setError(res.data.message || "Erro ao registrar venda");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao registrar venda");
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
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-fancy text-xl text-white">Registrar Venda</h2>
                {clientName && (
                  <p className="text-white/80 text-sm mt-0.5">Cliente: {clientName}</p>
                )}
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <FiX size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {items.map((it, i) => (
                  <ItemRow
                    key={i}
                    item={it}
                    index={i}
                    onChange={updateItem}
                    onRemove={removeItem}
                    products={products}
                  />
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#967965] hover:text-[#967965] transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus size={16} /> Adicionar item
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da venda
                </label>
                <div className="relative">
                  <FiCalendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    max={todayISO()}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observação (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965] resize-none"
                  placeholder="Ex: pagamento combinado pra sexta, retirada na loja, presente de aniversário..."
                />
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="w-4 h-4 accent-[#967965]"
                />
                <span className="text-sm text-gray-700">
                  Venda já foi <strong>paga</strong>
                </span>
              </label>

              <div className="flex items-center justify-between bg-[#967965]/10 rounded-lg p-4">
                <span className="text-sm text-gray-700">Total da venda</span>
                <span className="font-fancy text-2xl text-[#967965]">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </form>

            <div className="border-t border-gray-100 p-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
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
                Registrar venda
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateSaleModal;
