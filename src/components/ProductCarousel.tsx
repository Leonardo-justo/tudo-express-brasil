"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [products.length]);

  return (
    <div className="product-carousel" aria-label="Carrossel de produtos Onda Mel">
      <div
        className="product-carousel-track"
        style={{ transform: `translateX(calc(${activeIndex} * -302px))` }}
      >
        {products.map((product) => (
          <div className="product-carousel-item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
