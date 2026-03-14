// EditProductModal.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUpload,
  FiMove,
  FiPlus,
  FiSave,
  FiImage,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../api/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    material: "",
    gender: "",
    stock: "",
  });

  // Estado para múltiplas imagens
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const genderOptions = ["Masculino", "Feminino"];
  const materialOptions = ["Ouro 18k", "Prata 925", "Outros"];
  const categoryOptions = [
    "anéis",
    "body chains",
    "braceletes",
    "brincos",
    "chokers",
    "colares",
    "correntes",
    "piercings",
    "pulseiras",
    "tornozeleiras",
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        material: product.material || "",
        gender: product.gender || "",
        stock: product.stock || "",
      });

      // Carregar imagens existentes
      if (product.images && product.images.length > 0) {
        setExistingImages(
          product.images.map((img, index) => ({
            url: img,
            id: index,
            isExisting: true,
          })),
        );
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              file: file,
              preview: reader.result,
              croppedFile: null,
              order: prev.length + existingImages.length,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleImageCrop = async () => {
    if (currentImageIndex !== null && croppedAreaPixels) {
      try {
        const imageToCrop = images[currentImageIndex];
        const croppedImageBlob = await getCroppedImg(
          imageToCrop.preview,
          croppedAreaPixels,
        );

        const croppedFile = new File(
          [croppedImageBlob],
          `product-${currentImageIndex}.jpg`,
          { type: "image/jpeg" },
        );

        setImages((prev) =>
          prev.map((img, idx) =>
            idx === currentImageIndex
              ? {
                  ...img,
                  croppedFile,
                  preview: URL.createObjectURL(croppedFile),
                }
              : img,
          ),
        );

        setShowCropper(false);
        setCurrentImageIndex(null);
      } catch (err) {
        setError("Erro ao processar a imagem");
      }
    }
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
      setImagesToDelete((prev) => [...prev, existingImages[index].url]);
    } else {
      setImages((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const moveImage = (fromIndex, toIndex, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => {
        const newImages = [...prev];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        return newImages;
      });
    } else {
      setImages((prev) => {
        const newImages = [...prev];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        return newImages.map((img, idx) => ({
          ...img,
          order: idx + existingImages.length,
        }));
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar se há pelo menos uma imagem (existentes + novas)
    if (existingImages.length === 0 && images.length === 0) {
      setError("Adicione pelo menos uma imagem ao produto");
      setLoading(false);
      return;
    }

    const payload = new FormData();

    // Adicionar dados do formulário
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    // Combinar todas as imagens na ordem correta:
    // 1. Primeiro as imagens existentes (já ordenadas)
    // 2. Depois as novas imagens (já ordenadas)
    const allImages = [];

    // Adicionar URLs das imagens existentes (como strings)
    existingImages.forEach((img) => {
      allImages.push(img.url);
    });

    // Adicionar arquivos das novas imagens
    images.forEach((img) => {
      const imageToSend = img.croppedFile || img.file;
      allImages.push(imageToSend);
    });

    // Enviar todas as imagens no campo "images"
    // O backend deve ser capaz de distinguir entre URLs (strings) e arquivos (File)
    allImages.forEach((image) => {
      payload.append("images", image);
    });

    console.log("Payload preparado para envio:");
    console.log("Total de imagens:", allImages.length);
    console.log("Dados do formulário:", formData);

    try {
      const res = await api.put("/products/" + product.dalia_id, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onSave(res.data.data);
        onClose();
      } else {
        setError(res.data.message || "Erro ao atualizar o produto");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao atualizar o produto");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-5 flex items-center justify-between">
                <h2 className="font-fancy text-xl text-white">
                  Editar Produto
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FiX className="text-white" size={20} />
                </button>
              </div>

              {/* Conteúdo com scroll */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* ID DÁLIA */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                    ID DÁLIA
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {product.dalia_id}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome e Preço */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors"
                        placeholder="Ex: Anel de Ouro"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors"
                        placeholder="0,00"
                        required
                      />
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors resize-none"
                      placeholder="Descreva o produto em detalhes..."
                      required
                    />
                  </div>

                  {/* Categoria, Material, Gênero, Estoque */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors bg-white"
                        required
                      >
                        <option value="">Selecione</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material *
                      </label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors bg-white"
                        required
                      >
                        <option value="">Selecione</option>
                        {materialOptions.map((mat) => (
                          <option key={mat} value={mat}>
                            {mat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gênero *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors bg-white"
                        required
                      >
                        <option value="">Selecione</option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Seção de Imagens */}
                  <div className="border-t border-gray-100 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Imagens do Produto * (mínimo 1)
                    </label>

                    {/* Grid de imagens existentes */}
                    {existingImages.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-3">
                          Imagens atuais
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {existingImages.map((img, index) => (
                            <motion.div
                              key={img.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group aspect-square"
                            >
                              <img
                                src={img.url}
                                alt={`Produto ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveImage(index, index - 1, true)
                                    }
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#967965] hover:text-white transition-colors"
                                    title="Mover para esquerda"
                                  >
                                    ←
                                  </button>
                                )}
                                {index < existingImages.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveImage(index, index + 1, true)
                                    }
                                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#967965] hover:text-white transition-colors"
                                    title="Mover para direita"
                                  >
                                    →
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index, true)}
                                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                  title="Remover imagem"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grid de novas imagens */}
                    {images.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-3">
                          Novas imagens
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((img, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group aspect-square"
                            >
                              <img
                                src={img.preview}
                                alt={`Nova ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentImageIndex(index);
                                    setShowCropper(true);
                                  }}
                                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#967965] hover:text-white transition-colors"
                                  title="Cortar imagem"
                                >
                                  <FiMove size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                  title="Remover imagem"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botão para adicionar imagens */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#967965] hover:bg-[#967965]/5 transition-colors flex flex-col items-center justify-center gap-3"
                    >
                      <FiImage size={32} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Clique para adicionar mais imagens
                      </span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      multiple
                    />
                    <p className="text-xs text-gray-400 mt-3">
                      Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB por
                      imagem.
                    </p>
                  </div>

                  {/* Mensagem de erro */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                      >
                        <FiAlertCircle
                          className="text-red-500 flex-shrink-0"
                          size={18}
                        />
                        <p className="text-sm text-red-600">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botões de ação */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                                                flex-1 px-6 py-3 rounded-lg font-fancy
                                                flex items-center justify-center gap-2
                                                transition-all duration-300
                                                ${
                                                  loading
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-[#967965] hover:bg-[#7A5F4F] text-white shadow-lg hover:shadow-xl"
                                                }
                                            `}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <FiSave size={18} />
                          <span>Salvar Alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Modal de Crop */}
          <AnimatePresence>
            {showCropper && currentImageIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                onClick={() => setShowCropper(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-xl p-6 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-fancy text-xl text-gray-900 mb-4">
                    Ajustar imagem
                  </h3>

                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Cropper
                      image={images[currentImageIndex].preview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCropper(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleImageCrop}
                      className="px-6 py-2 bg-[#967965] text-white rounded-lg hover:bg-[#7A5F4F] transition-colors"
                    >
                      Aplicar corte
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProductModal;
