// Catalog.jsx
import { useState } from "react";
import Header from "../components/layout/Header.jsx";
import Banner from "../components/layout/Banner.jsx";
import Main from "../components/layout/Main.jsx";
import ProductsGrid from "../components/layout/ProductsGrid.jsx";
import Footer from "../components/layout/Footer.jsx";
import CatalogSkeleton from "../components/skeletons/CatalogSkeleton.jsx";

import { useProducts } from "../hooks/useProducts.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../components/skeletons/SkeletonCard.jsx";

function Catalog() {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("todos");

  if (!loading && error) {
    navigate("/error?message=" + error);
  }

  // Lista de categorias disponíveis
  const categories = [
    { id: "todos", label: "Todos" },
    { id: "anéis", label: "Anéis" },
    { id: "brincos", label: "Brincos" },
    { id: "colares", label: "Colares" },
    { id: "pulseiras", label: "Pulseiras" },
    { id: "braceletes", label: "Braceletes" },
    { id: "piercings", label: "Piercings Fake" },
    { id: "masculino", label: "Masculino" },
  ];

  // Filtra produtos por categoria
  const filteredProducts =
    selectedCategory === "todos"
      ? products
      : selectedCategory === "masculino"
        ? products?.filter((p) => p.gender?.toLowerCase() === "masculino")
        : products?.filter((p) => {
            const categorySlug = p.category?.toLowerCase().replace(/\s+/g, "");
            return categorySlug === selectedCategory;
          });

  return (
    <>
      <Header />
      <Banner />

      <Main>
        {/* Cabeçalho do catálogo */}
        <div className="w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center space-y-4">
            <h1 className="font-fancy text-3xl sm:text-4xl md:text-5xl text-gray-900 tracking-tight">
              Nosso catálogo
            </h1>
            <p className="font-fancy text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              Peças selecionadas com carinho para você
            </p>
          </div>

          {/* Filtros por categoria */}
          <div className="mt-10 sm:mt-12">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled={loading}
                  className={`
                    px-5 sm:px-6 py-2.5 sm:py-3 
                    text-sm sm:text-base font-fancy
                    transition-all duration-300 ease-in-out
                    ${
                      selectedCategory === category.id
                        ? "bg-[#967965] text-white shadow-md hover:bg-[#7a6150]"
                        : "bg-transparent text-gray-600 hover:text-[#967965] hover:bg-[#967965]/5"
                    }
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de produtos com skeleton loading */}
        <div className="px-4 sm:px-6 lg:px-8 pb-0">
          {loading ? (
            <CatalogSkeleton count={20} />
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <ProductsGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-16">
              <p className="font-fancy text-gray-400 text-lg">
                Nenhum produto encontrado nesta categoria
              </p>
            </div>
          )}
        </div>
      </Main>

      <Footer />
    </>
  );
}

export default Catalog;
