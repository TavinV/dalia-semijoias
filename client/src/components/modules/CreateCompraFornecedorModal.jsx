import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiSave,
  FiCalendar,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import api from "../../api/axios";

export const CATEGORIA_LABEL = {
  anel: "Anel",
  bracelete: "Bracelete",
  choker: "Choker",
  correntaria: "Correntaria",
  brinco: "Brinco",
  pulseira_f: "Pulseira Feminina",
  pulseira_m: "Pulseira Masculina",
  corrente: "Corrente",
};

const CATEGORIA_KEYS = Object.keys(CATEGORIA_LABEL);

const todayISO = () => {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};

const round2 = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

const calcMetricas = (it) => {
  const qtd = Number(it.quantidade) || 0;
  const cu = Number(it.custoUnitario) || 0;
  const ce = Number(it.custoEmbalagem) || 0;
  const pv = Number(it.precoVenda) || 0;
  const custoTotalUnit = cu + ce;
  const lucroUnit = pv - custoTotalUnit;
  const roiUnit = custoTotalUnit > 0 ? (lucroUnit / custoTotalUnit) * 100 : 0;
  const margem = pv > 0 ? (lucroUnit / pv) * 100 : 0;
  const faturamento = pv * qtd;
  const lucro = lucroUnit * qtd;
  const custoTotal = custoTotalUnit * qtd;
  return {
    custoTotalUnit: round2(custoTotalUnit),
    lucroUnit: round2(lucroUnit),
    roiUnit: round2(roiUnit),
    margem: round2(margem),
    faturamento: round2(faturamento),
    lucro: round2(lucro),
    custoTotal: round2(custoTotal),
  };
};

const blankItem = () => ({
  nomePeca: "",
  categoria: "anel",
  quantidade: 1,
  custoUnitario: 0,
  custoEmbalagem: 2.5,
  precoVenda: 0,
});

