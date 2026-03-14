// ProductsTable.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";
import { useProducts } from "../../hooks/useProducts";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

const ProductsTable = () => {
  const { products, loading, error } = useProducts();
  const [productsState, setProductsState] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    if (products) setProductsState(products);
  }, [products]);

  // Extrair categorias únicas
  const categories = [
    "todos",
    ...new Set(productsState.map((p) => p.category).filter(Boolean)),
  ];

  // Filtrar produtos
  const filteredProducts = productsState.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dalia_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "todos" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (deletedId) => {
    setProductsState((prev) => prev.filter((p) => p.dalia_id !== deletedId));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteProduct(null);
  };

  const handleSave = (updatedProduct) => {
    setProductsState((prev) =>
      prev.map((p) =>
        p.dalia_id === updatedProduct.dalia_id
          ? { ...p, ...updatedProduct }
          : p,
      ),
    );
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          Sem estoque
        </span>
      );
    } else if (stock < 5) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
          Estoque baixo
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Disponível
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-[#967965] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-fancy">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FiAlertCircle size={32} className="text-red-600" />
        </div>
        <p className="text-red-600 font-medium mb-2">
          Erro ao carregar produtos
        </p>
        <p className="text-gray-500 text-sm">
          {error.message || String(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Barra de filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nome, ID ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#967965] transition-colors text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Filtro por categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <FiFilter className="text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#967965] bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "todos" ? "Todas categorias" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produto" : "produtos"} encontrados
          </div>
        </div>
      </div>

      {/* Tabela */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage size={32} className="text-gray-400" />
          </div>
          <h3 className="font-fancy text-lg text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 text-sm">
            Tente ajustar seus filtros ou adicionar novos produtos.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th
                      className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#967965]"
                      onClick={() => handleSort("name")}
                    >
                      Nome {getSortIcon("name")}
                    </th>
                    <th
                      className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#967965]"
                      onClick={() => handleSort("dalia_id")}
                    >
                      ID Dália {getSortIcon("dalia_id")}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Descrição
                    </th>
                    <th
                      className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#967965]"
                      onClick={() => handleSort("price")}
                    >
                      Preço {getSortIcon("price")}
                    </th>
                    <th
                      className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell cursor-pointer hover:text-[#967965]"
                      onClick={() => handleSort("category")}
                    >
                      Categoria {getSortIcon("category")}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Material
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Gênero
                    </th>
                    <th
                      className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#967965]"
                      onClick={() => handleSort("stock")}
                    >
                      Estoque {getSortIcon("stock")}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {paginatedProducts.map((product, index) => (
                      <motion.tr
                        key={product.id || product.dalia_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FiPackage className="text-gray-400" size={20} />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {product.name || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {product.dalia_id || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                            {product.description || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {product.price
                              ? `R$ ${Number(product.price).toFixed(2)}`
                              : "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-sm text-gray-600">
                            {product.category || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-sm text-gray-600">
                            {product.material || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-sm text-gray-600">
                            {product.gender || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStockBadge(product.stock)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                              title="Editar"
                            >
                              <FiEdit2
                                size={16}
                                className="text-gray-500 group-hover:text-[#967965]"
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                              title="Excluir"
                            >
                              <FiTrash2
                                size={16}
                                className="text-gray-500 group-hover:text-red-600"
                              />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#967965] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={16} />
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#967965] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Resumo da página */}
          <div className="mt-4 text-xs text-gray-400 text-right">
            Mostrando {startIndex + 1} a{" "}
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} de{" "}
            {filteredProducts.length} produtos
          </div>
        </>
      )}

      {/* Modais */}
      {isModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
      {isDeleteModalOpen && deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          isOpen={isDeleteModalOpen}
          onDeleteSuccess={handleDeleteSuccess}
          onClose={handleDeleteModalClose}
        />
      )}
    </div>
  );
};

export default ProductsTable;
