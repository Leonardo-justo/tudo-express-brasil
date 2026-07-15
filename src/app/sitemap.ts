import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tudoexpressbrasil.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts();

  return [
    {
      url: siteUrl,
      lastModified: new Date()
    },
    ...products.map((product) => ({
      url: `${siteUrl}/produtos/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date()
    }))
  ];
}
