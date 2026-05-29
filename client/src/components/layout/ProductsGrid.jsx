// ProductsGrid.jsx - Grid otimizada para cards maiores
import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="flex flex-col  w-screen max-w-screen overflow-hidden" data-catalog-grid>
      <div
        className="
                    grid
                    grid-cols-2        /* 2 colunas em mobile */
                    md:grid-cols-3     /* 3 colunas em tablet */
                    xl:grid-cols-4     /* 4 colunas em desktop grande */
                    gap-3              /* gap compacto em mobile */
                    sm:gap-6           /* gap maior em tablet+ */
                    lg:gap-8           /* gap ainda maior em desktop */
                    w-full
                    max-w-full
                    m-0
                    p-3                /* padding compacto em mobile */
                    sm:p-6             /* padding maior em tablet+ */
                    lg:p-8             /* padding ainda maior em desktop */
                "
      >
        {products.map((product) =>
          product.stock >= 1 ? (
            <ProductCard
              id={product.dalia_id}
              key={product._id}
              product={product}
            />
          ) : null,
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
