"use client";

import { useEffect, useMemo, useState } from "react";
import { carouselCategories, emptyProduct, normalizeCarouselCategory, slugify } from "@/components/admin/admin-product-utils";
import type { Product, ProductFormValues } from "@/types/product";

type ProductDrawerProps = {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: ProductFormValues, imageFile: File | null) => Promise<boolean>;
};

type ProductDrawerPanelProps = Omit<ProductDrawerProps, "open">;

function productToForm(product: Product | null): ProductFormValues {
  if (!product) {
    return emptyProduct;
  }

  return {
    ...product,
    category: normalizeCarouselCategory(product.category),
    mercado_livre_url: product.mercado_livre_url || "",
    shopee_url: product.shopee_url || "",
    whatsapp_url: product.whatsapp_url || ""
  };
}

function ProductDrawerPanel({ product, loading, onClose, onSave }: ProductDrawerPanelProps) {
  const [form, setForm] = useState<ProductFormValues>(() => productToForm(product));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const slugPreview = form.id ? form.slug || slugify(form.name) : slugify(form.name);
  const imagePreviewUrl = previewUrl || form.image_url || "/assets/mel-propolis.png";
  const hasBuyLink = Boolean(form.mercado_livre_url || form.shopee_url || form.whatsapp_url);
  const missingFields = useMemo(() => {
    const fields: string[] = [];

    if (!form.name.trim()) {
      fields.push("nome do produto");
    }

    if (!form.category.trim()) {
      fields.push("carrossel");
    }

    return fields;
  }, [form.category, form.name]);
  const canSave = missingFields.length === 0 && !loading;

  function updateField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setDirty(true);
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" && !current.id ? { slug: slugify(String(value)) } : {})
    }));
  }

  function updateImageFile(file: File | null) {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setDirty(true);
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  function requestClose() {
    if (dirty && !window.confirm("Descartar alteracoes nao salvas?")) {
      return;
    }

    onClose();
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    const saved = await onSave({ ...form, slug: slugPreview }, imageFile);

    if (saved) {
      onClose();
    }
  }

  return (
    <div className="admin-drawer-root" role="presentation">
      <button className="admin-drawer-overlay" type="button" aria-label="Fechar painel" onClick={requestClose} />
      <aside className="admin-drawer" aria-label={product ? "Editar produto" : "Novo produto"}>
        <form className="admin-drawer-form" onSubmit={submitForm}>
          <header className="admin-drawer-header">
            <div>
              <span className="eyebrow"><i /> Produto</span>
              <h2>{product ? "Editar produto" : "Novo produto"}</h2>
            </div>
            <button className="admin-icon-button" type="button" onClick={requestClose} aria-label="Fechar">×</button>
          </header>

          <div className="admin-drawer-body">
            <label>
              Nome do produto *
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
            </label>
            <label>
              Slug automatico
              <input value={slugPreview} readOnly placeholder="gerado-automaticamente" />
            </label>
            <label>
              Descricao curta
              <textarea value={form.short_description} onChange={(event) => updateField("short_description", event.target.value)} rows={3} />
            </label>

            <div className="form-row">
              <label>
                Carrossel onde aparece *
                <select value={form.category} onChange={(event) => updateField("category", event.target.value)} required>
                  {carouselCategories.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <small className="field-help">
                  {carouselCategories.find((item) => item.value === form.category)?.description}
                </small>
              </label>
              <label>
                Peso/volume
                <input value={form.weight} onChange={(event) => updateField("weight", event.target.value)} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Etiqueta
                <input value={form.tag} onChange={(event) => updateField("tag", event.target.value)} />
              </label>
              <label>
                Cor da etiqueta
                <select value={form.tag_variant} onChange={(event) => updateField("tag_variant", event.target.value as ProductFormValues["tag_variant"])}>
                  <option value="default">Amarela</option>
                  <option value="soft">Suave</option>
                  <option value="dark">Escura</option>
                  <option value="blue">Azul</option>
                </select>
              </label>
            </div>

            <label>
              Imagem por upload
              <input type="file" accept="image/*" onChange={(event) => updateImageFile(event.target.files?.[0] || null)} />
            </label>
            <label>
              URL da imagem
              <input value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} placeholder="/assets/mel-propolis.png" />
            </label>
            <div className="admin-image-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreviewUrl} alt="Previa do produto" />
              <div>
                <strong>Previa da imagem</strong>
                <small>Uploads grandes sao convertidos para WebP antes de salvar.</small>
              </div>
            </div>

            <div className="admin-fieldset">
              <h3>Links de compra</h3>
              <p>Preencha pelo menos um link quando o produto ja estiver pronto para venda.</p>
            </div>
            {!hasBuyLink ? <p className="admin-warning">Produto sem link de compra. Voce pode salvar assim e cadastrar os links depois.</p> : null}
            <label>
              Link Mercado Livre
              <input value={form.mercado_livre_url || ""} onChange={(event) => updateField("mercado_livre_url", event.target.value)} placeholder="https://..." />
            </label>
            <label>
              Link Shopee
              <input value={form.shopee_url || ""} onChange={(event) => updateField("shopee_url", event.target.value)} placeholder="https://..." />
            </label>
            <label>
              Link WhatsApp
              <input value={form.whatsapp_url || ""} onChange={(event) => updateField("whatsapp_url", event.target.value)} placeholder="https://wa.me/..." />
            </label>

            <div className="form-row">
              <label>
                Ordem
                <input type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", Number(event.target.value))} />
              </label>
              <label className="checkbox-label admin-active-toggle">
                <input type="checkbox" checked={form.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
                Ativo no site
              </label>
            </div>

            {missingFields.length ? <p className="admin-warning">Para salvar, preencha: {missingFields.join(", ")}.</p> : null}
          </div>

          <footer className="admin-drawer-footer">
            <button className="btn btn-ghost" type="button" onClick={requestClose}>Cancelar</button>
            <button className="btn btn-primary" type="submit" disabled={!canSave}>
              {loading ? "Salvando..." : product ? "Salvar alteracoes" : "Cadastrar produto"}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
}

export function ProductDrawer({ open, product, loading, onClose, onSave }: ProductDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <ProductDrawerPanel
      key={`${product?.id || "new"}-${product?.slug || ""}-${product?.name || ""}`}
      product={product}
      loading={loading}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
