// components/ui/SearchBar.jsx
import { useState, useRef, useEffect } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchProducts } from "../../hooks/useSearchProducts";

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const { results, loading } = useSearchProducts(query);
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      onClose();
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-[#967965]/20 text-[#6B5847] font-medium"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={searchBarRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1], // easing suave
          }}
          className="absolute top-20 left-0 w-full bg-[#F9F9F9]/95 backdrop-blur-md shadow-lg z-50 border-b border-[#967965]/20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Campo de busca - mais elegante */}
            <div className="relative">
              <div className="flex items-center gap-4 border border-[#967965]/30 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm hover:border-[#967965]/50 transition-colors">
                <BiSearchAlt2 size={20} className="text-[#967965]/70" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent font-light"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1.5 hover:bg-[#967965]/10 rounded-full transition-colors"
                  >
                    <IoCloseSharp size={18} className="text-[#967965]/70" />
                  </button>
                )}
              </div>

              {/* Linha decorativa sutil */}
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#967965]/30 to-transparent" />
            </div>

            {/* Resultados */}
            <AnimatePresence>
              {query && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#967965]/20 overflow-hidden"
                >
                  {/* Header dos resultados */}
                  <div className="px-5 py-4 bg-gradient-to-r from-[#F9F9F9] to-white border-b border-[#967965]/10">
                    <p className="text-sm font-fancy text-[#6B5847]">
                      {loading ? (
                        <span className="flex items-center gap-3">
                          <span className="w-4 h-4 border-2 border-[#967965] border-t-transparent rounded-full animate-spin" />
                          Buscando produtos...
                        </span>
                      ) : results.length > 0 ? (
                        `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`
                      ) : (
                        "Nenhum produto encontrado"
                      )}
                    </p>
                  </div>

                  {/* Lista de resultados */}
                  {!loading && results.length > 0 && (
                    <motion.ul
                      className="max-h-80 overflow-y-auto divide-y divide-[#967965]/5"
                      layout
                    >
                      {results.map((p, index) => (
                        <motion.li
                          key={p.dalia_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              handleScrollTo(p.dalia_id);
                            }}
                            href={`#${p.dalia_id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-[#967965]/5 cursor-pointer transition-colors group"
                          >
                            {/* Miniatura do produto com borda sutil */}
                            <div className="w-12 h-12 bg-[#F5F5F5] overflow-hidden flex-shrink-0 rounded border border-[#967965]/10">
                              {p.images && p.images[0] && (
                                <img
                                  src={p.images[0]}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            {/* Informações do produto */}
                            <div className="flex-1 min-w-0">
                              <p className="font-fancy text-sm text-gray-800 group-hover:text-[#6B5847] transition-colors line-clamp-1">
                                {highlightText(p.name, query)}
                              </p>
                              {p.description && (
                                <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                  {p.description}
                                </p>
                              )}
                            </div>

                            {/* Preço */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-medium text-gray-900">
                                R$ {p.price?.toFixed(2)}
                              </p>
                              <p className="text-xs text-[#967965]/70 mt-0.5">
                                {p.material}
                              </p>
                            </div>
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}

                  {/* Estado vazio */}
                  {!loading && query && results.length === 0 && (
                    <div className="px-5 py-10 text-center">
                      <p className="text-gray-400 text-sm mb-2">
                        Nenhum produto encontrado para "{query}"
                      </p>
                      <p className="text-xs text-gray-300">
                        Tente buscar por nome, material ou descrição
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
