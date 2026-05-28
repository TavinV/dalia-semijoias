// Catalog.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import Banner from "../components/layout/Banner.jsx";
import Main from "../components/layout/Main.jsx";
import ProductsGrid from "../components/layout/ProductsGrid.jsx";
import Footer from "../components/layout/Footer.jsx";
import CatalogSkeleton from "../components/skeletons/CatalogSkeleton.jsx";

import { useProducts } from "../hooks/useProducts.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import SkeletonCard from "../components/skeletons/SkeletonCard.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import api from "../api/axios.js";

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

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
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("cat") || "todos";
  const setSelectedCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "todos") next.delete("cat");
    else next.set("cat", cat);
    setSearchParams(next, { replace: true });
  };
  const [selectedMaterial, setSelectedMaterial] = useState("todos");
  const [selectedGender, setSelectedGender] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(null);

  if (!loading && error) {
    navigate("/error?message=" + error);
  }

  // Categorias visíveis no catálogo público
  const categories = [
    { id: "todos", label: "Todos" },
    { id: "anéis", label: "Anéis" },
    { id: "body chains", label: "Body Chains" },
    { id: "braceletes", label: "Braceletes" },
    { id: "brincos", label: "Brincos" },
    { id: "chokers", label: "Chokers" },
    { id: "colares", label: "Colares" },
    { id: "correntes", label: "Correntes" },
    { id: "lenços", label: "Lenços" },
    { id: "piercings", label: "Piercings" },
    { id: "pulseiras", label: "Pulseiras" },
    { id: "tornozeleiras", label: "Tornozeleiras" },
  ];

  const materials = [
    { id: "todos", label: "Todos" },
    { id: "Ouro 18k", label: "Ouro 18k" },
    { id: "Prata 925", label: "Prata 925" },
    { id: "Outros", label: "Outros" },
  ];

  const genders = [
    { id: "todos", label: "Todos" },
    { id: "feminino", label: "Feminino" },
    { id: "masculino", label: "Masculino" },
    { id: "unissex", label: "Unissex" },
  ];

  // Limite do slider de preço (arredonda pra cima de 50 em 50)
  const priceCap = useMemo(() => {
    const max = (products || []).reduce(
      (acc, p) => Math.max(acc, Number(p.price) || 0),
      0,
    );
    if (max <= 0) return 0;
    return Math.ceil(max / 50) * 50;
  }, [products]);

  // Inicializa maxPrice quando os produtos carregarem
  useEffect(() => {
    if (priceCap > 0 && maxPrice === null) {
      setMaxPrice(priceCap);
    }
  }, [priceCap, maxPrice]);

  const norm = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .trim();

  // Filtra produtos por TODOS os filtros ativos
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (selectedCategory !== "todos") {
        if (norm(p.category) !== norm(selectedCategory)) return false;
      }
      if (selectedMaterial !== "todos") {
        if (p.material !== selectedMaterial) return false;
      }
      if (selectedGender !== "todos") {
        if (norm(p.gender) !== norm(selectedGender)) return false;
      }
      if (maxPrice !== null && Number(p.price) > maxPrice) return false;
      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedMaterial,
    selectedGender,
    maxPrice,
  ]);

  const limparFiltros = () => {
    setSelectedCategory("todos");
    setSelectedMaterial("todos");
    setSelectedGender("todos");
    setMaxPrice(priceCap || null);
  };

  const algumFiltroAtivo =
    selectedCategory !== "todos" ||
    selectedMaterial !== "todos" ||
    selectedGender !== "todos" ||
    (maxPrice !== null && maxPrice < priceCap);

  // 3 categorias com mais produtos cadastrados (showcase)
  const showcaseCategorias = useMemo(() => {
    const counts = {};
    for (const p of products || []) {
      const c = p.category;
      if (!c) continue;
      counts[c] = (counts[c] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  }, [products]);

  // Top 3 mais caros por categoria
  const topPorCategoria = useMemo(() => {
    const map = {};
    for (const cat of showcaseCategorias) {
      map[cat] = (products || [])
        .filter((p) => p.category === cat)
        .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
        .slice(0, 3);
    }
    return map;
  }, [products, showcaseCategorias]);

  const labelDaCategoria = (cat) =>
    categories.find((c) => c.id === cat)?.label || cat;

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

          {/* Filtros — material + gênero + preço (categoria fica no SearchBar) */}
          <div className="mt-10 sm:mt-12 space-y-6">
            {/* Indicador de categoria ativa (se houver) */}
            {selectedCategory !== "todos" && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-fancy">
                  Categoria selecionada:
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967965] text-white rounded-full text-sm font-fancy">
                  {categories.find((c) => c.id === selectedCategory)?.label ||
                    selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("todos")}
                    className="hover:text-white/70 transition-colors"
                    aria-label="Remover filtro de categoria"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}

            {/* Material + Gênero lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 text-center mb-3 font-fancy">
                  Material
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMaterial(m.id)}
                      disabled={loading}
                      className={`px-4 py-1.5 text-sm font-fancy rounded-full border transition-all ${
                        selectedMaterial === m.id
                          ? "bg-[#967965] text-white border-[#967965]"
                          : "bg-transparent text-gray-600 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 text-center mb-3 font-fancy">
                  Gênero
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {genders.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGender(g.id)}
                      disabled={loading}
                      className={`px-4 py-1.5 text-sm font-fancy rounded-full border transition-all ${
                        selectedGender === g.id
                          ? "bg-[#967965] text-white border-[#967965]"
                          : "bg-transparent text-gray-600 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider de preço */}
            {priceCap > 0 && (
              <div className="max-w-xl mx-auto px-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-fancy">
                    Faixa de preço
                  </p>
                  <p className="text-sm font-fancy text-[#967965]">
                    Até {formatBRL(maxPrice ?? priceCap)}
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={priceCap}
                  step={10}
                  value={maxPrice ?? priceCap}
                  onChange={(e) =>
                    setMaxPrice(parseInt(e.target.value, 10))
                  }
                  className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#967965]"
                  style={{
                    background: `linear-gradient(to right, #967965 0%, #967965 ${
                      (((maxPrice ?? priceCap) - 0) / priceCap) * 100
                    }%, #e5e7eb ${
                      (((maxPrice ?? priceCap) - 0) / priceCap) * 100
                    }%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>R$ 0</span>
                  <span>{formatBRL(priceCap)}</span>
                </div>
              </div>
            )}

            {/* Limpar filtros */}
            {algumFiltroAtivo && (
              <div className="flex justify-center">
                <button
                  onClick={limparFiltros}
                  className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-[#967965] font-fancy underline-offset-4 hover:underline transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 linhas — categorias em destaque com top 3 peças cada */}
        {!loading && showcaseCategorias.length > 0 && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-10 sm:space-y-14">
            <div className="text-center">
              <h2 className="font-fancy text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
                Explore por categoria
              </h2>
              <p className="font-fancy text-sm sm:text-base text-gray-500 mt-2">
                As 3 mais procuradas, com as peças em destaque de cada
              </p>
            </div>

            {showcaseCategorias.map((cat) => (
              <div key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full group flex items-end justify-between gap-3 pb-3 border-b border-[#967965]/20 hover:border-[#967965] transition-colors text-left"
                >
                  <h3 className="font-fancy text-2xl sm:text-3xl text-gray-900 group-hover:text-[#967965] transition-colors">
                    {labelDaCategoria(cat)}
                  </h3>
                  <span className="text-xs sm:text-sm font-fancy uppercase tracking-[0.2em] text-[#967965] group-hover:translate-x-1 transition-transform pb-1">
                    Ver todos →
                  </span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5">
                  {(topPorCategoria[cat] || []).map((p) => (
                    <ProductCard
                      key={p.dalia_id}
                      id={p.dalia_id}
                      product={p}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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
