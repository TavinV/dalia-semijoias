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
    }

    return null;
};

const ProductCard = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        const item = {
            id: product.dalia_id,
            name: product.name,
            material: product.material,
            price: product.price,
            stock: product.stock,
            image: `http://localhost:3000/uploads/${product.imageUrl}`,
        };
        addItem(item);
    };

    return (
        <div className="flex flex-col overflow-hidden shadow-xl w-full font-title">
            {/* Imagem (cobre a parte superior, sem padding) */}
            <div className="aspect-square w-full relative">
                <img
                    src={`http://localhost:3000/uploads/${product.imageUrl}`}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Conteúdo inferior */}
            <div className="flex flex-col flex-1 justify-between p-4 bg-[#F0F0F0]">
                <div>
                    <h3
                        className="uppercase font-regular"
                        style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                    >
                        {product.name}
                    </h3>

                    <div className="w-full flex justify-between mt-4 md:mt-8 gap-4 md:gap-0">
                        <p style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)" }}>
                            Valor: <br />
                            <span
                                className="text-primary font-bold"
                                style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}
                            >
                                R$ {product.price.toFixed(2)}
                            </span>
                        </p>

                        <div className="text-sm md:text-base flex flex-col items-start md:items-end">
                            <span>Banhado a</span>
                            <MaterialBadge material={product.material} />
                        </div>
                    </div>
                </div>

                {/* Botão */}
                <div className="mt-4 md:mt-8 w-full flex justify-center">
                    <Button text="Adicionar ao carrinho" onClick={handleAddToCart} />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
