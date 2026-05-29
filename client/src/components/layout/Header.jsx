// Header.jsx
import Logo from "../ui/Logo.jsx";
import { LuShoppingCart } from "react-icons/lu";
import { IoSearchSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart.jsx";

import SearchBar from "../navigation/Searchbar.jsx";
import ShoppingCart from "../modules/ShoppingCart.jsx";

const NavItens = ({ onCartClick, onSearchClick, isScrolled }) => {
  const { cart } = useCart();

  return (
    <div className="flex items-center gap-2 sm:gap-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative p-1.5 sm:p-2 rounded-full hover:bg-[#967965]/10 transition-colors"
        onClick={onSearchClick}
      >
        <IoSearchSharp
          className={`w-[22px] h-[22px] sm:w-5 sm:h-5 transition-colors ${isScrolled ? "text-gray-700" : "text-gray-800"}`}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="relative p-1.5 sm:p-2 rounded-full hover:bg-[#967965]/10 transition-colors"
        onClick={onCartClick}
      >
        <div className="relative">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-[#0B9444] text-white text-[10px] sm:text-xs font-medium rounded-full min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center px-1 shadow-md"
              >
                {cart.length > 9 ? "9+" : cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <LuShoppingCart
            className={`w-[22px] h-[22px] sm:w-5 sm:h-5 transition-colors ${isScrolled ? "text-gray-700" : "text-gray-800"}`}
          />
        </div>
      </motion.button>
    </div>
  );
};

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchbarOpen, setSearchbarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para efeito visual
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSearchbar = () => {
    setSearchbarOpen(false);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const toggleCartOpen = (e) => {
    e.stopPropagation();
    setCartOpen((prev) => !prev);
    if (!cartOpen) {
      setSearchbarOpen(false);
    }
  };

  const toggleSearchbarOpen = (e) => {
    e.stopPropagation();
    setSearchbarOpen((prev) => !prev);
    if (!searchbarOpen) {
      setCartOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          w-full sticky top-0 h-14 sm:h-20 px-4 sm:px-10 md:px-15
          flex items-center justify-between
          mb-2 sm:mb-10
          transition-all duration-300 z-50
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : "bg-white/90 backdrop-blur-sm shadow-sm sm:shadow-md"
          }
        `}
      >
        {/* Linha decorativa inferior */}
        <div
          className={`
          absolute bottom-0 left-0 right-0 h-[1px] 
          bg-gradient-to-r from-transparent via-[#967965]/30 to-transparent
          transition-opacity duration-300
          ${isScrolled ? "opacity-100" : "opacity-0"}
        `}
        />

        {/* Logo com animação sutil */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Logo />
        </motion.div>

        <NavItens
          onCartClick={toggleCartOpen}
          onSearchClick={toggleSearchbarOpen}
          isScrolled={isScrolled}
        />
      </motion.header>

      {/* Shopping Cart e Search Bar */}
      <ShoppingCart isOpen={cartOpen} onClose={closeCart} />
      <SearchBar isOpen={searchbarOpen} onClose={closeSearchbar} />
    </>
  );
};

export default Header;
