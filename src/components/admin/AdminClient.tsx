"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { seedProducts } from "@/lib/seed-products";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, ProductFormValues } from "@/types/product";

type MessageKind = "success" | "error" | "info";

const emptyProduct: ProductFormValues = {
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

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeProduct(values: ProductFormValues) {
  return {
    ...values,
    slug: values.slug || slugify(values.name),
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

async function optimizeImage(file: File) {
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

export function AdminClient() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormValues>(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<MessageKind>("info");
  const [previewUrl, setPreviewUrl] = useState("/assets/mel-propolis.png");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
      setSessionReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (signedIn) {
      void loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  function setAdminMessage(text: string, kind: MessageKind = "info") {
    setMessage(text);
    setMessageKind(kind);
  }

  function updateImageFile(file: File | null) {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAdminMessage("Não foi possível entrar. Confira e-mail, senha e permissão de administrador.", "error");
    }

    setLoading(false);
  }

  async function logout() {
    await supabase?.auth.signOut();
    setProducts([]);
    setForm(emptyProduct);
    updateImageFile(null);
  }

  async function loadProducts() {
    if (!supabase) {
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setAdminMessage("Não foi possível carregar produtos. Verifique se o SQL foi aplicado no Supabase.", "error");
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  async function uploadImage() {
    if (!supabase || !imageFile) {
      return form.image_url;
    }

    const optimizedFile = await optimizeImage(imageFile);
    const extension = optimizedFile.name.split(".").pop() || "webp";
    const fileName = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, optimizedFile, {
        cacheControl: "31536000",
        upsert: false
      });

    if (error) {
      throw new Error("Não foi possível enviar a imagem. Confira o bucket product-images no Supabase.");
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = await uploadImage();
      const payload = normalizeProduct({ ...form, image_url: imageUrl });

      const { error } = await supabase
        .from("products")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        throw error;
      }

      setAdminMessage(form.id ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.", "success");
      setForm(emptyProduct);
      updateImageFile(null);
      await loadProducts();
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : "Não foi possível salvar o produto.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!supabase || !window.confirm(`Excluir "${product.name}" definitivamente?`)) {
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      setAdminMessage("Não foi possível excluir o produto.", "error");
    } else {
      setAdminMessage("Produto excluído.", "success");
      await loadProducts();
    }

    setLoading(false);
  }

  async function toggleActive(product: Product) {
    if (!supabase) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      setAdminMessage("Não foi possível alterar o status.", "error");
    } else {
      setAdminMessage(product.is_active ? "Produto desativado." : "Produto ativado.", "success");
      await loadProducts();
    }

    setLoading(false);
  }

  async function importSeedCatalog() {
    if (!supabase) {
      return;
    }

    setLoading(true);
    setMessage("");

    const existingSlugs = new Set(products.map((product) => product.slug));
    const productsToImport = seedProducts
      .filter((product) => !existingSlugs.has(product.slug))
      .map((product) => ({
        name: product.name,
        slug: product.slug,
        short_description: product.short_description,
        image_url: product.image_url,
        category: product.category,
        weight: product.weight,
        tag: product.tag,
        tag_variant: product.tag_variant,
        mercado_livre_url: product.mercado_livre_url,
        shopee_url: product.shopee_url,
        whatsapp_url: product.whatsapp_url,
        is_active: product.is_active,
        is_featured: product.is_featured,
        sort_order: product.sort_order
      }));

    if (productsToImport.length === 0) {
      setAdminMessage("Catálogo base já está cadastrado no Supabase.", "info");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("products").insert(productsToImport);

    if (error) {
      setAdminMessage("Não foi possível importar o catálogo base. Confira se este usuário é administrador.", "error");
    } else {
      setAdminMessage(`${productsToImport.length} produto(s) importado(s) para o Supabase.`, "success");
      await loadProducts();
    }

    setLoading(false);
  }

  function editProduct(product: Product) {
    setForm({
      ...product,
      mercado_livre_url: product.mercado_livre_url || "",
      shopee_url: product.shopee_url || "",
      whatsapp_url: product.whatsapp_url || ""
    });
    updateImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function duplicateProduct(product: Product) {
    setForm({
      ...product,
      id: undefined,
      name: `${product.name} - cópia`,
      slug: `${product.slug}-copia`,
      mercado_livre_url: product.mercado_livre_url || "",
      shopee_url: product.shopee_url || "",
      whatsapp_url: product.whatsapp_url || "",
      sort_order: product.sort_order + 1
    });
    updateImageFile(null);
    setAdminMessage("Produto duplicado no formulário. Revise os dados e salve como novo item.", "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" && !current.id ? { slug: slugify(String(value)) } : {})
    }));
  }

  const imagePreviewUrl = previewUrl || form.image_url || "/assets/mel-propolis.png";

  if (!isSupabaseConfigured || !supabase) {
    return (
      <main className="admin-shell">
        <section className="admin-card admin-empty">
          <span className="eyebrow"><i /> Configuração pendente</span>
          <h1>Conecte o Supabase para liberar o administrador.</h1>
          <p>Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel e no `.env.local` para usar o painel.</p>
        </section>
      </main>
    );
  }

  if (!sessionReady) {
    return <main className="admin-shell"><section className="admin-card">Carregando painel...</section></main>;
  }

  if (!signedIn) {
    return (
      <main className="admin-shell admin-login">
        <form className="admin-card login-card" onSubmit={login}>
          <span className="eyebrow"><i /> Tudo Express Brasil</span>
          <h1>Entrar no administrador</h1>
          <p>Use o e-mail autorizado no Supabase para gerenciar os produtos do site.</p>
          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {message ? <p className={`admin-message ${messageKind}`}>{message}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <Link href="/" className="admin-back">Voltar para o site</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark brand-logo-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-tudo-express-transparente-trim.png" alt="" />
          </span>
          <span><strong>Tudo Express</strong><small>Admin</small></span>
        </Link>
        <div>
          <a className="btn btn-ghost" href="/" target="_blank">Ver site</a>
          <button className="btn btn-primary" type="button" onClick={logout}>Sair</button>
        </div>
      </header>

      <section className="admin-hero">
        <span className="eyebrow"><i /> Painel de produtos</span>
        <h1>Gerencie a vitrine sem mexer no código.</h1>
        <p>Cadastre produtos, controle o que aparece no site e adicione links de compra do Mercado Livre, Shopee ou WhatsApp.</p>
      </section>

      <div className="admin-grid">
        <form className="admin-card product-form" onSubmit={saveProduct}>
          <div className="admin-section-title">
            <h2>{form.id ? "Editar produto" : "Novo produto"}</h2>
            {form.id ? <button type="button" onClick={() => { setForm(emptyProduct); updateImageFile(null); }}>Limpar</button> : null}
          </div>

          <label>
            Nome do produto
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          </label>
          <label>
            Slug
            <input value={form.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} required />
          </label>
          <label>
            Descrição curta
            <textarea value={form.short_description} onChange={(event) => updateField("short_description", event.target.value)} rows={3} required />
          </label>

          <div className="form-row">
            <label>
              Categoria/marca
              <input value={form.category} onChange={(event) => updateField("category", event.target.value)} />
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
            Ou URL da imagem
            <input value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} placeholder="/assets/mel-propolis.png" />
          </label>
          <div className="admin-image-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreviewUrl} alt="Prévia do produto" />
            <div>
              <strong>Prévia da imagem</strong>
              <small>Uploads grandes são convertidos para WebP antes de salvar.</small>
            </div>
          </div>

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
            <label className="checkbox-label">
              <input type="checkbox" checked={form.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
              Ativo no site
            </label>
          </div>

          {message ? <p className={`admin-message ${messageKind}`}>{message}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Salvando..." : form.id ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </form>

        <section className="admin-card product-list">
          <div className="admin-section-title">
            <h2>Produtos cadastrados</h2>
            <div>
              <button type="button" onClick={() => void importSeedCatalog()} disabled={loading}>Importar catálogo base</button>
              <button type="button" onClick={() => void loadProducts()} disabled={loading}>Atualizar</button>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="empty-list">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="admin-products">
              {products.map((product) => (
                <article className={`admin-product${product.is_active ? "" : " inactive"}`} key={product.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image_url || "/assets/mel-propolis.png"} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.category} • {product.weight || "sem peso"} • ordem {product.sort_order}</small>
                    <p>{product.short_description}</p>
                    <div className="admin-actions">
                      <button type="button" onClick={() => editProduct(product)}>Editar</button>
                      <button type="button" onClick={() => duplicateProduct(product)}>Duplicar</button>
                      <button type="button" onClick={() => void toggleActive(product)}>{product.is_active ? "Desativar" : "Ativar"}</button>
                      <button type="button" className="danger" onClick={() => void removeProduct(product)}>Excluir</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
