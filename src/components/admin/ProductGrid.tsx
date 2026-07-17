import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onToggleActive: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductGrid({ products, loading, onEdit, onDuplicate, onToggleActive, onDelete }: ProductGridProps) {
  if (loading && products.length === 0) {
    return (
      <div className="admin-product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="admin-product-skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="empty-list">Nenhum produto encontrado com esse filtro.</p>;
  }

  return (
    <div className="admin-product-grid">
      {products.map((product) => (
        <article
          className={`admin-product-card${product.is_active ? "" : " inactive"}`}
          key={product.id}
          onClick={() => onEdit(product)}
          title={product.name}
        >
          <div className="admin-product-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url || "/assets/mel-propolis.png"} alt={`Imagem do produto ${product.name}`} />
            <span className={`admin-status-pill${product.is_active ? " active" : ""}`}>
              <i /> {product.is_active ? "Ativo" : "Inativo"}
            </span>
            <details className="admin-card-menu" onClick={(event) => event.stopPropagation()}>
              <summary aria-label={`Ações para ${product.name}`}>⋮</summary>
              <div>
                <button type="button" onClick={() => onEdit(product)}>Editar</button>
                <button type="button" onClick={() => onDuplicate(product)}>Duplicar</button>
                <button type="button" onClick={() => onToggleActive(product)}>{product.is_active ? "Desativar" : "Ativar"}</button>
                <button type="button" className="danger" onClick={() => onDelete(product)}>Excluir</button>
              </div>
            </details>
          </div>
          <div className="admin-product-card-body">
            <h3>{product.name}</h3>
            <small>{product.category} • {product.weight || "sem volume"} • ordem {product.sort_order}</small>
            <div className="admin-link-badges" aria-label="Links cadastrados">
              <span className={product.mercado_livre_url ? "ok" : ""}>ML</span>
              <span className={product.shopee_url ? "ok" : ""}>Shopee</span>
              <span className={product.whatsapp_url ? "ok" : ""}>WhatsApp</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
