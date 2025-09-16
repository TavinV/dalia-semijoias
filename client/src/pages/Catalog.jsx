import Header from '../components/layout/Header.jsx'
import Banner from '../components/layout/Banner.jsx';
import Main from '../components/layout/Main.jsx'
import ProductsGrid from '../components/layout/ProductsGrid.jsx';
import Footer from '../components/layout/Footer.jsx';

import Carousel from '../components/navigation/Carousel.jsx';
import SectionTitle from '../components/ui/SectionTitle.jsx';

import { useProducts } from '../hooks/useProducts.jsx';
import { useNavigate } from 'react-router-dom';

function Catalog() {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  if (!loading && error) {
    navigate('/error?message=' + error)
  }

  // agrupa produtos por categoria
  const grouped = products?.reduce((acc, product) => {
    const category = product.category?.trim() || "Outros";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {}) || {};

  // ordena categorias alfabeticamente
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })
  );

  // cria lista de masculinos
  const masculinos = products?.filter(
    (p) => p.gender?.toLowerCase() === "masculino"
  ) || [];

  return (
    <>
      {/* LOADING sofisticado */}
      {loading && (
        <div className="fixed h-screen w-screen inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-auto animate-pulse"
            />

            {/* Spinner elegante */}
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <Header />
      <Banner />

      <Main>
        <SectionTitle text={"Coleção"} />
        <Carousel />

        {sortedCategories.map((category) => (
          <div key={category} id={category.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-24">
            <ProductsGrid products={grouped[category]} title={category} />
          </div>
        ))}

        {/* seção extra masculina */}
        {masculinos.length > 0 && (
          <div key="masculino" id="masculino" className="scroll-mt-24">
            <ProductsGrid products={masculinos} title="Masculino" />
          </div>
        )}

      </Main>

      <Footer />
    </>
  );
}

export default Catalog;
