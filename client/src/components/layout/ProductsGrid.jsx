import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

const ProductsGrid = ({ products, title }) => {
    return (
        <div className="flex flex-col mt-20">
            <SectionTitle text={title} />

            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) =>
                        product.stock >= 1 ? (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsGrid;
