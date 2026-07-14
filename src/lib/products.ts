import { seedProducts } from "@/lib/seed-products";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
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
      label: "Mercado Livre",
      href: product.mercado_livre_url
    },
    {
      label: "Shopee",
      href: product.shopee_url
    },
    {
      label: "WhatsApp",
      href: product.whatsapp_url
    }
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
}
