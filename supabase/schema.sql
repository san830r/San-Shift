-- San Shift Supabase schema.
-- Run once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric,
  original_price numeric,
  available boolean not null default false,
  image text not null default '',
  tagline text not null default '',
  short_description text not null default '',
  stats jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "products are writable by admins"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- site_content (singleton row holding everything except products)
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id smallint primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

alter table public.site_content enable row level security;

create policy "site_content is publicly readable"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "site_content is writable by admins"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- Seed an empty row so the app has something to upsert into.
-- (scripts/seed-supabase.mjs overwrites this with real content.)
insert into public.site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Storage: product images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product images are writable by admins"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
