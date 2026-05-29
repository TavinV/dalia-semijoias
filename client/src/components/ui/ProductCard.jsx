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

  // Quando a peça vem em "Ambas", o cliente escolhe entre Ouro 18k e Prata 925
  const isAmbas = product.material === "Ambas";
  const [selectedMaterial, setSelectedMaterial] = useState(
    isAmbas ? "Ouro 18k" : product.material,
  );

  const images = product.images || [product.imageUrl];
  const hasMultipleImages = images.length > 1;

  // Em "Ambas": imagens 0..goldCount-1 são Ouro, goldCount..fim são Prata.
  // Ao trocar o material, vai pra primeira foto da seção correspondente.
  const handlePickMaterial = (mat) => {
    setSelectedMaterial(mat);
    if (!isAmbas) return;
    const goldCount = Math.max(0, Number(product.imagesGoldCount) || 0);
    if (mat === "Ouro 18k") {
      setCurrentImageIndex(0);
    } else if (mat === "Prata 925") {
      if (goldCount > 0 && goldCount < images.length) {
        setCurrentImageIndex(goldCount);
      } else if (images.length > 1) {
        // fallback (produto antigo sem imagesGoldCount): assume 2ª foto = Prata
        setCurrentImageIndex(1);
      }
    }
  };
  const buttonColor = "#967965";
  const buttonColorDarker = "#6B5847";

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const matFinal = isAmbas ? selectedMaterial : product.material;
    const item = {
      id: `${product.dalia_id}${isAmbas ? `-${matFinal.replace(/\s+/g, "_")}` : ""}`,
      productId: product.dalia_id,
      name: product.name,
      material: matFinal,
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

  const formattedPrice = `R$ ${product.price.toFixed(2).replace(".", ",")}`;

  return (
    <div
      id={id}
      className="relative w-full group flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Container da Imagem — quadrada, fundo branco limpo (estilo Murano) */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <motion.div
          ref={imageRef}
          className="relative w-full h-full"
          onClick={handleImageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          animate={{ scale: isZoomed ? 2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                  backgroundColor: "rgba(36, 31, 25, 0.9)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <motion.span
                  initial={{ scale: 0.8, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: -10 }}
                  className="text-white text-xs sm:text-base font-default font-light tracking-[0.2em] uppercase text-center px-2"
                >
                  Adicionado ao carrinho
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Setas de navegação — só desktop */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevImage}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
              aria-label="Imagem anterior"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Próxima imagem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Indicadores de carrossel */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-1 transition-all duration-300 ${
                  index === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white/80"
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

      {/* Informações do produto — estilo Murano: sans-serif limpo */}
      <div className="pt-2 sm:pt-4 pb-3 sm:pb-5 px-0">
        {/* Nome — 1 linha truncada, sans regular */}
        <h3
          className="text-[13px] sm:text-base font-default font-normal text-gray-900 mb-1.5 sm:mb-2 truncate leading-tight"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Seletor de material (Ambas) — discreto sans */}
        {isAmbas && (
          <div className="mb-2 sm:mb-3">
            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {["Ouro 18k", "Prata 925"].map((mat) => {
                const active = selectedMaterial === mat;
                return (
                  <button
                    key={mat}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePickMaterial(mat);
                    }}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-default rounded-full border transition-all ${
                      active
                        ? "bg-[#241F19] text-white border-[#241F19]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#241F19] hover:text-[#241F19]"
                    }`}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Linha Preço + Botão ADICIONAR — estilo Murano, compacto */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <p className="text-[13px] sm:text-base font-default font-normal text-gray-900 leading-none whitespace-nowrap shrink-0">
            {formattedPrice}
          </p>
          <motion.button
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            className="inline-flex items-center gap-1.5 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-1.5 bg-[#241F19] hover:bg-black rounded-full text-white shrink-0"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:w-3.5 sm:h-3.5"
            >
              <path
                d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z M3 6H21 M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline text-[10px] font-default font-medium uppercase">
              Adicionar
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
