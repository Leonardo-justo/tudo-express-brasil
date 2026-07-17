"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ProductDrawer } from "@/components/admin/ProductDrawer";
import { ProductFilters, type ProductStatusFilter } from "@/components/admin/ProductFilters";
import { ProductGrid } from "@/components/admin/ProductGrid";
import { normalizeCarouselCategory, normalizeProduct, optimizeImage } from "@/components/admin/admin-product-utils";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, ProductFormValues } from "@/types/product";

type MessageKind = "success" | "error" | "info";

export function AdminClient() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<MessageKind>("info");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all");

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

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  function setAdminMessage(text: string, kind: MessageKind = "info") {
    setMessage(text);
    setMessageKind(kind);
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
    setDrawerOpen(false);
    setEditingProduct(null);
    setDeleteTarget(null);
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

  async function uploadImage(file: File | null, fallbackUrl: string) {
    if (!supabase || !file) {
      return fallbackUrl;
    }

    const optimizedFile = await optimizeImage(file);
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

  async function saveProduct(values: ProductFormValues, imageFile: File | null) {
    if (!supabase) {
      return false;
    }

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = await uploadImage(imageFile, values.image_url);
      const payload = normalizeProduct({ ...values, image_url: imageUrl });
      const { error } = await supabase.from("products").upsert(payload, { onConflict: "id" });

      if (error) {
        throw error;
      }

      setAdminMessage(values.id ? "Alterações salvas." : "Produto cadastrado com sucesso.", "success");
      setEditingProduct(null);
      await loadProducts();
      return true;
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : "Não foi possível salvar o produto.", "error");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!supabase) {
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      setAdminMessage("Não foi possível excluir o produto.", "error");
    } else {
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setDeleteTarget(null);
      setAdminMessage("Produto excluído.", "success");
    }

    setLoading(false);
  }

  async function toggleActive(product: Product) {
    if (!supabase) {
      return;
    }

    setLoading(true);

    const nextStatus = !product.is_active;
    const { error } = await supabase.from("products").update({ is_active: nextStatus }).eq("id", product.id);

    if (error) {
      setAdminMessage("Não foi possível alterar o status.", "error");
    } else {
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, is_active: nextStatus } : item));
      setAdminMessage(nextStatus ? "Produto ativado." : "Produto desativado.", "success");
    }

    setLoading(false);
  }

  function openCreateDrawer() {
    setEditingProduct(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(product: Product) {
    setEditingProduct(product);
    setDrawerOpen(true);
  }

  function duplicateProduct(product: Product) {
    setEditingProduct({
      ...product,
      id: undefined as unknown as string,
      name: `${product.name} - cópia`,
      slug: `${product.slug}-copia`,
      sort_order: product.sort_order + 1
    });
    setDrawerOpen(true);
    setAdminMessage("Produto duplicado. Revise os dados e salve como novo item.", "info");
  }

  const activeProducts = products.filter((product) => product.is_active).length;
  const inactiveProducts = products.length - activeProducts;
  const filteredProducts = products.filter((product) => {
    const search = debouncedSearch.trim().toLowerCase();
    const matchesSearch = !search || product.name.toLowerCase().includes(search);
    const matchesCategory = categoryFilter === "all" || normalizeCarouselCategory(product.category) === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
    <main className="admin-shell admin-redesign">
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

      <section className="admin-hero admin-dashboard-hero">
        <div>
          <span className="eyebrow"><i /> Painel de produtos</span>
          <h1>Gerencie a vitrine com poucos cliques.</h1>
          <p>Cadastre, edite e organize os produtos que aparecem no site da Tudo Express Brasil.</p>
        </div>
        <button className="btn btn-primary admin-new-product" type="button" onClick={openCreateDrawer}>+ Novo produto</button>
      </section>

      <section className="admin-overview" aria-label="Resumo dos produtos">
        <div className="admin-stat-card">
          <span>Total</span>
          <strong>{products.length}</strong>
          <small>produtos cadastrados</small>
        </div>
        <div className="admin-stat-card success">
          <span>No site</span>
          <strong>{activeProducts}</strong>
          <small>visíveis para clientes</small>
        </div>
        <div className="admin-stat-card muted">
          <span>Ocultos</span>
          <strong>{inactiveProducts}</strong>
          <small>não aparecem na vitrine</small>
        </div>
      </section>

      {message ? <p className={`admin-message ${messageKind} admin-toast`}>{message}</p> : null}

      <section className="admin-card admin-products-panel">
        <div className="admin-section-title">
          <h2>Produtos cadastrados</h2>
          <div>
            <button type="button" onClick={() => void loadProducts()} disabled={loading}>Atualizar</button>
          </div>
        </div>
        <ProductFilters
          search={searchInput}
          category={categoryFilter}
          status={statusFilter}
          resultCount={filteredProducts.length}
          onSearchChange={setSearchInput}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onEdit={openEditDrawer}
          onDuplicate={duplicateProduct}
          onToggleActive={(product) => void toggleActive(product)}
          onDelete={setDeleteTarget}
        />
      </section>

      <ProductDrawer
        open={drawerOpen}
        product={editingProduct}
        loading={loading}
        onClose={() => {
          setDrawerOpen(false);
          setEditingProduct(null);
        }}
        onSave={saveProduct}
      />
      <DeleteConfirmDialog
        product={deleteTarget}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={(product) => void removeProduct(product)}
      />
    </main>
  );
}
