import { useCart } from "../../hooks/useCart";

const Button = ({ text, onClick }) => {
    return (
        <button
            className="font-title border border-dark-accent w-full py-2 px-4 rounded-[3px] hover:scale-102 active:scale-95 transition-all ease-in
                 overflow-hidden text-ellipsis"
            onClick={onClick}
            style={{
                fontSize: "clamp(0.7rem, 2vw, 1rem)", // menor valor para caber em telas pequenas
                whiteSpace: "nowrap",
            }}
        >
            {text}
        </button>
    );
};

const MaterialBadge = ({ material }) => {
    const [metal, type] = material.split(" ");
    const metalLower = metal.toLowerCase();
    const text = type;

    if (metalLower === "ouro") {
        return (
            <div className="rounded-full text-xs md:text-sm p-1 md:p-2 shadow bg-[#EFBD52] text-center flex justify-center items-center w-6 h-6 md:w-8 md:h-8 text-white font-title">
                {text}
            </div>
        );
    } else if (metalLower === "prata") {
        return (
            <div className="rounded-full text-xs md:text-sm p-1 md:p-2 shadow bg-[#EDE9E3] text-center flex justify-center items-center w-6 h-6 md:w-8 md:h-8 font-title">
                {text}
            </div>
        );
    } else if (metalLower === "outros") {
        return (
            <div className="rounded-full text-xs md:text-sm p-1 md:p-2 shadow bg-[#494949] text-center text-white flex justify-center items-center w-6 h-6 md:w-8 md:h-8 font-title">
                N/A
            </div>
        );
    }

    return null;
};

const ProductCard = ({ id, product }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        const item = {
            id: product.dalia_id,
            name: product.name,
            material: product.material,
            price: product.price,
            stock: product.stock,
            image: product.imageUrl,
        };
        addItem(item);
    };

    return (
        <div
            id={id}
            className="flex flex-col overflow-hidden shadow-xl w-full font-title"
        >
            {/* Imagem */}
            <div className="aspect-square w-full relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Conteúdo inferior */}
            <div className="flex flex-col flex-1 p-4 bg-[#F0F0F0]">
                {/* Topo: título */}
                <h3
                    className="uppercase font-regular mb-4"
                    style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                >
                    {product.name}
                </h3>

                {/* Base: infos + botão (sempre alinhados no fundo) */}
                <div className="flex flex-col justify-end flex-1">
                    {/* Infos (preço + material) */}
                    <div className="flex justify-between gap-4 md:gap-0">
                        <p style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)" }}>
                            Valor: <br />
                            <span
                                className="text-primary font-bold"
                                style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.3rem)" }}
                            >
                                R$ {product.price.toFixed(2)}
                            </span>
                        </p>

                        <div className="text-sm md:text-base flex flex-col items-start md:items-end gap-2">
                            <span>Banhado:</span>
                            <MaterialBadge material={product.material} />
                        </div>
                    </div>

                    {/* Botão (sempre embaixo) */}
                    <div className="mt-4 md:mt-8 w-full flex justify-center">
                        <Button text="Adicionar ao carrinho" onClick={handleAddToCart} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;
