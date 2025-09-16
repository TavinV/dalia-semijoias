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

    const baseClasses = "rounded-full text-xs md:text-sm p-1 shadow text-center flex justify-center items-center min-w-[1.5rem] min-h-[1.5rem] md:min-w-[2rem] md:min-h-[2rem] font-title flex-shrink-0";

    if (metalLower === "ouro") {
        return (
            <div className={`${baseClasses} bg-[#EFBD52] text-white`}>
                {text}
            </div>
        );
    } else if (metalLower === "prata") {
        return (
            <div className={`${baseClasses} bg-[#EDE9E3] text-black`}>
                {text}
            </div>
        );
    } else if (metalLower === "outros") {
        return (
            <div className={`${baseClasses} bg-[#494949] text-white`}>
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
            className="flex flex-col overflow-hidden shadow-xl w-full font-title bg-white"
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
                {/* Título */}
                <h3
                    className="uppercase font-regular mb-4 text-ellipsis overflow-hidden whitespace-nowrap"
                    style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                    title={product.name}
                >
                    {product.name}
                </h3>

                {/* Infos + Botão */}
                <div className="flex flex-col justify-end flex-1">
                    {/* Infos */}
                    <div className="flex justify-between items-center gap-2">
                        <p className="whitespace-nowrap text-sm md:text-base">
                            Valor:
                            <span className="text-primary font-bold ml-1">
                                R$ {product.price.toFixed(2)}
                            </span>
                        </p>

                        <div className="text-sm md:text-base flex flex-col items-end gap-1">
                            <span className="hidden sm:block">Banhado:</span>
                            <MaterialBadge material={product.material} />
                        </div>
                    </div>

                    {/* Botão */}
                    <div className="mt-4 md:mt-8 w-full flex justify-center">
                        <Button text="Adicionar ao carrinho" onClick={handleAddToCart} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
