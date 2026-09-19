-- Phase 4: homepage CMS and secure public project publication layer.

create table public.hero_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key='default'),
  eyebrow text not null default 'WISDOM / WIKIS TECH · LAGOS, NG',
  headline_line_1 text not null default 'I BUILD DIGITAL',
  headline_line_2 text not null default 'THINGS THAT',
  supporting_text text not null default 'Software developer, product builder and creative technologist combining code, design, AI and business thinking to turn ideas into useful digital experiences.',
  location text not null default 'Lagos, NG',
  availability_enabled boolean not null default true,
  availability_message text not null default 'Available for selected freelance & collaboration opportunities',
  primary_cta_label text not null default 'View Selected Work ↓',
  primary_cta_url text not null default '#work',
  secondary_cta_label text not null default 'Let''s Work Together ↗',
  secondary_cta_url text not null default '/contact',
  rotating_words jsonb not null default '["WORK.","MATTER.","MOVE.","SCALE.","CONNECT."]'::jsonb,
  rotation_enabled boolean not null default true,
  rotation_interval_ms integer not null default 2200 check (rotation_interval_ms between 800 and 10000),
  hero_media_url text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  title text,
  description text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique(page_key,section_key)
);

create table public.project_publications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  slug text not null unique,
  title text not null,
  short_description text,
  status public.project_status not null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  confidential boolean not null default false,
  snapshot jsonb not null,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hero_settings enable row level security;
alter table public.page_sections enable row level security;
alter table public.project_publications enable row level security;

revoke all on public.hero_settings from anon, authenticated;
revoke all on public.page_sections from anon, authenticated;
revoke all on public.project_publications from anon, authenticated;

grant select on public.hero_settings to anon, authenticated;
grant select on public.page_sections to anon, authenticated;
grant select on public.project_publications to anon, authenticated;
grant insert,update,delete on public.hero_settings to authenticated;
grant insert,update,delete on public.page_sections to authenticated;
grant insert,update,delete on public.project_publications to authenticated;

create policy "hero_public_read" on public.hero_settings for select to anon, authenticated using (true);
create policy "hero_cms_write" on public.hero_settings for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

create policy "sections_public_read" on public.page_sections for select to anon, authenticated using (enabled = true or (select private.is_cms_user()));
create policy "sections_cms_write" on public.page_sections for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

create policy "project_publications_public_read" on public.project_publications for select to anon, authenticated using (true);
create policy "project_publications_cms_write" on public.project_publications for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));

-- Important: public visitors must not read mutable project draft rows directly.
revoke select on public.projects from anon;
revoke select on public.project_category_links from anon;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_cms_read" on public.projects for select to authenticated using ((select private.is_cms_user()));

insert into public.hero_settings(singleton_key) values ('default') on conflict(singleton_key) do nothing;

insert into public.page_sections(page_key,section_key,title,description,enabled,sort_order)
values
('home','hero','Hero',null,true,10),
('home','selected_work','Selected Work','A selection of products, systems, campaigns and experiments I''ve helped bring to life.',true,20),
('home','about_preview','About Preview',null,true,30),
('home','capabilities','Capabilities',null,true,40),
('home','creative_archive','Creative Archive',null,true,50),
('home','lab_preview','Lab Preview',null,true,60),
('home','services','Services',null,true,70),
('home','pricing','Pricing',null,true,80),
('home','now','Now',null,true,90),
('home','contact_cta','Contact CTA',null,true,100)
on conflict(page_key,section_key) do nothing;

create index page_sections_page_sort_idx on public.page_sections(page_key,sort_order);
create index project_publications_featured_sort_idx on public.project_publications(featured,sort_order,published_at desc);
