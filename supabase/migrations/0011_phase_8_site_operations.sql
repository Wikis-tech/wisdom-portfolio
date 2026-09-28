-- Phase 8 — Site Operations: Navigation, SEO, Settings & Analytics Readiness
-- Supabase CLI was not available in this execution environment, so this migration
-- follows the repository's existing sequential migration convention.

alter table public.site_settings
  add column if not exists site_url text,
  add column if not exists nav_brand_name text not null default 'WIKIS TECH',
  add column if not exists contact_email text,
  add column if not exists whatsapp text,
  add column if not exists logo_url text,
  add column if not exists favicon_url text,
  add column if not exists resume_url text,
  add column if not exists copyright_text text,
  add column if not exists footer_tagline text not null default 'CODE × DESIGN × AI × STRATEGY',
  add column if not exists default_cta_label text not null default 'Let''s Work Together',
  add column if not exists default_cta_url text not null default '/contact';

alter table public.site_settings
  drop constraint if exists site_settings_site_url_https,
  add constraint site_settings_site_url_https check (site_url is null or site_url ~ '^https://'),
  drop constraint if exists site_settings_logo_url_https,
  add constraint site_settings_logo_url_https check (logo_url is null or logo_url ~ '^https://'),
  drop constraint if exists site_settings_favicon_url_https,
  add constraint site_settings_favicon_url_https check (favicon_url is null or favicon_url ~ '^https://'),
  drop constraint if exists site_settings_resume_url_https,
  add constraint site_settings_resume_url_https check (resume_url is null or resume_url ~ '^https://');

update public.site_settings
set site_url = coalesce(site_url,'https://wisdom-portfolio-five.vercel.app'),
    professional_name = 'Okoh Wisdom',
    copyright_text = coalesce(copyright_text,'© Okoh Wisdom / Wikis Tech'),
    updated_at = now()
where singleton_key='default';

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 60),
  href text not null check (char_length(href) between 1 and 500),
  location text not null default 'header' check (location in ('header','footer')),
  style text not null default 'link' check (style in ('link','cta')),
  is_external boolean not null default false,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(location, href)
);
alter table public.navigation_items enable row level security;
revoke all on table public.navigation_items from anon, authenticated;
grant select on table public.navigation_items to anon, authenticated;
grant insert, update, delete on table public.navigation_items to authenticated;
create policy "navigation_public_read" on public.navigation_items for select to anon using (enabled = true);
create policy "navigation_cms_select" on public.navigation_items for select to authenticated using ((select private.is_cms_user()));
create policy "navigation_cms_insert" on public.navigation_items for insert to authenticated with check ((select private.is_cms_user()));
create policy "navigation_cms_update" on public.navigation_items for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "navigation_cms_delete" on public.navigation_items for delete to authenticated using ((select private.is_cms_user()));
create index if not exists navigation_location_order_idx on public.navigation_items(location, enabled, sort_order);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (char_length(platform) between 1 and 50),
  label text not null check (char_length(label) between 1 and 80),
  url text not null check (url ~ '^https://'),
  username text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(platform, url)
);
alter table public.social_links enable row level security;
revoke all on table public.social_links from anon, authenticated;
grant select on table public.social_links to anon, authenticated;
grant insert, update, delete on table public.social_links to authenticated;
create policy "social_public_read" on public.social_links for select to anon using (enabled = true);
create policy "social_cms_select" on public.social_links for select to authenticated using ((select private.is_cms_user()));
create policy "social_cms_insert" on public.social_links for insert to authenticated with check ((select private.is_cms_user()));
create policy "social_cms_update" on public.social_links for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "social_cms_delete" on public.social_links for delete to authenticated using ((select private.is_cms_user()));
create index if not exists social_enabled_order_idx on public.social_links(enabled, sort_order);

create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique check (page_key ~ '^[a-z0-9_-]+$'),
  route_path text not null unique check (route_path like '/%'),
  title text not null check (char_length(title) between 2 and 80),
  description text not null check (char_length(description) between 20 and 320),
  og_image_url text check (og_image_url is null or og_image_url ~ '^https://'),
  canonical_url text check (canonical_url is null or canonical_url ~ '^https://'),
  noindex boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.seo_settings enable row level security;
