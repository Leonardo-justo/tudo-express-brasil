import { carouselCategories } from "@/components/admin/admin-product-utils";

export type ProductStatusFilter = "all" | "active" | "inactive";

type ProductFiltersProps = {
  search: string;
  category: string;
  status: ProductStatusFilter;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ProductStatusFilter) => void;
};

export function ProductFilters({
  search,
  category,
  status,
  resultCount,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}: ProductFiltersProps) {
  return (
    <div className="admin-products-toolbar">
      <div className="admin-products-filters">
        <label>
          Buscar por nome
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ex.: mel, suporte, copo..."
          />
        </label>
        <label>
          Carrossel
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="all">Todos os carrosséis</option>
            {carouselCategories.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => onStatusChange(event.target.value as ProductStatusFilter)}>
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </label>
      </div>
      <p>{resultCount} produto{resultCount === 1 ? "" : "s"} encontrado{resultCount === 1 ? "" : "s"}</p>
    </div>
  );
}
