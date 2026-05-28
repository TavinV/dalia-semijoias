// Catalog.jsx
import { useEffect, useState } from "react";
import Header from "../components/layout/Header.jsx";
import Banner from "../components/layout/Banner.jsx";
import Main from "../components/layout/Main.jsx";
import ProductsGrid from "../components/layout/ProductsGrid.jsx";
import Footer from "../components/layout/Footer.jsx";
import CatalogSkeleton from "../components/skeletons/CatalogSkeleton.jsx";

import { useProducts } from "../hooks/useProducts.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../components/skeletons/SkeletonCard.jsx";
import api from "../api/axios.js";

// Top 5 peças mais vendidas no mês (público)
const TopMesPublico = ({ products }) => {
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/sales/top-mes", { params: { limit: 5 } })
      .then((r) => {
        if (!cancelled) setTopItems(r.data.data || []);
      })
      .catch(() => {
        if (!cancelled) setTopItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || topItems.length === 0) return null;

  // Tenta achar o product pelo nome pra mostrar imagem
  const productByName = {};
  for (const p of products || []) {
    if (p.name) productByName[p.name.toLowerCase().trim()] = p;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="font-fancy text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
          Mais vendidos do mês
        </h2>
        <p className="font-fancy text-sm sm:text-base text-gray-500 mt-2">
          As favoritas das nossas clientes
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {topItems.map((t, idx) => {
          const matched = productByName[(t.name || "").toLowerCase().trim()];
          const img = matched?.images?.[0];
          return (
            <div
              key={`${t.name}-${idx}`}
              className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-[#967965] text-white text-xs font-bold flex items-center justify-center shadow">
                {idx + 1}
              </span>
              <div className="aspect-square bg-gray-100">
                {img ? (
                  <img
                    src={img}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-fancy">
                    ♡
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {t.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
        {/* Top 5 do mês (público) */}
        <TopMesPublico products={products} />

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
