-- Phase 6: Lab, Services, Pricing, Now, CRAFT framework.

create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  status text not null default 'experiment' check (status in ('experiment','prototype','in_development','published','archived')),
  technology text[] not null default '{}',
  image_url text,
  video_url text,
  github_url text,
  demo_url text,
  experiment_date date,
  case_study text,
  featured boolean not null default false,
  visibility text not null default 'draft' check (visibility in ('draft','public','private','archived')),
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text,
  icon text,
  featured_image_url text,
  starting_price numeric(14,2) check (starting_price is null or starting_price >= 0),
  currency text not null default 'NGN',
  cta_label text not null default 'Let''s talk ↗',
  cta_url text not null default '/contact',
  featured boolean not null default false,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.pricing_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key='default'),
  enabled boolean not null default true,
  heading text not null default 'Let''s talk scope.',
  description text not null default 'Every project is different. These ranges give you somewhere to start—not somewhere negotiations have to end.',
  footer_heading text not null default 'Have something unusual in mind? Good.',
  footer_text text not null default 'Tell me what you''re trying to build, your timeline and your budget. We''ll figure out an approach that makes sense for both sides.',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.pricing_packages (
  id uuid primary key default gen_random_uuid(),
  package_name text not null,
  subtitle text,
  currency text not null default 'NGN',
  starting_price numeric(14,2) check (starting_price is null or starting_price >= 0),
  custom_quote boolean not null default false,
  description text,
  included_features text[] not null default '{}',
  cta_text text not null default 'Request a Quote ↗',
  cta_url text not null default '/quote',
  featured boolean not null default false,
  visibility boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.service_pricing_links (
  service_id uuid not null references public.services(id) on delete cascade,
  pricing_package_id uuid not null references public.pricing_packages(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (service_id, pricing_package_id)
);

create table public.now_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  text text not null,
  url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.craft_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key='default'),
  heading text not null default 'CRAFT',
  message text not null default 'AI rewards clarity. Better instructions create better outcomes.',
  context_label text not null default 'Context',
  role_label text not null default 'Role',
  action_label text not null default 'Action',
  format_label text not null default 'Format',
  tone_label text not null default 'Tone / Limits',
  usage_items text[] not null default array['Research','Development','Design','Content','Productivity']::text[],
  enabled boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.experiments enable row level security;
alter table public.services enable row level security;
alter table public.pricing_settings enable row level security;
alter table public.pricing_packages enable row level security;
alter table public.service_pricing_links enable row level security;
alter table public.now_items enable row level security;
alter table public.craft_settings enable row level security;

grant select on public.experiments, public.services, public.pricing_settings, public.pricing_packages, public.service_pricing_links, public.now_items, public.craft_settings to anon, authenticated;
grant insert, update, delete on public.experiments, public.services, public.pricing_settings, public.pricing_packages, public.service_pricing_links, public.now_items, public.craft_settings to authenticated;

create policy "experiments_public_read" on public.experiments for select to anon, authenticated using ((visibility='public' and deleted_at is null) or (select private.is_cms_user()));
create policy "experiments_cms_insert" on public.experiments for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "experiments_cms_update" on public.experiments for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "experiments_admin_delete" on public.experiments for delete to authenticated using ((select private.is_admin()));

create policy "services_public_read" on public.services for select to anon, authenticated using ((enabled=true and deleted_at is null) or (select private.is_cms_user()));
create policy "services_cms_insert" on public.services for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "services_cms_update" on public.services for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "services_admin_delete" on public.services for delete to authenticated using ((select private.is_admin()));

create policy "pricing_settings_public_read" on public.pricing_settings for select to anon, authenticated using (true);
create policy "pricing_settings_cms_write" on public.pricing_settings for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

create policy "pricing_packages_public_read" on public.pricing_packages for select to anon, authenticated using ((visibility=true and deleted_at is null) or (select private.is_cms_user()));
create policy "pricing_packages_cms_insert" on public.pricing_packages for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "pricing_packages_cms_update" on public.pricing_packages for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "pricing_packages_admin_delete" on public.pricing_packages for delete to authenticated using ((select private.is_admin()));

create policy "service_pricing_links_public_read" on public.service_pricing_links for select to anon, authenticated using ((exists(select 1 from public.services s where s.id=service_pricing_links.service_id and s.enabled=true and s.deleted_at is null) and exists(select 1 from public.pricing_packages p where p.id=service_pricing_links.pricing_package_id and p.visibility=true and p.deleted_at is null)) or (select private.is_cms_user()));
create policy "service_pricing_links_cms_write" on public.service_pricing_links for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

create policy "now_public_read" on public.now_items for select to anon, authenticated using (visible=true or (select private.is_cms_user()));
create policy "now_cms_insert" on public.now_items for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "now_cms_update" on public.now_items for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "now_cms_delete" on public.now_items for delete to authenticated using ((select private.is_cms_user()));

create policy "craft_public_read" on public.craft_settings for select to anon, authenticated using (true);
create policy "craft_cms_write" on public.craft_settings for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

insert into public.pricing_settings(singleton_key) values ('default') on conflict(singleton_key) do nothing;
insert into public.craft_settings(singleton_key) values ('default') on conflict(singleton_key) do nothing;

create index experiments_public_sort_idx on public.experiments(visibility,deleted_at,featured,sort_order);
create index services_enabled_sort_idx on public.services(enabled,deleted_at,featured,sort_order);
create index pricing_visible_sort_idx on public.pricing_packages(visibility,deleted_at,featured,sort_order);
create index now_visible_sort_idx on public.now_items(visible,sort_order);
