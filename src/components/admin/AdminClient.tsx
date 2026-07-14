"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, ProductFormValues } from "@/types/product";

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

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("Não foi possível entrar. Confira e-mail, senha e permissão de administrador.");
    }

    setLoading(false);
  }

  async function logout() {
    await supabase?.auth.signOut();
    setProducts([]);
    setForm(emptyProduct);
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
      setMessage("Não foi possível carregar produtos. Verifique se o SQL foi aplicado no Supabase.");
    } else {
      setProducts((data || []) as Product[]);
    }

    setLoading(false);
  }

  async function uploadImage() {
    if (!supabase || !imageFile) {
      return form.image_url;
    }

    const extension = imageFile.name.split(".").pop() || "png";
    const fileName = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile, {
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

      setMessage(form.id ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
      setForm(emptyProduct);
      setImageFile(null);
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar o produto.");
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
      setMessage("Não foi possível excluir o produto.");
    } else {
      setMessage("Produto excluído.");
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
      setMessage("Não foi possível alterar o status.");
    } else {
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
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateField<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" && !current.id ? { slug: slugify(String(value)) } : {})
    }));
  }

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
          {message ? <p className="admin-message">{message}</p> : null}
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
            <img src="/assets/logo-tudo-express.png" alt="" />
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
            {form.id ? <button type="button" onClick={() => setForm(emptyProduct)}>Limpar</button> : null}
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
            <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          </label>
          <label>
            Ou URL da imagem
            <input value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} placeholder="/assets/mel-propolis.png" />
          </label>

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

          {message ? <p className="admin-message">{message}</p> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Salvando..." : form.id ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </form>

        <section className="admin-card product-list">
          <div className="admin-section-title">
            <h2>Produtos cadastrados</h2>
            <button type="button" onClick={() => void loadProducts()}>Atualizar</button>
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
