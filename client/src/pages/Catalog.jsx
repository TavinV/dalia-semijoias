import Header from '../components/layout/Header.jsx'
import Banner from '../components/layout/Banner.jsx';
import Main from '../components/layout/Main.jsx'
import ProductsGrid from '../components/layout/ProductsGrid.jsx';
import Footer from '../components/layout/Footer.jsx';

import Carousel from '../components/navigation/Carousel.jsx';
import SectionTitle from '../components/ui/SectionTitle.jsx';

import { useProducts } from '../hooks/useProducts.jsx';

function Catalog() {
  const { products, loading, error } = useProducts();

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
      <Header />
      <Banner />

      {loading && (
        <div className="w-screen h-screen bg-black opacity-20 fixed top-0 left-0 z-20"></div>
      )}

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
