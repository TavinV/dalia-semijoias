import Header from '../components/layout/Header.jsx'
import Banner from '../components/layout/Banner.jsx';
import Main from '../components/layout/Main.jsx'
import ProductsGrid from '../components/layout/ProductsGrid.jsx';
import Footer from '../components/layout/Footer.jsx';

import Carousel from '../components/navigation/Carousel.jsx';

import SectionTitle from '../components/ui/SectionTitle.jsx';

import { redirect } from 'react-router-dom';
import { useCart } from "../hooks/useCart.jsx";
import { useProducts } from '../hooks/useProducts.jsx';

function Catalog() {
  const {addItem} = useCart();
  const {products, loading, error} = useProducts();

  return (
    <>
      <Header />
      <Banner/>
      {
        loading && 
          <div className="w-screen h-screen bg-black opacity-20 fixed top-0 left-0 z-20"></div>
        
      }
      <Main>
        <SectionTitle text={"Coleção"} />
        <Carousel/>
      <ProductsGrid products={products} title={"Aneis"} />
      </Main>
      <Footer />
    </>
  )
}

export default Catalog;