revoke all on table public.seo_settings from anon, authenticated;
grant select on table public.seo_settings to anon, authenticated;
grant insert, update, delete on table public.seo_settings to authenticated;
create policy "seo_public_read" on public.seo_settings for select to anon using (true);
create policy "seo_cms_select" on public.seo_settings for select to authenticated using ((select private.is_cms_user()));
create policy "seo_cms_insert" on public.seo_settings for insert to authenticated with check ((select private.is_cms_user()));
create policy "seo_cms_update" on public.seo_settings for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "seo_cms_delete" on public.seo_settings for delete to authenticated using ((select private.is_cms_user()));

create table if not exists public.analytics_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key='default'),
  enabled boolean not null default false,
  provider text not null default 'none' check (provider in ('none','google_analytics')),
  measurement_id text,
  external_click_tracking boolean not null default true,
  conversion_tracking boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (provider='none' and measurement_id is null)
    or
    (provider='google_analytics' and measurement_id ~ '^G-[A-Z0-9]+$')
  )
);
alter table public.analytics_settings enable row level security;
revoke all on table public.analytics_settings from anon, authenticated;
grant select on table public.analytics_settings to anon, authenticated;
grant insert, update, delete on table public.analytics_settings to authenticated;
create policy "analytics_public_read" on public.analytics_settings for select to anon using (true);
create policy "analytics_cms_select" on public.analytics_settings for select to authenticated using ((select private.is_cms_user()));
create policy "analytics_cms_insert" on public.analytics_settings for insert to authenticated with check ((select private.is_cms_user()));
create policy "analytics_cms_update" on public.analytics_settings for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "analytics_cms_delete" on public.analytics_settings for delete to authenticated using ((select private.is_cms_user()));

alter table public.projects
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_image_url text,
  add column if not exists seo_noindex boolean not null default false;

alter table public.experiments
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_image_url text,
  add column if not exists seo_noindex boolean not null default false;

insert into public.navigation_items(label,href,location,style,is_external,enabled,sort_order)
values
 ('Work','/work','header','link',false,true,10),
 ('About','/about','header','link',false,true,20),
 ('Lab','/lab','header','link',false,true,30),
 ('Services','/services','header','link',false,true,40),
 ('Pricing','/pricing','header','link',false,true,50),
 ('Let''s Talk','/contact','header','cta',false,true,60),
 ('Work','/work','footer','link',false,true,10),
 ('About','/about','footer','link',false,true,20),
 ('Contact','/contact','footer','link',false,true,30),
 ('Request a Quote','/quote','footer','link',false,true,40)
on conflict(location,href) do update
set label=excluded.label, style=excluded.style, enabled=excluded.enabled, sort_order=excluded.sort_order, updated_at=now();

insert into public.social_links(platform,label,url,username,enabled,sort_order)
values ('github','GitHub','https://github.com/Wikis-tech','Wikis-tech',true,10)
on conflict(platform,url) do update
set label=excluded.label, username=excluded.username, enabled=excluded.enabled, sort_order=excluded.sort_order, updated_at=now();

insert into public.seo_settings(page_key,route_path,title,description,noindex)
values
 ('home','/','Okoh Wisdom — Websites, Digital Products & Intelligent Tools','I build useful websites, digital products and intelligent tools by combining software, design, AI and strategy.',false),
 ('work','/work','Selected Work — Okoh Wisdom','Case studies showing the problem, what I built, why it mattered and what changed.',false),
 ('about','/about','About — Okoh Wisdom','Learn about Okoh Wisdom, the thinking behind Wikis Tech, and the mix of software, design, AI and strategy behind the work.',false),
 ('archive','/archive','Design Archive — Okoh Wisdom','A visual archive of design work made to communicate, guide and persuade.',false),
 ('lab','/lab','Lab — Okoh Wisdom','Experiments, prototypes and interface studies exploring useful ideas through code, AI and design.',false),
 ('services','/services','Services — Okoh Wisdom','Software, product, design and AI support focused on turning real problems into useful digital solutions.',false),
 ('pricing','/pricing','Pricing — Okoh Wisdom','Flexible project pricing and starting points for websites, digital products, design and technology work.',false),
 ('contact','/contact','Contact — Okoh Wisdom','Have a problem worth solving or an idea worth building? Start a conversation with Okoh Wisdom.',false),
 ('quote','/quote','Request a Quote — Okoh Wisdom','Share your project scope, goals, timeline and optional budget to request a project estimate.',true)
on conflict(page_key) do update
set route_path=excluded.route_path,title=excluded.title,description=excluded.description,noindex=excluded.noindex,updated_at=now();

insert into public.analytics_settings(singleton_key,enabled,provider,measurement_id,external_click_tracking,conversion_tracking)
values ('default',false,'none',null,true,true)
on conflict(singleton_key) do nothing;
