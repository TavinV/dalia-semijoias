const ImageCard = ({ image, title, description, onClick}) => {
    return (
        <div className="relative w-full aspect-[3/4] overflow-hidden shadow-lg hover:scale-95 hover:shadow-2xl transition-all ease-in cursor-pointer" onClick={onClick}>
            {/* Imagem de fundo */}
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover bg-center"
            />

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Conteúdo */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-white flex flex-col items-center text-center">
                <h3 className="font-title text-2xl sm:text-3xl uppercase font-regular">
                    {title}
                </h3>
                <p className="text-lg sm:text-xl font-regular uppercase font-title">
                    {description}
                </p>
            </div>

        </div>
    );
};

export default ImageCard;
