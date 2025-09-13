import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoCloseSharp } from "react-icons/io5";

import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-20 left-0 w-full bg-[#F3F3F3] shadow-md p-4 px-15 flex items-center gap-3 z-50"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-md "
                    />
                    {query === "" ?
                        <BiSearchAlt2 size={20} color="var(--color-text)" /> :

                        <button onClick={() =>{setQuery("")}}>
                            <IoCloseSharp size={20} color="var(--color-text)" /> 
                        </button>
                    
                    }
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchBar;
