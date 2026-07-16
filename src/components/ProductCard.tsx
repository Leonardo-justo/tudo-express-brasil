import { ArrowUpRight } from "lucide-react";
import { TrackedOutboundLink } from "@/components/TrackedOutboundLink";
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
  const links = getProductBuyLinks(product).filter((link) => link.href);
  const imageClassName = `product-image ${product.image_url.includes("sache") || product.image_url.includes("blister") ? "product-image-sache" : ""}`.trim();

  return (
    <article className="product-card reveal visible">
      <span className={getTagClassName(product)}>{product.tag}</span>
      <div className={imageClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url || "/assets/mel-propolis.png"} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <small>{product.category} &bull; {product.weight}</small>
        <h3><a className="product-detail-link" href={`/produtos/${product.slug}`}>{product.name}</a></h3>
        <p>{product.short_description}</p>
        {links.length ? (
          <div className="product-links">
            {links.map((link) => (
              <TrackedOutboundLink
                eventName="product_outbound_click"
                eventProperties={{
                  channel: link.channel,
                  product_name: product.name,
                  product_slug: product.slug
                }}
                href={link.href!}
                key={link.label}
                target="_blank"
                rel="noopener noreferrer"
              >
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
              </TrackedOutboundLink>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
