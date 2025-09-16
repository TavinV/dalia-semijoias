import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
    return (
        <div className="flex flex-col mt-20">
            <SectionTitle text={title} />

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-[90%] mx-auto">
                {products.map((product) =>
                    product.stock >= 1 ? (
                        <ProductCard
                            id={product.dalia_id}
                            key={product._id}
                            product={product}
                        />
                    ) : null
                )}
            </div>

        </div>
    );
};

export default ProductsGrid;
