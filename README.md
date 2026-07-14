# Tudo Express Brasil

Site institucional com vitrine dinâmica e painel administrativo para a Tudo Express Brasil.

O projeto usa:

- Next.js
- Vercel
- Supabase Auth
- Supabase Database
- Supabase Storage

O tema visual original foi preservado. A principal evolução está na estrutura: os produtos deixam de ficar fixos no código e passam a ser gerenciados pelo painel `/admin`.

## Funcionalidades

- Site público responsivo para computador, tablet e celular.
- Produtos vindos do Supabase.
- Produtos de fallback para o site não ficar vazio enquanto o Supabase não estiver configurado.
- Painel `/admin` com login.
- Cadastro, edição, ativação/desativação e exclusão de produtos.
- Upload de imagem para o Supabase Storage.
- Campo para link do Mercado Livre.
- Campo para link da Shopee.
- Campo para link do WhatsApp.
- SEO técnico, sitemap, robots, Open Graph e dados estruturados.

## Estrutura

```text
src/app
  page.tsx           Site público
  admin/page.tsx     Entrada do administrador
  globals.css        Tema visual do site e admin

src/components
  ProductCard.tsx
  Reveal.tsx
  SiteHeader.tsx
  admin/AdminClient.tsx

src/lib
  products.ts        Busca produtos públicos
  seed-products.ts   Produtos de fallback
  supabase.ts        Cliente Supabase

supabase/migrations
  SQL para banco, segurança e storage

public
  assets/
  robots.txt
  sitemap.xml
  favicon.svg
  site.webmanifest
```

## Rodar localmente

Instale dependências:

```bash
npm install
```

Crie `.env.local` baseado no `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

Rode:

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
http://localhost:3000/admin
```

## Supabase

Siga o guia:

```text
docs/supabase-admin.md
```

Resumo:

1. Criar projeto no Supabase.
2. Rodar o SQL em `supabase/migrations/202607140001_create_products_admin.sql`.
3. Criar usuário em Authentication > Users.
4. Cadastrar esse usuário em `public.app_admins`.
5. Configurar as variáveis na Vercel.

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositório na Vercel.
3. Framework: Next.js.
4. Configure as variáveis:

```env
NEXT_PUBLIC_SITE_URL=https://tudoexpressbrasil.com.br
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

5. Faça deploy.
6. Em Settings > Domains, vincule `tudoexpressbrasil.com.br`.

## SEO

Depois do domínio ativo:

- sitemap: `https://tudoexpressbrasil.com.br/sitemap.xml`
- robots: `https://tudoexpressbrasil.com.br/robots.txt`
- admin bloqueado para indexação: `/admin`

Recomendação: cadastrar no Google Search Console e enviar o sitemap.
