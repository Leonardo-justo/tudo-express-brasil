create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null,
  image_url text not null default '/assets/mel-propolis.png',
  category text not null default 'Onda Mel',
  weight text not null default '',
  tag text not null default 'Novo',
  tag_variant text not null default 'default' check (tag_variant in ('default', 'soft', 'dark', 'blue')),
  mercado_livre_url text,
  shopee_url text,
  whatsapp_url text,
  is_active boolean not null default true,
  is_featured boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.app_admins
    where app_admins.user_id = auth.uid()
  );
$$;

alter table public.products enable row level security;
alter table public.app_admins enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read admin list" on public.app_admins;
create policy "Admins can read admin list"
on public.app_admins
for select
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

insert into public.products (
  name,
  slug,
  short_description,
  image_url,
  category,
  weight,
  tag,
  tag_variant,
  mercado_livre_url,
  shopee_url,
  whatsapp_url,
  is_active,
  is_featured,
  sort_order
)
values
  (
    'Mel com Própolis',
    'mel-com-propolis',
    'Sabor marcante em uma combinação especial e 100% natural.',
    '/assets/mel-propolis.png',
    'Onda Mel',
    '500g',
    'Novidade',
    'default',
    'https://www.mercadolivre.com.br/mel-puro-com-propolis-onda-mel-500g/up/MLBU4130443166',
    null,
    null,
    true,
    true,
    1
  ),
  (
    'Florada Laranjeira',
    'mel-florada-laranjeira',
    'Aroma delicado, sabor suave e a doçura equilibrada da natureza.',
    '/assets/mel-laranjeira.png',
    'Onda Mel',
    '500g',
    'Floral',
    'soft',
    'https://www.mercadolivre.com.br/mel-puro-onda-mel-laranjeira-500g/up/MLBU4101000879',
    null,
    null,
    true,
    true,
    2
  ),
  (
    'Florada Silvestre',
    'mel-florada-silvestre',
    'O sabor tradicional do mel puro para acompanhar todos os momentos.',
    '/assets/mel-silvestre.png',
    'Onda Mel',
    '500g',
    'Clássico',
    'dark',
    'https://www.mercadolivre.com.br/mel-puro-onda-mel-silvestre-500g/up/MLBU4162463179',
    null,
    null,
    true,
    true,
    3
  ),
  (
    'Mel em Sachê',
    'mel-em-sache',
    'Porções práticas para levar a energia natural do mel com você.',
    '/assets/mel-sache.png',
    'Onda Mel',
    '32g',
    'Prático',
    'blue',
    'https://www.mercadolivre.com.br/mel-puro-em-blister-sache-onda-mel-32g/up/MLBU4130517538',
    null,
    null,
    true,
    true,
    4
  )
on conflict (slug) do update
set name = excluded.name,
    short_description = excluded.short_description,
    image_url = excluded.image_url,
    category = excluded.category,
    weight = excluded.weight,
    tag = excluded.tag,
    tag_variant = excluded.tag_variant,
    mercado_livre_url = excluded.mercado_livre_url,
    shopee_url = excluded.shopee_url,
    whatsapp_url = excluded.whatsapp_url,
    is_active = excluded.is_active,
    is_featured = excluded.is_featured,
    sort_order = excluded.sort_order;
