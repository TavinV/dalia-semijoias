import { useState, useEffect, useCallback } from "react";
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
        imageUrl: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const genderOptions = ["Masculino", "Feminino"];
    const materialOptions = ["Ouro 18k", "Prata 925"];
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
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                material: product.material,
                gender: product.gender,
                stock: product.stock,
                imageUrl: product.imageUrl,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let finalImage = formData.imageUrl;

        if (imageFile && croppedAreaPixels) {
            try {
                const croppedImageBlob = await getCroppedImg(imageFile, croppedAreaPixels);
                finalImage = new File([croppedImageBlob], "product.jpg", { type: "image/jpeg" });
            } catch (err) {
                setError("Erro ao processar a imagem");
                setLoading(false);
                return;
            }
        }

        const payload = new FormData();
        Object.entries({ ...formData, image: finalImage }).forEach(([key, value]) => {
            payload.append(key, value);
        });

        try {
            const res = await api.put("/products/" + product.dalia_id, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            if (res.data.success) {
                onSave(res.data.data);
                onClose();
            } else {
                console.log(res.data.message)
                setError(res.data.message || "Erro ao atualizar o produto");
            }
        } catch (err) {
            console.log(err)
            setError(err?.message || "Erro ao atualizar o produto");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-secondary w-full max-w-3xl p-6 rounded-xl shadow-xl relative overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-semibold mb-6 text-primary text-center">Editar Produto</h2>
                <button
                    className="absolute top-4 right-4 text-primary font-bold text-3xl hover:text-red-500 transition"
                    onClick={onClose}
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* ID DÁLIA */}
                    <div>
                        <label className="block text-sm mb-1 text-primary font-medium">ID DÁLIA</label>
                        <input
                            type="text"
                            value={product.dalia_id}
                            disabled
                            className="w-full border border-primary rounded-lg px-3 py-2 bg-gray-200 text-gray-700"
                        />
                    </div>

                    {/* Nome e Preço */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1 text-primary font-medium">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-primary font-medium">Preço</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm mb-1 text-primary font-medium">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border border-primary rounded-lg px-3 py-2 resize-none"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Categoria, Material, Gênero, Estoque */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm mb-1 text-primary font-medium">Categoria</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2 bg-white"
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
                            <label className="block text-sm mb-1 text-primary font-medium">Material</label>
                            <select
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2 bg-white"
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
                            <label className="block text-sm mb-1 text-primary font-medium">Gênero</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2 bg-white"
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
                            <label className="block text-sm mb-1 text-primary font-medium">Estoque</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full border border-primary rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* IMAGEM COM CROP */}
                    <div>
                        <label className="block text-sm mb-1 text-primary font-medium">Imagem</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
                        {imageFile && (
                            <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                                <Cropper
                                    image={imageFile}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-600 text-center">{error}</p>}

                    <button
                        type="submit"
                        className="bg-primary text-secondary py-3 rounded-lg font-medium hover:bg-primary/80 transition w-full"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
