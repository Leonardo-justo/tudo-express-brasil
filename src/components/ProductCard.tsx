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

function getTagClassName(product: Product) {
  const normalizedTag = product.tag.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (normalizedTag === "novidade") {
    return "product-tag tag-dark";
  }

  if (normalizedTag === "classico") {
    return "product-tag";
  }

  return tagClassName[product.tag_variant] ?? "product-tag";
}

export function ProductCard({ product }: ProductCardProps) {
  const links = getProductBuyLinks(product);
  const imageClassName = `product-image ${product.image_url.includes("sache") || product.image_url.includes("blister") ? "product-image-sache" : ""}`.trim();

  return (
    <article className="product-card reveal visible">
      <span className={getTagClassName(product)}>{product.tag}</span>
      <div className={imageClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url || "/assets/mel-propolis.png"} alt={`Imagem do produto ${product.name}`} loading="lazy" />
      </div>
      <div className="product-info">
        <small>{product.category} • {product.weight}</small>
        <h3><a className="product-detail-link" href={`/produtos/${product.slug}`}>{product.name}</a></h3>
        <p>{product.short_description}</p>
        <div className="product-links">
          {links
            .filter((link) => link.href || link.unavailableLabel)
            .map((link) => (
              link.href ? (
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
              ) : (
                <span className="unavailable-buy-link" key={link.label}>
                  <span className="buy-link-label">
                    {link.logoSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="marketplace-logo" src={link.logoSrc} alt={link.logoAlt} />
                    ) : null}
                    {link.unavailableLabel}
                  </span>
                  <span className="buy-link-status">Sem link</span>
                </span>
              )
            ))}
        </div>
      </div>
    </article>
  );
}
