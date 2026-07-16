"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type ProductCarouselProps = {
  ariaLabel?: string;
  products: Product[];
};

export function ProductCarousel({ ariaLabel = "Carrossel de produtos", products }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepSize, setStepSize] = useState(302);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselProducts = useMemo(() => (products.length > 1 ? [...products, ...products] : products), [products]);
  const normalizedIndex = products.length ? activeIndex % products.length : 0;

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
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

  useEffect(() => {
    if (!transitionEnabled) {
      const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [transitionEnabled]);

  const goToPrevious = () => {
    if (products.length <= 1) {
      return;
    }

    if (activeIndex === 0) {
      setTransitionEnabled(false);
      window.requestAnimationFrame(() => {
        setActiveIndex(products.length);
        window.requestAnimationFrame(() => {
          setTransitionEnabled(true);
          setActiveIndex(products.length - 1);
        });
      });
      return;
    }

    setActiveIndex((currentIndex) => currentIndex - 1);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => currentIndex + 1);
  };

  const handleTransitionEnd = () => {
    if (products.length > 1 && activeIndex >= products.length) {
      setTransitionEnabled(false);
      setActiveIndex(0);
    }
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

      <div className="product-carousel" aria-label={ariaLabel}>
        <div
          ref={trackRef}
          className="product-carousel-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${activeIndex * stepSize}px)`,
            transition: transitionEnabled ? undefined : "none"
          }}
        >
          {carouselProducts.map((product, index) => (
            <div className="product-carousel-item" key={`${product.id}-${index}`}>
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
              className={index === normalizedIndex ? "active" : ""}
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
