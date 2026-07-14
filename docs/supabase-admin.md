# Configuração do administrador

Este projeto usa Supabase para autenticação, banco de dados e imagens dos produtos.

## 1. Criar o projeto no Supabase

Crie um projeto no Supabase e copie:

- Project URL
- publishable key

Esses valores entram no `.env.local` e na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

## 2. Rodar o SQL

No Supabase, abra SQL Editor e execute o arquivo:

```text
supabase/migrations/202607140001_create_products_admin.sql
```

Ele cria:

- tabela `products`
- tabela `app_admins`
- função `is_admin()`
- políticas de segurança
- bucket `product-images`
- produtos iniciais

## 3. Criar usuário do cliente

No Supabase:

1. Vá em Authentication > Users.
2. Clique em “Add user”.
3. Crie o e-mail e senha do cliente.
4. Copie o `User UID`.

Depois rode no SQL Editor:

```sql
insert into public.app_admins (user_id, email)
values ('COLE_AQUI_O_USER_UID', 'email-do-cliente@exemplo.com')
on conflict (user_id) do nothing;
```

Somente usuários cadastrados em `app_admins` conseguem criar, editar e excluir produtos.

## 4. Acessar o painel

Depois do deploy:

```text
https://tudoexpressbrasil.com.br/admin
```

## 5. Campos do produto

O painel permite gerenciar:

- nome
- slug
- descrição curta
- categoria/marca
- peso/volume
- etiqueta e cor da etiqueta
- upload de imagem
- URL de imagem
- link Mercado Livre
- link Shopee
- link WhatsApp
- ordem de exibição
- ativo/inativo

Se o produto não tiver link de compra, o site mostra a opção de consultar pelo WhatsApp.
