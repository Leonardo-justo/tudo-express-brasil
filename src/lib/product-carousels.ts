export type ProductCarouselCategory = "Onda Mel" | "Café" | "Utilidades";

function normalizeCategoryName(category: string) {
  return category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function normalizeCarouselCategory(category: string): ProductCarouselCategory {
  const normalizedCategory = normalizeCategoryName(category);

  if (normalizedCategory.includes("onda mel")) {
    return "Onda Mel";
  }

  if (normalizedCategory.includes("cafe")) {
    return "Café";
  }

  return "Utilidades";
}
