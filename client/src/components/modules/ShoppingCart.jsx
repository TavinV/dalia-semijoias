// ShoppingCart.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Button from "../ui/Button.jsx";
import generateWhatsAppLink from "../../utils/generateWhatsappLink.js";
import { useCart } from "../../hooks/useCart.jsx";
import { FiX, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { LuShoppingCart } from "react-icons/lu";

const CartItem = ({ product }) => {
  const { addItem, deductItem, removeItem } = useCart();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b border-gray-200 last:border-0"
    >
      {/* Imagem */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Informações do produto */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-fancy text-sm sm:text-base text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-light">
              {product.material}
            </p>
          </div>
          <button
            onClick={() => removeItem(product)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Remover item"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Controles de quantidade e preço */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded">
            <button
              onClick={() => deductItem(product)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <FiMinus size={14} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-900">
              {product.qty}
            </span>
            <button
              onClick={() => addItem(product)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <FiPlus size={14} />
            </button>
          </div>
          <span className="font-fancy text-sm sm:text-base font-medium text-gray-900">
            R$ {product.subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cart, total } = useCart();
  const sidebarRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
      document.body.style.overflowX = "hidden";
    };
  }, [isOpen, onClose]);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar do carrinho - Responsiva com largura proporcional */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="
              fixed top-0 right-0 h-full 
              w-[85%]           /* Mobile: 85% da largura */
              sm:w-[450px]      /* Desktop: largura fixa */
              bg-white shadow-2xl z-50 
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <LuShoppingCart className="text-gray-700" size={18} />
                <h2 className="font-fancy text-lg sm:text-xl text-gray-900">
                  Carrinho
                </h2>
                {cart.length > 0 && (
                  <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fechar carrinho"
              >
                <FiX size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-2">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-8 sm:py-12"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag size={24} className="text-gray-400" />
                  </div>
                  <h3 className="font-fancy text-base sm:text-lg text-gray-900 mb-2">
                    Seu carrinho está vazio
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-[200px] sm:max-w-[250px]">
                    Explore nossos produtos e descubra semijoias exclusivas
                  </p>
                  <button
                    onClick={onClose}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#967965] text-white text-xs sm:text-sm font-medium hover:bg-[#7a6150] transition-colors"
                  >
                    Continuar comprando
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className="space-y-1">
                  {cart.map((item) => (
                    <CartItem key={item.id} product={item} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer com total e checkout */}
            {cart.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-t border-gray-100 px-4 sm:px-5 py-4 sm:py-5 bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Subtotal
                  </span>
                  <span className="font-fancy text-lg sm:text-xl font-medium text-gray-900">
                    R$ {total}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      (window.location.href = generateWhatsAppLink(cart))
                    }
                    className="w-full flex justify-center items-center py-3 sm:py-4 bg-[#25D366] text-white font-inter font-semibold text-xs sm:text-sm tracking-wide hover:bg-[#05423b] transition-colors"
                  >
                    <FaWhatsapp className="mr-2" size={18} />
                    Finalizar via Whatsapp
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 sm:py-3 text-xs sm:text-sm text-[#967965] hover:text-[#7a6150] transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-4">
                  Frete calculado no próximo passo
                </p>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;