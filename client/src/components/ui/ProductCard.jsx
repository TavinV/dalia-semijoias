// ProductCard.jsx - Corrigido o alinhamento do preço
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/useCart";

const ProductCard = ({ id, product }) => {
  const { addItem } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAddedOverlay, setShowAddedOverlay] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  const images = product.images || [product.imageUrl];
  const hasMultipleImages = images.length > 1;
  const buttonColor = "#967965";
  const buttonColorDarker = "#6B5847";

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const item = {
      id: product.dalia_id,
      name: product.name,
      material: product.material,
      price: product.price,
      stock: product.stock,
      image: images[0],
    };
    addItem(item);

    setShowAddedOverlay(true);
    setTimeout(() => setShowAddedOverlay(false), 1500);
  };

  const handleImageClick = (e) => {
    if (!imageRef.current || isSwiping.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
    setIsZoomed(!isZoomed);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = Math.abs(currentX - touchStartX.current);
    const diffY = Math.abs(currentY - touchStartY.current);

    if (diffX > diffY && diffX > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !hasMultipleImages || !isSwiping.current) {
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
      return;
    }

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEnd;
    const minSwipeDistance = 30;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImageIndex(
          (prev) => (prev - 1 + images.length) % images.length,
        );
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const description =
    product.description?.charAt(0).toUpperCase() +
    product.description?.slice(1);

  return (
    <div
      id={id}
      className="relative w-full hover:scale-102 transition-all ease-in group"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Container da Imagem */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <motion.div
          ref={imageRef}
          className="relative w-full h-full"
          onClick={handleImageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          animate={{
            scale: isZoomed ? 2 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          style={{
            transformOrigin: isZoomed
              ? `${zoomPosition.x}% ${zoomPosition.y}%`
              : "center",
          }}
        >
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable="false"
          />

          <AnimatePresence>
            {showAddedOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  backgroundColor: `${buttonColorDarker}E6`,
                  backdropFilter: "blur(2px)",
                }}
              >
                <motion.span
                  initial={{ scale: 0.8, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: -10 }}
                  className="text-white text-base font-light tracking-[0.2em] uppercase text-center"
                >
                  Adicionado ao carrinho
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Botão Plus */}
        <motion.button
          onClick={handleAddToCart}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10"
          style={{
            backgroundColor: buttonColor,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.1, backgroundColor: buttonColorDarker }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M4 12H20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>

        {/* Setas de navegação */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
              aria-label="Imagem anterior"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path
                  d="M15 18L9 12L15 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Próxima imagem"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path
                  d="M9 18L15 12L9 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores de carrossel */}
        {hasMultipleImages && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-1 transition-all duration-300 ${
                  index === currentImageIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Informações do produto - CORRIGIDO: altura fixa para alinhamento */}
      <div className="pt-6 pb-4 px-0">
        {/* Nome do produto - linha única com truncate */}
        <h3
          className="text-lg font-fancy font-bold text-gray-900 tracking-wide mb-2 truncate"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Descrição - altura fixa de 3 linhas com line-clamp */}
        <div className="sm:h-[2.5rem] h-[3.5rem] mb-3">
          {" "}
          {/* 3 linhas * 1.5rem line-height = 4.5rem */}
          <p className="text-sm text-gray-900 font-fancy leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Preço - sempre na mesma posição */}
        <p className="text-lg font-bold font-fancy text-gray-900">
          R$ {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
