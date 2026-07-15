import type { Product } from "@/types/product";
import { SHOPEE_STORE_URL } from "@/lib/store-links";

export const seedProducts: Product[] = [
  {
    id: "mel-propolis",
    name: "Mel com Própolis",
    slug: "mel-com-propolis",
    short_description: "Sabor marcante em uma combinação especial e 100% natural.",
    image_url: "/assets/mel-propolis.png",
    category: "Onda Mel",
    weight: "500g",
    tag: "Novidade",
    tag_variant: "dark",
    mercado_livre_url: "https://www.mercadolivre.com.br/mel-puro-com-propolis-onda-mel-500g/up/MLBU4130443166",
    shopee_url: SHOPEE_STORE_URL,
    whatsapp_url: null,
    is_active: true,
    is_featured: true,
    sort_order: 1
  },
  {
    id: "mel-laranjeira",
    name: "Florada Laranjeira",
    slug: "mel-florada-laranjeira",
    short_description: "Aroma delicado, sabor suave e a doçura equilibrada da natureza.",
    image_url: "/assets/mel-laranjeira.png",
    category: "Onda Mel",
    weight: "500g",
    tag: "Floral",
    tag_variant: "soft",
    mercado_livre_url: "https://www.mercadolivre.com.br/mel-puro-onda-mel-laranjeira-500g/up/MLBU4101000879",
    shopee_url: SHOPEE_STORE_URL,
    whatsapp_url: null,
    is_active: true,
    is_featured: true,
    sort_order: 2
  },
  {
    id: "mel-silvestre",
    name: "Florada Silvestre",
    slug: "mel-florada-silvestre",
    short_description: "O sabor tradicional do mel puro para acompanhar todos os momentos.",
    image_url: "/assets/mel-silvestre.png",
    category: "Onda Mel",
    weight: "500g",
    tag: "Clássico",
    tag_variant: "default",
    mercado_livre_url: "https://www.mercadolivre.com.br/mel-puro-onda-mel-silvestre-500g/up/MLBU4162463179",
    shopee_url: SHOPEE_STORE_URL,
    whatsapp_url: null,
    is_active: true,
    is_featured: true,
    sort_order: 3
  },
  {
    id: "mel-sache",
    name: "Mel em Sachê",
    slug: "mel-em-sache",
    short_description: "Porções práticas para levar a energia natural do mel com você.",
    image_url: "/assets/mel-sache.png",
    category: "Onda Mel",
    weight: "32g",
    tag: "Prático",
    tag_variant: "blue",
    mercado_livre_url: "https://www.mercadolivre.com.br/mel-puro-em-blister-sache-onda-mel-32g/up/MLBU4130517538",
    shopee_url: SHOPEE_STORE_URL,
    whatsapp_url: null,
    is_active: true,
    is_featured: true,
    sort_order: 4
  }
];
