// CreateProductForm.jsx
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiImage, FiPlus, FiMove } from "react-icons/fi";
import api from "../../api/axios.js";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage.js";

const CreateProductForm = () => {
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
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fileInputRef = useRef(null);

  const genderOptions = ["Masculino", "Feminino"];
  const materialOptions = ["Ouro 18k", "Prata 925", "Outros"];
  const categoryOptions = [
    "anéis",
    "brincos",
    "braceletes",
    "colares",
    "piercings",
    "pulseiras",
    "tornozeleiras",
  ];

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
              order: prev.length,
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

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    if (currentImageIndex === index) {
      setShowCropper(false);
      setCurrentImageIndex(null);
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    setImages((prev) => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages.map((img, idx) => ({ ...img, order: idx }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validar se há pelo menos uma imagem
    if (images.length === 0) {
      setError("Adicione pelo menos uma imagem ao produto");
      setLoading(false);
      return;
    }

    const payload = new FormData();

    // Adicionar dados do formulário
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    // Adicionar múltiplas imagens
    images.forEach((img, index) => {
      const imageToSend = img.croppedFile || img.file;
      payload.append("images", imageToSend);
    });

    try {
      const res = await api.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccessMessage("Produto cadastrado com sucesso!");
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          material: "",
          gender: "",
          stock: "",
        });
        setImages([]);
        setCurrentImageIndex(null);
        setShowCropper(false);
      } else {
        setError(res.data.message || "Erro ao cadastrar o produto");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao cadastrar o produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#967965] to-[#7A5F4F] px-6 py-8 sm:px-10">
            <h1 className="font-fancy text-2xl sm:text-3xl text-white">
              Cadastrar Novo Produto
            </h1>
            <p className="text-white/80 text-sm mt-2">
              Preencha os dados abaixo para adicionar um novo produto ao
              catálogo
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10">
            {/* Mensagens de feedback */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-600 text-sm">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
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
                  minLength="10"
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

                {/* Grid de uploads */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square"
                    >
                      <img
                        src={img.preview}
                        alt={`Produto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
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
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, index - 1)}
                          className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#967965] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Mover para esquerda"
                        >
                          ←
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, index + 1)}
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#967965] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Mover para direita"
                        >
                          →
                        </button>
                      )}
                    </motion.div>
                  ))}

                  {/* Botão para adicionar mais imagens */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#967965] hover:bg-[#967965]/5 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <FiPlus size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Adicionar</span>
                  </button>
                </div>

                {/* Input file oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  multiple
                />
                <p className="text-xs text-gray-400 mt-2">
                  Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB por imagem.
                </p>
              </div>

              {/* Botão de submit */}
              <button
                type="submit"
                disabled={loading}
                className={`
                                    w-full py-4 px-6 rounded-lg font-fancy text-base
                                    flex items-center justify-center gap-2
                                    transition-all duration-300 mt-8
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
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={18} />
                    <span>Cadastrar Produto</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Modal de Crop */}
      <AnimatePresence>
        {showCropper && currentImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
    </div>
  );
};

export default CreateProductForm;
