// components/ui/SearchBar.jsx
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchProducts } from "../../hooks/useSearchProducts";

const SearchBar = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const { results, loading } = useSearchProducts(query);

    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            onClose(); // fecha a barra de busca
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-20 left-0 w-full bg-[#F3F3F3] shadow-md p-4 px-6 flex flex-col gap-4 z-50"
                >
                    {/* Campo de busca */}
                    <div className="flex items-center gap-3 border border-gray-300 bg-white rounded-md px-3 py-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar produtos..."
                            className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-md"
                        />
                        {query === "" ? (
                            <BiSearchAlt2 size={22} color="var(--color-text)" />
                        ) : (
                            <button onClick={() => setQuery("")}>
                                <IoCloseSharp size={22} color="var(--color-text)" />
                            </button>
                        )}
                    </div>

                    {/* Resultados */}
                    {query && (
                        <div className="bg-white rounded-md shadow-md border border-gray-200">
                            <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
                                <p className="text-sm font-semibold text-gray-700">
                                    {loading
                                        ? "Carregando resultados..."
                                        : results.length > 0
                                            ? `Encontrados ${results.length} produto(s)`
                                            : "Nenhum produto encontrado"}
                                </p>
                            </div>

                            {!loading && results.length > 0 && (
                                <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                                    {results.map((p) => (
                                        <li key={p.dalia_id}>
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleScrollTo(p.dalia_id);
                                                }}
                                                href={`#`}
                                                className="block px-4 py-2 text-blue-600 hover:bg-gray-100 hover:underline cursor-pointer transition-colors"
                                            >
                                                {p.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchBar;
