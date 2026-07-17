import type { Product } from "@/types/product";

type DeleteConfirmDialogProps = {
  product: Product | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (product: Product) => void;
};

export function DeleteConfirmDialog({ product, loading, onCancel, onConfirm }: DeleteConfirmDialogProps) {
  if (!product) {
    return null;
  }

  return (
    <div className="admin-dialog-root" role="presentation">
      <button className="admin-dialog-overlay" type="button" aria-label="Cancelar exclusão" onClick={onCancel} />
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-product-title">
        <h2 id="delete-product-title">Excluir produto?</h2>
        <p>
          Tem certeza que deseja excluir <strong>{product.name}</strong>? Essa ação não pode ser desfeita.
        </p>
        <div className="admin-dialog-actions">
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="btn btn-danger" type="button" onClick={() => onConfirm(product)} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </section>
    </div>
  );
}
