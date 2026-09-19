-- Phase 3: projects CMS with categories, ordered content blocks, publishing snapshots and confidentiality.

create type public.project_status as enum (
  'shipped',
  'live',
  'in_development',
  'prototype',
  'experiment',
  'concept',
  'archived'
);

create type public.content_state as enum ('draft', 'published');

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  year integer check (year is null or year between 2000 and 2100),
  client text,
  role text,
  status public.project_status not null default 'in_development',
  visibility text not null default 'public' check (visibility in ('public','private')),
  featured boolean not null default false,
  confidential boolean not null default false,
  hero_media_id uuid references public.media_library(id) on delete set null,
  card_media_id uuid references public.media_library(id) on delete set null,
  live_url text,
  github_url text,
  sort_order integer not null default 0,
  content_state public.content_state not null default 'draft',
  published_snapshot jsonb,
  published_at timestamptz,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_category_links (
  project_id uuid not null references public.projects(id) on delete cascade,
  category_id uuid not null references public.project_categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, category_id)
);

create table public.project_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  block_type text not null check (
    block_type in (
      'heading','paragraph','image','gallery','video','quote','stats',
      'two_column','full_width_image','technology','before_after',
      'embed','spacer','cta'
    )
  ),
  sort_order integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_category_links enable row level security;
alter table public.project_blocks enable row level security;

revoke all on table public.project_categories from anon, authenticated;
revoke all on table public.projects from anon, authenticated;
revoke all on table public.project_category_links from anon, authenticated;
revoke all on table public.project_blocks from anon, authenticated;

grant select on public.project_categories to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.project_category_links to anon, authenticated;
grant select on public.project_blocks to authenticated;

grant insert, update, delete on public.project_categories to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert, update, delete on public.project_category_links to authenticated;
grant insert, update, delete on public.project_blocks to authenticated;

create policy "categories_public_read"
on public.project_categories for select to anon, authenticated
using (is_visible = true or (select private.is_cms_user()));

create policy "categories_cms_write"
on public.project_categories for all to authenticated
using ((select private.is_cms_user()))
with check ((select private.is_cms_user()));

create policy "projects_public_read"
on public.projects for select to anon, authenticated
using (
  (
    content_state = 'published'
    and visibility = 'public'
    and deleted_at is null
    and archived_at is null
  )
  or (select private.is_cms_user())
);

create policy "projects_cms_insert"
on public.projects for insert to authenticated
with check (
  (select private.is_cms_user())
  and created_by = (select auth.uid())
  and updated_by = (select auth.uid())
);

create policy "projects_cms_update"
on public.projects for update to authenticated
using ((select private.is_cms_user()))
with check (
  (select private.is_cms_user())
  and updated_by = (select auth.uid())
);

create policy "projects_admin_delete"
on public.projects for delete to authenticated
using ((select private.is_admin()));

create policy "project_category_links_public_read"
on public.project_category_links for select to anon, authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.project_categories c on c.id = project_category_links.category_id
    where p.id = project_category_links.project_id
      and p.content_state = 'published'
      and p.visibility = 'public'
      and p.deleted_at is null
      and p.archived_at is null
      and c.is_visible = true
  )
  or (select private.is_cms_user())
);

create policy "project_category_links_cms_write"
on public.project_category_links for all to authenticated
using ((select private.is_cms_user()))
with check ((select private.is_cms_user()));

create policy "project_blocks_cms_read"
on public.project_blocks for select to authenticated
using ((select private.is_cms_user()));

create policy "project_blocks_cms_write"
on public.project_blocks for all to authenticated
using ((select private.is_cms_user()))
with check ((select private.is_cms_user()));

create index projects_state_visibility_idx
  on public.projects (content_state, visibility, deleted_at, archived_at);
create index projects_featured_sort_idx
  on public.projects (featured, sort_order) where deleted_at is null;
create index project_blocks_project_sort_idx
  on public.project_blocks (project_id, sort_order);
create index project_category_links_category_idx
  on public.project_category_links (category_id, project_id);

insert into public.project_categories (name, slug, sort_order)
values
  ('Software','software',10),
  ('Product','product',20),
  ('UI/UX','ui-ux',30),
  ('Graphic Design','graphic-design',40),
  ('AI','ai',50),
  ('Creative','creative',60),
  ('Branding','branding',70),
  ('Business Research','business-research',80),
  ('Presentation','presentation',90),
  ('Experiment','experiment',100)
on conflict (slug) do nothing;
