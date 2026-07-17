"use client";

import { useState } from "react";
import { normalizeCarouselCategory } from "@/components/admin/admin-product-utils";
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  function runAction(action: () => void) {
    setOpenMenuId(null);
    action();
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
            <div className="admin-card-menu" onClick={(event) => event.stopPropagation()}>
              <button
                className="admin-card-menu-trigger"
                type="button"
                aria-expanded={openMenuId === product.id}
                aria-label={`Acoes para ${product.name}`}
                onClick={() => setOpenMenuId((current) => (current === product.id ? null : product.id))}
              >
                ⋮
              </button>
              {openMenuId === product.id ? (
                <div className="admin-card-menu-panel">
                  <button type="button" onClick={() => runAction(() => onEdit(product))}>Editar</button>
                  <button type="button" onClick={() => runAction(() => onDuplicate(product))}>Duplicar</button>
                  <button type="button" onClick={() => runAction(() => onToggleActive(product))}>
                    {product.is_active ? "Desativar" : "Ativar"}
                  </button>
                  <button type="button" className="danger" onClick={() => runAction(() => onDelete(product))}>Excluir</button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="admin-product-card-body">
            <h3>{product.name}</h3>
            <small>{normalizeCarouselCategory(product.category)} • {product.weight || "sem volume"} • ordem {product.sort_order}</small>
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