const ItemRow = ({ item, index, onChange, onRemove, canRemove }) => {
  const m = calcMetricas(item);

  const set = (field, value) => onChange(index, { ...item, [field]: value });

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#967965] uppercase tracking-wider">
          Item {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Remover item"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
        <input
          type="text"
          value={item.nomePeca}
          onChange={(e) => set("nomePeca", e.target.value)}
          placeholder="Nome da peça"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          required
        />
        <select
          value={item.categoria}
          onChange={(e) => set("categoria", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          required
        >
          {CATEGORIA_KEYS.map((k) => (
            <option key={k} value={k}>
              {CATEGORIA_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Quantidade
          </label>
          <input
            type="number"
            min="1"
            value={item.quantidade}
            onChange={(e) =>
              set("quantidade", parseInt(e.target.value || "1", 10))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Custo unit.
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={item.custoUnitario}
            onChange={(e) =>
              set("custoUnitario", parseFloat(e.target.value || "0"))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Embalagem
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={item.custoEmbalagem}
            onChange={(e) =>
              set("custoEmbalagem", parseFloat(e.target.value || "0"))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            Preço venda
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={item.precoVenda}
            onChange={(e) =>
              set("precoVenda", parseFloat(e.target.value || "0"))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-[#967965]"
            required
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-md px-3 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-gray-400">Custo total/un</p>
          <p className="font-medium text-gray-800">
            R$ {m.custoTotalUnit.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Lucro/un</p>
          <p
            className={`font-medium ${m.lucroUnit >= 0 ? "text-emerald-700" : "text-red-600"}`}
          >
            R$ {m.lucroUnit.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">ROI</p>
          <p
            className={`font-medium ${m.roiUnit >= 0 ? "text-emerald-700" : "text-red-600"}`}
          >
            {m.roiUnit.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-gray-400">Margem</p>
          <p className="font-medium text-gray-800">{m.margem.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

const CreateCompraFornecedorModal = ({
  fornecedorId,
  fornecedorNome,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [dataCompra, setDataCompra] = useState(todayISO());
  const [valorTotalPago, setValorTotalPago] = useState("");
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState([blankItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totais = useMemo(() => {
    return itens.reduce(
      (acc, it) => {
        const m = calcMetricas(it);
        return {
          quantidade: acc.quantidade + (Number(it.quantidade) || 0),
          faturamento: acc.faturamento + m.faturamento,
          lucro: acc.lucro + m.lucro,
          custoTotal: acc.custoTotal + m.custoTotal,
        };
      },
      { quantidade: 0, faturamento: 0, lucro: 0, custoTotal: 0 },
    );
  }, [itens]);

  const roiAgregado = totais.custoTotal > 0
    ? round2((totais.lucro / totais.custoTotal) * 100)
    : 0;

  const updateItem = (i, next) =>
    setItens((prev) => prev.map((it, idx) => (idx === i ? next : it)));

  const removeItem = (i) =>
    setItens((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i),
    );

  const addItem = () => setItens((prev) => [...prev, blankItem()]);

  const reset = () => {
    setDataCompra(todayISO());
    setValorTotalPago("");
    setObservacao("");
    setItens([blankItem()]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const invalid = itens.find(
      (it) =>
        !it.nomePeca?.trim() ||
        !it.categoria ||
        !it.quantidade ||
        it.custoUnitario == null ||
        it.precoVenda == null,
    );
    if (invalid) {
      setError("Preencha nome, categoria, quantidade, custo e preço de todos os itens");
      return;
    }
    if (!valorTotalPago || Number(valorTotalPago) < 0) {
      setError("Informe o valor total pago da compra");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fornecedorId,
        dataCompra: new Date(dataCompra + "T12:00:00").toISOString(),
        valorTotalPago: Number(valorTotalPago),
        quantidadeTotalPecas: totais.quantidade,
        observacao,
        itens: itens.map((it) => ({
          nomePeca: it.nomePeca.trim(),
          categoria: it.categoria,
          quantidade: Number(it.quantidade),
          custoUnitario: Number(it.custoUnitario),
          custoEmbalagem: Number(it.custoEmbalagem),
          precoVenda: Number(it.precoVenda),
        })),
      };
      const res = await api.post("/compras-fornecedor", payload);
      if (res.data.success) {
        onSuccess?.(res.data.data);
        reset();
        onClose();
      } else {
        setError(res.data.message || "Erro ao registrar compra");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao registrar compra");
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
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-fancy text-xl text-white">
                  Registrar Compra
                </h2>
                {fornecedorNome && (
                  <p className="text-white/80 text-sm mt-0.5">
                    Fornecedor: {fornecedorNome}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white"
              >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da compra *
                  </label>
                  <div className="relative">
                    <FiCalendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    <input
                      type="date"
                      value={dataCompra}
                      onChange={(e) => setDataCompra(e.target.value)}
                      max={todayISO()}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor total pago *
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
                      value={valorTotalPago}
                      onChange={(e) => setValorTotalPago(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965]"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Quanto você de fato pagou pela compra (com descontos, frete etc).
                  </p>
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
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows="2"
                    placeholder="Ex: pedido pelo whatsapp, entrega prevista pra dia X..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965] resize-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-fancy text-lg text-gray-900">
                    Itens da compra
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#967965]/10 text-[#967965] hover:bg-[#967965]/20 rounded-lg transition-colors"
                  >
                    <FiPlus size={13} /> Adicionar item
                  </button>
                </div>

                <div className="space-y-3">
                  {itens.map((it, i) => (
                    <ItemRow
                      key={i}
                      item={it}
                      index={i}
                      onChange={updateItem}
                      onRemove={removeItem}
                      canRemove={itens.length > 1}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#967965]/5 rounded-lg p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Total peças
                  </p>
                  <p className="font-fancy text-xl text-gray-900">
                    {totais.quantidade}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Faturamento pot.
                  </p>
                  <p className="font-fancy text-xl text-[#967965]">
                    R$ {totais.faturamento.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Lucro potencial
                  </p>
                  <p
                    className={`font-fancy text-xl ${totais.lucro >= 0 ? "text-emerald-700" : "text-red-600"}`}
                  >
                    R$ {totais.lucro.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    ROI agregado
                  </p>
                  <p
                    className={`font-fancy text-xl ${roiAgregado >= 0 ? "text-emerald-700" : "text-red-600"}`}
                  >
                    {roiAgregado.toFixed(2)}%
                  </p>
                </div>
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
                Registrar compra
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCompraFornecedorModal;
