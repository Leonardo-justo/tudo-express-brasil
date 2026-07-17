import type { ProductFormValues } from "@/types/product";

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  short_description: "",
  image_url: "",
  category: "Onda Mel",
  weight: "",
  tag: "Novo",
  tag_variant: "default",
  mercado_livre_url: "",
  shopee_url: "",
  whatsapp_url: "",
  is_active: true,
  is_featured: true,
  sort_order: 10
};

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function normalizeProduct(values: ProductFormValues) {
  const automaticSlug = slugify(values.name);

  return {
    ...values,
    slug: values.id ? values.slug || automaticSlug : automaticSlug,
    mercado_livre_url: values.mercado_livre_url || null,
    shopee_url: values.shopee_url || null,
    whatsapp_url: values.whatsapp_url || null,
    image_url: values.image_url || "/assets/mel-propolis.png",
    sort_order: Number(values.sort_order || 0)
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

export async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/") || file.type.includes("gif") || file.type.includes("svg")) {
    return file;
  }

  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const maxSize = 1600;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise<File>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(file);
          return;
        }

        resolve(new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" }));
      },
      "image/webp",
      0.84
    );
  });
}
