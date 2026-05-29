// ProductsGrid.jsx - Grid otimizada para cards maiores
import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden" data-catalog-grid>
      <div
        className="
                    grid
                    grid-cols-2        /* 2 colunas em mobile (igual skeleton) */
                    md:grid-cols-3     /* 3 colunas em tablet */
                    xl:grid-cols-4     /* 4 colunas em desktop grande */
                    gap-6              /* gap mobile = skeleton */
                    sm:gap-8           /* gap tablet = skeleton */
                    w-screen
                    max-w-full
                    m-0
                    p-6                /* padding mobile = skeleton */
                    sm:p-8             /* padding tablet = skeleton */
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
