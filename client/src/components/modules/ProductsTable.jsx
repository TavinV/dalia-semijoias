// ProductsTable.jsx
import { useState, useEffect } from "react";
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

    // Inicializa o estado local com os produtos do hook
    useEffect(() => {
        if (products) setProductsState(products);
    }, [products]);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        setDeleteProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSuccess = (deletedId) => {
        // Remove localmente sem refetch completo
        setProductsState((prev) => prev.filter(p => p.dalia_id !== deletedId));
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
                p.dalia_id === updatedProduct.dalia_id ? { ...p, ...updatedProduct } : p
            )
        );
    };

    if (loading) return <p>Carregando produtos...</p>;
    if (error) return <p>Erro ao carregar produtos: {error}</p>;

    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-[900px] md:min-w-full border-collapse bg-secondary">
                <thead>
                    <tr className="bg-primary text-secondary">
                        <th className="p-4 text-left">Imagem</th>
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">ID DÁLIA</th>
                        <th className="p-4 text-left hidden sm:table-cell">Descrição</th>
                        <th className="p-4 text-left">Preço</th>
                        <th className="p-4 text-left hidden md:table-cell">Categoria</th>
                        <th className="p-4 text-left hidden md:table-cell">Material</th>
                        <th className="p-4 text-left hidden md:table-cell">Gênero</th>
                        <th className="p-4 text-left">Estoque</th>
                        <th className="p-4 text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {productsState.map((product) => (
                        <tr key={product.id} className="even:bg-[#F3F3F3] hover:bg-primary/10">
                            <td className="p-2 md:p-4">
                                <img
                                    src={`https://dalia-semijoias-api.onrender.com/uploads/${product.imageUrl}`}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover"
                                />
                            </td>
                            <td className="p-2 md:p-4">{product.name}</td>
                            <td className="p-2 md:p-4">{product.dalia_id}</td>
                            <td className="p-2 md:p-4 hidden sm:table-cell">{product.description}</td>
                            <td className="p-2 md:p-4">R$ {product.price.toFixed(2)}</td>
                            <td className="p-2 md:p-4 hidden md:table-cell">{product.category}</td>
                            <td className="p-2 md:p-4 hidden md:table-cell">{product.material}</td>
                            <td className="p-2 md:p-4 hidden md:table-cell">{product.gender}</td>
                            <td className="p-2 md:p-4">{product.stock}</td>
                            <td className="p-2 md:p-4 flex flex-col justify-center gap-1">
                                <button
                                    className="bg-primary text-secondary px-2 py-1 flex items-center rounded hover:bg-primary/80 transition"
                                    onClick={() => handleEditClick(product)}
                                >
                                    <i className="fas fa-edit mr-1"></i> Editar
                                </button>
                                <button 
                                    className="bg-secondary text-primary px-2 py-1 flex items-center rounded hover:bg-secondary/80 transition"
                                    onClick={() => {handleDeleteClick(product)}}
                                >
                                    <i className="fas fa-trash mr-1"></i> Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleSave}
                />
            )}
            {
                isDeleteModalOpen && deleteProduct && (
                    <DeleteProductModal 
                        product={deleteProduct} 
                        isOpen={isDeleteModalOpen} 
                        onDeleteSuccess={handleDeleteSuccess} 
                        onClose={handleDeleteModalClose}
                    />
                )
            }
        </div>
    );
};

export default ProductsTable;
