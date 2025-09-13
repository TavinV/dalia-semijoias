const Banner = () =>{
    return (
        <div href="#" className="w-screen h-auto mt-8">
            <picture>
                {/* Telas pequenas */}
                <source media="(max-width: 768px)" srcSet="/mobile-banner.png" className="w-screen h-auto"/>
                
                {/* Telas grandes */}
                <img srcSet="/banner.png" className="w-screen h-auto"/>
            </picture>
        </div>
    );
}

export default Banner;