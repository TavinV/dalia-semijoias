// ProductsGrid.jsx - Grid otimizada para cards maiores
import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden" data-catalog-grid>
      <div
        className="
                    grid
                    grid-cols-1        /* 1 coluna em mobile pequeno (320-374px) */
                    xs:grid-cols-2     /* 2 colunas a partir de 375px */
                    md:grid-cols-3     /* 3 colunas em tablet (768+) */
                    xl:grid-cols-4     /* 4 colunas em desktop grande (1280+) */
                    gap-3              /* gap mobile pequeno */
                    xs:gap-2           /* gap em mobile médio (375+) */
                    sm:gap-6           /* gap maior em tablet+ */
                    lg:gap-8           /* gap ainda maior em desktop */
                    w-full
                    max-w-full
                    m-0
                    px-3 py-2          /* padding mínimo mobile */
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
