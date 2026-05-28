// ProductsGrid.jsx - Grid otimizada para cards maiores
import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="flex flex-col  w-screen max-w-screen overflow-hidden" data-catalog-grid>
      <div
        className="
                    grid
                    grid-cols-2        /* 2 coluna em mobile */
                    xs:grid-cols-2     /* 2 colunas em mobile grande */
                    sm:grid-cols-2     /* 2 colunas em tablet pequeno */
                    md:grid-cols-3     /* 3 colunas em tablet */
                    lg:grid-cols-3     /* 3 colunas em desktop */
                    xl:grid-cols-4     /* 4 colunas em desktop grande */
                    2xl:grid-cols-4    /* 4 colunas em telas enormes */
                    gap-6              /* gap maior entre cards */
                    sm:gap-8           /* gap ainda maior em telas maiores */
                    w-full
                    max-w-full
                    m-0
                    p-6                /* padding maior nas laterais */
                    sm:p-8             /* padding ainda maior em telas maiores */
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
