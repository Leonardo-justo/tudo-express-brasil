export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  image_url: string;
  category: string;
  weight: string;
  tag: string;
  tag_variant: "default" | "soft" | "dark" | "blue";
  mercado_livre_url: string | null;
  shopee_url: string | null;
  whatsapp_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductFormValues = Omit<Product, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
