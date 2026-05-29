// ProductsGrid.jsx - Grid otimizada para cards maiores
import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden" data-catalog-grid>
      <div
        className="
                    grid
                    grid-cols-2        /* 2 colunas sempre em mobile */
                    md:grid-cols-3     /* 3 colunas em tablet (768+) */
                    xl:grid-cols-4     /* 4 colunas em desktop grande (1280+) */
                    gap-2              /* gap apertado em mobile */
                    sm:gap-4           /* gap médio em tablet */
                    lg:gap-6           /* gap maior em desktop */
                    w-full
                    max-w-full
                    m-0
                    px-2 py-2          /* padding mínimo mobile */
                    sm:p-4             /* padding maior em tablet+ */
                    lg:p-6             /* padding ainda maior em desktop */
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
