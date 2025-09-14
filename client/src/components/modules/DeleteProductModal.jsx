import React, { useState } from "react";
import api from "../../api/axios";

const DeleteProductModal = ({ product, isOpen, onClose, onDeleteSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !product) return null;

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.delete(`/products/${product.dalia_id}`);
            if (res.data.success) {
                onDeleteSuccess(product.dalia_id);
                onClose();
            } else {
                setError(res.data.message || "Erro ao excluir o produto");
            }
        } catch (err) {
            setError(err?.message || "Erro ao excluir o produto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary w-full max-w-md p-6 rounded-xl shadow-xl relative">
                <h2 className="text-2xl font-semibold mb-4 text-primary text-center">Confirmar Exclusão</h2>
                <p className="text-center text-gray-700 mb-6">
                    Tem certeza que deseja excluir o produto <strong>{product.name}</strong>?
                </p>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Excluindo..." : "Excluir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;
