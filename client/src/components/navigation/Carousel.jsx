import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import ImageCard from "../ui/ImageCard";

const Carousel = () => {
    const carouselRef = useRef(null);

    const items = [
        { image: "/anel-section.png", title: "ANÉIS", description: "CONFIRA NOSSOS ANÉIS EXCLUSIVOS"},
        { image: "/bodychains-section.png", title: "BODY CHAINS", description: "CONFIRA NOSSAS BODY CHAINS EXCLUSIVAS"},
        { image: "/braceletes-section.png", title: "BRACELETES", description: "CONFIRA NOSSOS BRACELETES EXCLUSIVOS" },
        { image: "/brincos-section.png", title: "BRINCOS", description: "CONFIRA NOSSOS BRINCOS EXCLUSIVOS" },
        { image: "/chokers-section.png", title: "CHOKERS", description: "CONFIRA NOSSAS CHOKERS EXCLUSIVAS"},
        { image: "/colares-section.png", title: "COLARES", description: "CONFIRA NOSSOS COLARES EXCLUSIVAS"},
        { image: "/correntes-section.png", title: "CORRENTES", description: "CONFIRA NOSSAS CORRENTES EXCLUSIVAS"},
        { image: "/masculino-section.jpg", title: "MASCULINO", description: "CONFIRA NOSSOS ITENS MASCULINOS"},
        { image: "/piercings-section.png", title: "PIERCINGS", description: "CONFIRA NOSSOS PIERCINGS EXCLUSIVAS"},
        { image: "/pulseiras-section.png", title: "PULSEIRAS", description: "CONFIRA NOSSAS PULSEIRAS EXCLUSIVAS"},
        { image: "/tornozeleiras-section.png", title: "TORNOZELEIRAS", description: "CONFIRA NOSSAS TORNOZELEIRAS"},
    ];

    const scrollLeft = () => {
        carouselRef.current.scrollBy({
            left: -carouselRef.current.offsetWidth / 2,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({
            left: carouselRef.current.offsetWidth / 2,
            behavior: "smooth",
        });
    };

    return (
        <div className="no-scrollbar relative w-full flex items-center justify-center">
            {/* Botões sobre os cards */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 w-12 h-12 -ml-6 rounded-full border-2 border-color-secondary bg-[#BE8F6E] text-white flex items-center justify-center hover:scale-110 transition"
            >
                <BiChevronLeft size={24} />
            </button>
            <button
                onClick={scrollRight}
                className="absolute right-0 z-10 w-12 h-12 -mr-6 rounded-full border-2 border-color-secondary bg-[#BE8F6E] text-white flex items-center justify-center hover:scale-110 transition"
            >
                <BiChevronRight size={24} />
            </button>

            {/* Container dos cards */}
            <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-scroll px-4 snap-x snap-mandatory scroll-smooth no-scrollbar justify-start"
            >
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="
                        
              flex-shrink-0 snap-center
              w-56        /* 1 card em mobile */
              sm:w-64     /* 2 cards em small */
              md:w-72     /* 3 cards em medium */
              lg:w-80     /* 4 cards em large */
            "
                    >
                        <ImageCard
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            onClick={() => {alert(item.title)}}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
