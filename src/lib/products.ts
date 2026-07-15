import { seedProducts } from "@/lib/seed-products";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product } from "@/types/product";

export type ProductBuyLink = {
  logoAlt: string;
  logoSrc: string | null;
  label: string;
  href: string | null;
  unavailableLabel?: string;
};

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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const fallbackProduct = seedProducts.find((product) => product.slug === slug && product.is_active) || null;

  if (!isSupabaseConfigured) {
    return fallbackProduct;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return fallbackProduct;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    return fallbackProduct;
  }

  return (data as Product | null) || fallbackProduct;
}

export async function getProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return seedProducts.filter((product) => product.is_active).map((product) => product.slug);
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return seedProducts.filter((product) => product.is_active).map((product) => product.slug);
  }

  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  if (error || !data?.length) {
    return seedProducts.filter((product) => product.is_active).map((product) => product.slug);
  }

  return data.map((product) => product.slug as string);
}

export function getProductBuyLinks(product: Product): ProductBuyLink[] {
  return [
    {
      logoAlt: "Logo do Mercado Livre",
      logoSrc: "/assets/logo-mercado-livre-transparente-trim.png",
      label: "Ver no Mercado Livre",
      href: product.mercado_livre_url,
      unavailableLabel: "Mercado Livre em breve"
    },
    {
      logoAlt: "Logo da Shopee",
      logoSrc: "/assets/logo-shopee-oficial.jpg",
      label: "Ver na Shopee",
      href: product.shopee_url,
      unavailableLabel: "Shopee em breve"
    },
    {
      logoAlt: "WhatsApp",
      logoSrc: null,
      label: "Comprar pelo WhatsApp",
      href: product.whatsapp_url
    }
  ];
}
