import { seedProducts } from "@/lib/seed-products";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product } from "@/types/product";

export type ProductBuyLink = {
  channel: "mercado_livre" | "shopee" | "whatsapp";
  logoAlt: string;
  logoSrc: string | null;
  label: string;
  href: string | null;
  unavailableLabel?: string;
};

const WHATSAPP_PHONE = "5517981468455";

function getAutomaticWhatsappUrl(productName: string) {
  const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${productName}`);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }

    return a.name.localeCompare(b.name, "pt-BR");
  });
}

function mergeWithSeedProducts(products: Product[]) {
  const productMap = new Map<string, Product>();

  seedProducts.forEach((product) => {
    if (product.is_active) {
      productMap.set(product.slug, product);
    }
  });

  products.forEach((product) => {
    if (product.is_active) {
      productMap.set(product.slug, product);
    }
  });

  return sortProducts([...productMap.values()]);
}

export async function getPublicProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return sortProducts(seedProducts.filter((product) => product.is_active));
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return sortProducts(seedProducts.filter((product) => product.is_active));
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return sortProducts(seedProducts.filter((product) => product.is_active));
  }

  return mergeWithSeedProducts(data as Product[]);
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

  const seedSlugs = seedProducts.filter((product) => product.is_active).map((product) => product.slug);

  if (error || !data?.length) {
    return seedProducts.filter((product) => product.is_active).map((product) => product.slug);
  }

  return [...new Set([...seedSlugs, ...data.map((product) => product.slug as string)])];
}

export function getProductBuyLinks(product: Product): ProductBuyLink[] {
  return [
    {
      channel: "mercado_livre",
      logoAlt: "Logo do Mercado Livre",
      logoSrc: "/assets/logo-mercado-livre-transparente-trim.png",
      label: "Ver no Mercado Livre",
      href: product.mercado_livre_url,
      unavailableLabel: "Mercado Livre em breve"
    },
    {
      channel: "shopee",
      logoAlt: "Logo da Shopee",
      logoSrc: "/assets/logo-shopee-oficial.jpg",
      label: "Ver na Shopee",
      href: product.shopee_url,
      unavailableLabel: "Shopee em breve"
    },
    {
      channel: "whatsapp",
      logoAlt: "WhatsApp",
      logoSrc: null,
      label: "Comprar pelo WhatsApp",
      href: product.whatsapp_url || getAutomaticWhatsappUrl(product.name)
    }
  ];
}
