"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepSize, setStepSize] = useState(302);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [products.length]);

  useEffect(() => {
    const updateStepSize = () => {
      const firstItem = trackRef.current?.querySelector<HTMLElement>(".product-carousel-item");

      if (!firstItem || !trackRef.current) {
        return;
      }

      const gap = Number.parseFloat(window.getComputedStyle(trackRef.current).columnGap || "0");
      setStepSize(firstItem.getBoundingClientRect().width + gap);
    };

    updateStepSize();
    window.addEventListener("resize", updateStepSize);

    return () => window.removeEventListener("resize", updateStepSize);
  }, [products.length]);

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % products.length);
  };

  return (
    <div className="product-carousel-wrap">
      <div className="product-carousel-toolbar">
        <p>{products.length} produto{products.length === 1 ? "" : "s"} selecionado{products.length === 1 ? "" : "s"}</p>
        {products.length > 1 ? (
          <div className="product-carousel-controls" aria-label="Controles do carrossel de produtos">
            <button type="button" onClick={goToPrevious} aria-label="Produto anterior">
              <ArrowLeft />
            </button>
            <button type="button" onClick={goToNext} aria-label="Próximo produto">
              <ArrowRight />
            </button>
          </div>
        ) : null}
      </div>
      <div className="product-carousel" aria-label="Carrossel de produtos Onda Mel">
      <div
        ref={trackRef}
        className="product-carousel-track"
        style={{ transform: `translateX(-${activeIndex * stepSize}px)` }}
      >
        {products.map((product) => (
          <div className="product-carousel-item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
      {products.length > 1 ? (
        <div className="product-carousel-dots" aria-label="Indicadores do carrossel">
          {products.map((product, index) => (
            <button
              aria-label={`Ir para ${product.name}`}
              className={index === activeIndex ? "active" : ""}
              key={product.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
