"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const reviewImages = [
  {
    alt: "Avaliação de Marcos Alexandre no Google",
    src: "/assets/reviews/avaliacao-marcos-alexandre.png"
  },
  {
    alt: "Avaliação de Lucia Freire no Google",
    src: "/assets/reviews/avaliacao-lucia-freire.png"
  },
  {
    alt: "Avaliação de Agatha Rafaela no Google",
    src: "/assets/reviews/avaliacao-agatha-rafaela.png"
  },
  {
    alt: "Avaliação de Paulo Borys Oliveira no Google",
    src: "/assets/reviews/avaliacao-paulo-borys.png"
  },
  {
    alt: "Avaliação de Fernanda Rodrigues no Google",
    src: "/assets/reviews/avaliacao-fernanda-rodrigues.png"
  },
  {
    alt: "Avaliação de Diane Redmil2 no Google",
    src: "/assets/reviews/avaliacao-diane-redmil2.png"
  }
];

export function ReviewCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepSize, setStepSize] = useState(370);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselImages = useMemo(() => [...reviewImages, ...reviewImages], []);
  const normalizedIndex = activeIndex % reviewImages.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateStepSize = () => {
      const firstItem = trackRef.current?.querySelector<HTMLElement>(".review-carousel-item");

      if (!firstItem || !trackRef.current) {
        return;
      }

      const gap = Number.parseFloat(window.getComputedStyle(trackRef.current).columnGap || "0");
      setStepSize(firstItem.getBoundingClientRect().width + gap);
    };

    updateStepSize();
    window.addEventListener("resize", updateStepSize);

    return () => window.removeEventListener("resize", updateStepSize);
  }, []);

  useEffect(() => {
    if (!transitionEnabled) {
      const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [transitionEnabled]);

  const goToPrevious = () => {
    if (activeIndex === 0) {
      setTransitionEnabled(false);
      window.requestAnimationFrame(() => {
        setActiveIndex(reviewImages.length);
        window.requestAnimationFrame(() => {
          setTransitionEnabled(true);
          setActiveIndex(reviewImages.length - 1);
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
    if (activeIndex >= reviewImages.length) {
      setTransitionEnabled(false);
      setActiveIndex(0);
    }
  };

  return (
    <div className="review-carousel-shell">
      <div className="review-score-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/reviews/google-resumo-excelente.png" alt="Resumo de avaliações excelentes no Google, com base em 15 avaliações" />
      </div>
      <div className="review-carousel-panel">
        <div className="review-carousel-toolbar">
          <p>Avaliações reais do Google</p>
          <div className="review-carousel-controls" aria-label="Controles do carrossel de avaliações">
            <button type="button" onClick={goToPrevious} aria-label="Avaliação anterior">
              <ArrowLeft />
            </button>
            <button type="button" onClick={goToNext} aria-label="Próxima avaliação">
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="review-carousel" aria-label="Carrossel com avaliações reais de clientes">
          <div
            className="review-carousel-track"
            onTransitionEnd={handleTransitionEnd}
            ref={trackRef}
            style={{
              transform: `translateX(-${activeIndex * stepSize}px)`,
              transition: transitionEnabled ? undefined : "none"
            }}
          >
            {carouselImages.map((review, index) => (
              <div className="review-carousel-item" key={`${review.src}-${index}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.src} alt={review.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <div className="review-carousel-dots" aria-label="Indicadores do carrossel de avaliações">
          {reviewImages.map((review, index) => (
            <button
              aria-label={review.alt}
              className={index === normalizedIndex ? "active" : ""}
              key={review.src}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
