const Banner = () => {
    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div
            className="w-screen cursor-pointer overflow-hidden aspect-[16/9] sm:aspect-auto sm:h-auto"
            onClick={() => handleScrollTo("nosso-catalogo")}
        >
            <picture className="block w-full h-full">
                {/* Telas pequenas */}
                <source media="(max-width: 768px)" srcSet="/hero-banner.jpg?v=2" />
                {/* Telas grandes */}
                <img
                    srcSet="/hero-banner.jpg?v=2"
                    className="w-full h-full sm:h-auto object-cover object-center"
                    alt="Dália Semijoias"
                />
            </picture>
        </div>
    );
};

export default Banner;
