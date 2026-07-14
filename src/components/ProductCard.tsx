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
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <a href="https://wa.me/5517981468455" target="_blank" rel="noopener noreferrer">
            Consultar disponibilidade <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
