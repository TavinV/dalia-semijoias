import { useState, useCallback } from "react";
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

    const [imageFile, setImageFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
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
        setSuccessMessage(null);

        let finalImage = null;

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
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value);
        });
        if (finalImage) payload.append("image", finalImage);

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
                setImageFile(null);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCroppedAreaPixels(null);
            } else {
                setError(res.data.message || "Erro ao cadastrar o produto");
            }
        } catch (err) {
            setError(err?.message || "Erro ao cadastrar o produto");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="bg-[#F3F3F3] w-full max-w-3xl p-8 rounded-xl shadow-xl">
                <h1 className="text-3xl font-semibold text-primary text-center mb-6">
                    Cadastrar Produto
                </h1>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                            minlength="10"
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
                                    <option key={cat} value={cat}>{cat}</option>
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
                                    <option key={mat} value={mat}>{mat}</option>
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
                                    <option key={g} value={g}>{g}</option>
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mb-2"
                            required
                        />
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

                    <button
                        type="submit"
                        className="bg-primary text-secondary py-3 rounded-lg font-medium hover:bg-primary/80 transition w-full"
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Cadastrar Produto"}
                    </button>
                </form>
            </div>
    );
};

export default CreateProductForm;
