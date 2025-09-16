const Banner = () => {
    const handleScrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div 
            className="w-screen h-auto mt-8 cursor-pointer"
            onClick={() => handleScrollTo("carousel")} 
        >
            <picture>
                {/* Telas pequenas */}
                <source media="(max-width: 768px)" srcSet="/mobile-banner.png" className="w-screen h-auto" />
                
                {/* Telas grandes */}
                <img srcSet="/desktop-banner.png" className="w-screen h-auto" />
            </picture>
        </div>
    );
}

export default Banner;
