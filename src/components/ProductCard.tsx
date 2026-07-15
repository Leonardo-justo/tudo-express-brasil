import { ArrowUpRight } from "lucide-react";
import { getProductBuyLinks } from "@/lib/products";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

const tagClassName = {
  default: "product-tag",
  soft: "product-tag tag-soft",
  dark: "product-tag tag-dark",
  blue: "product-tag tag-blue"
};

export function ProductCard({ product }: ProductCardProps) {
  const links = getProductBuyLinks(product);

  return (
    <article className="product-card reveal visible">
      <span className={tagClassName[product.tag_variant] ?? "product-tag"}>{product.tag}</span>
      <div className="product-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url || "/assets/mel-propolis.png"} alt={`Imagem do produto ${product.name}`} loading="lazy" />
      </div>
      <div className="product-info">
        <small>{product.category} • {product.weight}</small>
        <h3>{product.name}</h3>
        <p>{product.short_description}</p>
        {links.length > 0 ? (
          <div className="product-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                <span className="buy-link-label">
                  {link.logoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="marketplace-logo" src={link.logoSrc} alt={link.logoAlt} />
                  ) : null}
                  {link.label}
                </span>
                <span className="buy-link-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            ))}
          </div>
        ) : (
          <a className="fallback-buy-link" href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer">
            Consultar disponibilidade
            <span className="buy-link-arrow" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </a>
        )}
      </div>
    </article>
  );
}
