import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedOutboundLink } from "@/components/TrackedOutboundLink";
import { getProductBuyLinks, getProductBySlug, getProductSlugs } from "@/lib/products";

const siteUrl = "https://tudoexpressbrasil.com.br";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getDetailTagClassName(tag: string, variant: "default" | "soft" | "dark" | "blue") {
  const normalizedTag = tag.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (normalizedTag === "novidade") {
    return "product-tag tag-dark";
  }

  if (normalizedTag === "classico") {
    return "product-tag";
  }

  return `product-tag ${variant === "soft" ? "tag-soft" : variant === "dark" ? "tag-dark" : variant === "blue" ? "tag-blue" : ""}`.trim();
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado | Tudo Express Brasil"
    };
  }

  const imageUrl = product.image_url.startsWith("http") ? product.image_url : `${siteUrl}${product.image_url}`;

  return {
    title: `${product.name} | Tudo Express Brasil`,
    description: product.short_description,
    alternates: {
      canonical: `/produtos/${product.slug}`
    },
    openGraph: {
      title: `${product.name} | Tudo Express Brasil`,
      description: product.short_description,
      url: `/produtos/${product.slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Tudo Express Brasil`,
      description: product.short_description,
      images: [imageUrl]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = product.image_url.startsWith("http") ? product.image_url : `${siteUrl}${product.image_url}`;
  const links = getProductBuyLinks(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrl,
    description: product.short_description,
    brand: {
      "@type": "Brand",
      name: product.category
    },
    url: `${siteUrl}/produtos/${product.slug}`
  };

  return (
    <>
    <SiteHeader />
    <main className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <section className="container product-detail">
        <Link className="product-back" href="/#produtos">
          <ArrowLeft aria-hidden="true" /> Voltar para produtos
        </Link>
        <div className="product-detail-grid">
          <div className="product-detail-media">
            <span className={getDetailTagClassName(product.tag, product.tag_variant)}>
              {product.tag}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url || "/assets/mel-propolis.png"} alt={product.name} />
          </div>
          <div className="product-detail-copy">
            <span className="eyebrow"><i /> {product.category} • {product.weight || "Produto selecionado"}</span>
            <h1>{product.name}</h1>
            <p>{product.short_description}</p>
            <div className="product-detail-benefits">
              <span><Check /> Seleção cuidadosa</span>
              <span><ShieldCheck /> Compra segura</span>
              <span><Truck /> Entrega acompanhada</span>
            </div>
            <div className="product-detail-links">
              {links.filter((link) => link.href || link.unavailableLabel).map((link) => (
                link.href ? (
                  <TrackedOutboundLink
                    eventName="product_outbound_click"
                    eventProperties={{
                      channel: link.channel,
                      product_name: product.name,
                      product_slug: product.slug
                    }}
                    key={link.label}
                    href={link.href}
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
                    <ArrowUpRight aria-hidden="true" />
                  </TrackedOutboundLink>
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
        </div>
      </section>
    </main>
    </>
  );
}
