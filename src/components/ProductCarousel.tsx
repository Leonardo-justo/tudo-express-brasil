import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const carouselProducts = products.length > 0 ? [...products, ...products] : [];

  return (
    <div className="product-carousel" aria-label="Carrossel de produtos Onda Mel">
      <div className="product-carousel-track">
        {carouselProducts.map((product, index) => (
          <div className="product-carousel-item" key={`${product.id}-${index}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
