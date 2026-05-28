import Marquee from "./Marquee.jsx";

const Banner = () => {
    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="w-full">
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

            {/* Letreiro em onda */}
            <Marquee />

            {/* CTA — Veja nossa coleção */}
            <div className="flex justify-center py-6 sm:py-8 bg-[#EDE9E3]">
                <button
                    onClick={() => handleScrollTo("nosso-catalogo")}
                    className="group inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-3.5 border border-[#967965] text-[#967965] hover:bg-[#967965] hover:text-white transition-all duration-300 font-fancy text-sm sm:text-base uppercase tracking-[0.25em]"
                >
                    Veja nossa coleção
                    <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                </button>
            </div>
        </div>
    );
};

export default Banner;
