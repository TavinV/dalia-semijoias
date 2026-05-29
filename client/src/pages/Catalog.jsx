// Catalog.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header.jsx";
import Banner from "../components/layout/Banner.jsx";
import Main from "../components/layout/Main.jsx";
import ProductsGrid from "../components/layout/ProductsGrid.jsx";
import Footer from "../components/layout/Footer.jsx";
import CatalogSkeleton from "../components/skeletons/CatalogSkeleton.jsx";

import { useProducts } from "../hooks/useProducts.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import SkeletonCard from "../components/skeletons/SkeletonCard.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import api from "../api/axios.js";
import { matchesQuery } from "../utils/searchMatch.js";

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

// Carrossel horizontal das peças com 1 unidade em estoque
const UltimasUnidades = ({ products }) => {
  const carouselRef = useState(null);
  const scrollRef = { current: null };

  const setRef = (el) => {
    scrollRef.current = el;
  };

  const ultimas = (products || []).filter(
    (p) => Math.max(0, Number(p.stock) || 0) === 1,
  );

  if (ultimas.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 sm:mt-16 px-2 sm:px-0">
      <h2 className="font-fancy text-lg sm:text-3xl text-gray-900 mb-3 sm:mb-6 uppercase tracking-wide px-2 sm:px-0">
        Últimas Unidades
      </h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow items-center justify-center text-gray-500 hover:text-[#967965] hover:border-[#967965] transition-colors"
          aria-label="Anterior"
        >
          ←
        </button>
        <button
          onClick={scrollRight}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow items-center justify-center text-gray-500 hover:text-[#967965] hover:border-[#967965] transition-colors"
          aria-label="Próxima"
        >
          →
        </button>

        <div
          ref={setRef}
          className="no-scrollbar flex gap-2 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
        >
          {ultimas.map((p) => (
            <div
              key={p._id || p.dalia_id}
              className="snap-start flex-shrink-0 w-[42%] sm:w-[40%] md:w-[30%] lg:w-[23%]"
            >
              <ProductCard id={p.dalia_id} product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      <div className="text-center mb-3 sm:mb-5">
        <h2 className="font-fancy text-xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
          Mais vendidos do mês
        </h2>
        <p className="font-fancy text-xs sm:text-base text-gray-500 mt-1">
          As favoritas das nossas clientes
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {topItems.map((t, idx) => {
          const matched = productByName[(t.name || "").toLowerCase().trim()];
          if (!matched) return null;
          return (
            <div
              key={`${t.name}-${idx}`}
              className="relative w-[calc(50%-6px)] sm:w-[240px] md:w-[260px] xl:w-[260px]"
            >
              <span className="absolute top-2 left-2 z-20 w-8 h-8 rounded-full bg-[#967965] text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {idx + 1}
              </span>
              <ProductCard id={matched.dalia_id} product={matched} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PER_PAGE = 12;

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
  // Termo de pesquisa vindo do SearchBar (Enter → ?q=...)
  const searchQuery = searchParams.get("q") || "";
  const clearSearchQuery = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  // Multi-select de material e gênero
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);

  // Painel de filtros (escondido por padrão)
  const [showFilters, setShowFilters] = useState(false);
  // Painel de categorias (escondido por padrão)
  const [showCategoriesPanel, setShowCategoriesPanel] = useState(false);

  // Ordenação
  const [sortBy, setSortBy] = useState("procuradas");

  // Paginação
  const [page, setPage] = useState(1);

  // Mapa de "mais vendidos" do mês (nome → quantidade)
  const [topSellersMap, setTopSellersMap] = useState({});
  useEffect(() => {
    let cancel = false;
    api
      .get("/sales/top-mes", { params: { limit: 100 } })
      .then((r) => {
        if (cancel) return;
        const m = {};
        for (const t of r.data.data || []) {
          if (t.name) m[t.name.toLowerCase().trim()] = Number(t.qty) || 0;
        }
        setTopSellersMap(m);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

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

  const toggleMaterial = (m) => {
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };
  const toggleGender = (g) => {
    setSelectedGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  // Filtra produtos por TODOS os filtros ativos (multi-select em material e gênero)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if ((Number(p.stock) || 0) < 1) return false;
      if (selectedCategory !== "todos") {
        if (norm(p.category) !== norm(selectedCategory)) return false;
      }
      if (selectedMaterials.length > 0) {
        if (!selectedMaterials.includes(p.material)) return false;
      }
      if (selectedGenders.length > 0) {
        if (!selectedGenders.includes(norm(p.gender))) return false;
      }
      if (maxPrice !== null && Number(p.price) > maxPrice) return false;
      if (searchQuery && !matchesQuery(p, searchQuery)) return false;
      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedMaterials,
    selectedGenders,
    maxPrice,
    searchQuery,
  ]);

  // Ordenação
  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sortBy === "caras") {
      arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "baratas") {
      arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else {
      // procuradas (default): mais vendidas primeiro, demais por preço desc
      arr.sort((a, b) => {
        const qa = topSellersMap[norm(a.name)] || 0;
        const qb = topSellersMap[norm(b.name)] || 0;
        if (qa !== qb) return qb - qa;
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      });
    }
    return arr;
  }, [filteredProducts, sortBy, topSellersMap]);

  // Paginação
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PER_PAGE));
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    selectedMaterials,
    selectedGenders,
    maxPrice,
    sortBy,
    searchQuery,
  ]);
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return sortedProducts.slice(start, start + PER_PAGE);
  }, [sortedProducts, safePage]);

  const limparFiltros = () => {
    setSelectedCategory("todos");
    setSelectedMaterials([]);
    setSelectedGenders([]);
    setMaxPrice(priceCap || null);
    setSortBy("procuradas");
  };

  const algumFiltroAtivo =
    selectedCategory !== "todos" ||
    selectedMaterials.length > 0 ||
    selectedGenders.length > 0 ||
    (maxPrice !== null && maxPrice < priceCap);

  const labelDaCategoria = (cat) =>
    categories.find((c) => c.id === cat)?.label || cat;

  // Páginas visíveis na paginação (compacta com elipses)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set([1, 2, totalPages - 1, totalPages, safePage, safePage - 1, safePage + 1]);
    const sortedPages = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const withGaps = [];
    for (let i = 0; i < sortedPages.length; i++) {
      withGaps.push(sortedPages[i]);
      if (sortedPages[i + 1] && sortedPages[i + 1] - sortedPages[i] > 1) {
        withGaps.push("…");
      }
    }
    return withGaps;
  }, [totalPages, safePage]);

  return (
    <>
      <Header />
      <Banner />

      <Main>
        {/* Top 5 do mês (público) */}
        <TopMesPublico products={products} />

        {/* Cabeçalho do catálogo */}
        <div
          id="nosso-catalogo"
          className="w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 scroll-mt-20"
        >
          <div className="text-center space-y-2 sm:space-y-3">
            <h1 className="font-fancy text-2xl sm:text-4xl md:text-5xl text-gray-900 tracking-tight">
              Nosso catálogo
            </h1>
            <p className="font-fancy text-sm sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto px-2">
              Peças selecionadas com carinho para você
            </p>
          </div>

          {/* Toolbar: botão Categorias + Filtros + ordenação */}
          <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <button
                onClick={() => {
                  setShowCategoriesPanel((v) => !v);
                  if (!showCategoriesPanel) setShowFilters(false);
                }}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border rounded-full font-fancy text-xs sm:text-sm transition-all ${
                  showCategoriesPanel || selectedCategory !== "todos"
                    ? "bg-[#967965] text-white border-[#967965]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Categorias
                {selectedCategory !== "todos" && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-white text-[#967965] rounded-full font-bold">
                    1
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowFilters((v) => !v);
                  if (!showFilters) setShowCategoriesPanel(false);
                }}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border rounded-full font-fancy text-xs sm:text-sm transition-all ${
                  showFilters || selectedMaterials.length > 0 || selectedGenders.length > 0 || (maxPrice !== null && maxPrice < priceCap)
                    ? "bg-[#967965] text-white border-[#967965]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="9" y1="18" x2="15" y2="18" />
                </svg>
                Filtros
                {(selectedMaterials.length > 0 ||
                  selectedGenders.length > 0 ||
                  (maxPrice !== null && maxPrice < priceCap)) && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-white text-[#967965] rounded-full font-bold">
                    {selectedMaterials.length +
                      selectedGenders.length +
                      (maxPrice !== null && maxPrice < priceCap ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 font-fancy justify-end">
              <label htmlFor="sort" className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-gray-400">
                Ordenar
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-gray-700 border-b border-gray-300 focus:border-[#967965] outline-none px-2 py-1 cursor-pointer flex-1 sm:flex-initial"
              >
                <option value="procuradas">Mais vendidos</option>
                <option value="caras">Preço: maior → menor</option>
                <option value="baratas">Preço: menor → maior</option>
              </select>
            </div>
          </div>

          {/* Painel de categorias (abre ao clicar em "Categorias") */}
          {showCategoriesPanel && (
            <div className="mt-4 sm:mt-6 max-w-5xl mx-auto bg-white/60 backdrop-blur-sm border border-[#967965]/20 rounded-lg p-4 sm:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 font-fancy">
                Escolha uma categoria
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setShowCategoriesPanel(false);
                      }}
                      className={`px-4 py-1.5 text-sm font-fancy rounded-full border transition-all ${
                        active
                          ? "bg-[#967965] text-white border-[#967965]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Painel de filtros (abre ao clicar em "Filtros") */}
          {showFilters && (
            <div className="mt-4 sm:mt-6 max-w-5xl mx-auto bg-white/60 backdrop-blur-sm border border-[#967965]/20 rounded-lg p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Material — multi-select */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 font-fancy">
                  Material{" "}
                  {selectedMaterials.length > 0 && (
                    <span className="text-[#967965]">
                      ({selectedMaterials.length} selecionado{selectedMaterials.length === 1 ? "" : "s"})
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {materials.filter((m) => m.id !== "todos").map((m) => {
                    const active = selectedMaterials.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMaterial(m.id)}
                        className={`px-4 py-1.5 text-sm font-fancy rounded-full border transition-all ${
                          active
                            ? "bg-[#967965] text-white border-[#967965]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                        }`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gênero — multi-select */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 font-fancy">
                  Gênero{" "}
                  {selectedGenders.length > 0 && (
                    <span className="text-[#967965]">
                      ({selectedGenders.length} selecionado{selectedGenders.length === 1 ? "" : "s"})
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {genders.filter((g) => g.id !== "todos").map((g) => {
                    const active = selectedGenders.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGender(g.id)}
                        className={`px-4 py-1.5 text-sm font-fancy rounded-full border transition-all ${
                          active
                            ? "bg-[#967965] text-white border-[#967965]"
                            : "bg-white text-gray-600 border-gray-300 hover:border-[#967965] hover:text-[#967965]"
                        }`}
                      >
                        {active && <span className="mr-1">✓</span>}
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preço */}
              {priceCap > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-fancy">
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
                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
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

              {/* Botão de limpar */}
              {algumFiltroAtivo && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <button
                    onClick={limparFiltros}
                    className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-[#967965] font-fancy underline-offset-4 hover:underline transition-colors"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tags visuais — pesquisa e categoria ativas (vindas do SearchBar via URL) */}
          {(selectedCategory !== "todos" || searchQuery) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-6">
              {searchQuery && (
                <>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-fancy">
                    Pesquisa:
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967965] text-white rounded-full text-sm font-fancy">
                    "{searchQuery}"
                    <button
                      onClick={clearSearchQuery}
                      className="hover:text-white/70 transition-colors"
                      aria-label="Remover pesquisa"
                    >
                      ×
                    </button>
                  </span>
                </>
              )}
              {selectedCategory !== "todos" && (
                <>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-fancy">
                    Categoria:
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#967965] text-white rounded-full text-sm font-fancy">
                    {labelDaCategoria(selectedCategory)}
                    <button
                      onClick={() => setSelectedCategory("todos")}
                      className="hover:text-white/70 transition-colors"
                      aria-label="Remover filtro de categoria"
                    >
                      ×
                    </button>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Contagem total + grid paginado */}
        <div className="px-3 sm:px-6 lg:px-8 pb-0">
          {!loading && (
            <div className="max-w-7xl mx-auto mb-3 sm:mb-4 flex items-center justify-between">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 font-fancy">
                {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "peça" : "peças"}
              </p>
              {totalPages > 1 && (
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 font-fancy">
                  Página {safePage} de {totalPages}
                </p>
              )}
            </div>
          )}

          {loading ? (
            <CatalogSkeleton count={20} />
          ) : sortedProducts.length > 0 ? (
            <>
              <ProductsGrid products={paginatedProducts} />

              {/* Últimas Unidades — peças com 1 só em estoque */}
              <UltimasUnidades products={products} />

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-0.5 sm:gap-2 mt-6 sm:mt-8 mb-8 sm:mb-12 flex-wrap px-2">
                  <button
                    onClick={() => setPage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-fancy text-gray-600 hover:text-[#967965] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    ← <span className="hidden sm:inline">Anterior</span>
                  </button>
                  {pageNumbers.map((p, idx) =>
                    p === "…" ? (
                      <span
                        key={`gap-${idx}`}
                        className="px-1 sm:px-2 text-gray-400 font-fancy text-xs sm:text-base"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[30px] sm:min-w-[36px] h-8 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-fancy rounded-full transition-all ${
                          p === safePage
                            ? "bg-[#967965] text-white"
                            : "text-gray-600 hover:bg-[#967965]/10 hover:text-[#967965]"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-fancy text-gray-600 hover:text-[#967965] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Próxima</span> →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 sm:py-16 px-4">
              <p className="font-fancy text-gray-500 text-base sm:text-lg mb-2">
                Nenhum produto encontrado
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mb-4">
                  Sua busca por <strong>"{searchQuery}"</strong> não retornou resultados
                </p>
              )}
              {(algumFiltroAtivo || searchQuery) && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {searchQuery && (
                    <button
                      onClick={clearSearchQuery}
                      className="px-4 py-2 text-xs sm:text-sm font-fancy bg-[#967965] text-white rounded-full hover:bg-[#7A5F4F] transition-colors"
                    >
                      Limpar pesquisa
                    </button>
                  )}
                  {algumFiltroAtivo && !searchQuery && (
                    <button
                      onClick={limparFiltros}
                      className="px-4 py-2 text-xs sm:text-sm font-fancy bg-[#967965] text-white rounded-full hover:bg-[#7A5F4F] transition-colors"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Main>

      <Footer />
    </>
  );
}

export default Catalog;
