const Banner = () => {
    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div
            className="w-screen h-auto cursor-pointer"
            onClick={() => handleScrollTo("nosso-catalogo")}
        >
            <picture>
                {/* Telas pequenas */}
                <source media="(max-width: 768px)" srcSet="/banner-mobile.png" />
                {/* Telas grandes */}
                <img srcSet="/desktop-banner.png" className="w-screen h-auto" alt="Dália Semijoias" />
            </picture>
        </div>
    );
};

export default Banner;
