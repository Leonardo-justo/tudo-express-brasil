import { seedProducts } from "@/lib/seed-products";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { SHOPEE_STORE_URL } from "@/lib/store-links";
import type { Product } from "@/types/product";

export async function getPublicProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return seedProducts;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return seedProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return seedProducts;
  }

  return data as Product[];
}

export function getProductBuyLinks(product: Product) {
  return [
    {
      logoAlt: "Logo do Mercado Livre",
      logoSrc: "/assets/logo-mercado-livre-oficial.png",
      label: "Ver no Mercado Livre",
      href: product.mercado_livre_url
    },
    {
      logoAlt: "Logo da Shopee",
      logoSrc: "/assets/logo-shopee-oficial.jpg",
      label: "Ver na Shopee",
      href: product.shopee_url || SHOPEE_STORE_URL
    },
    {
      logoAlt: "WhatsApp",
      logoSrc: null,
      label: "Comprar pelo WhatsApp",
      href: product.whatsapp_url
    }
  ].filter((link): link is { logoAlt: string; logoSrc: string | null; label: string; href: string } => Boolean(link.href));
}
