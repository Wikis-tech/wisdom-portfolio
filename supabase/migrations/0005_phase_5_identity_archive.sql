-- Phase 5: portfolio identity, visual archive, about, experience, skills and technology.

create table public.about_profile (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key='default'),
  headline text not null default 'More than one discipline. One way of thinking.',
  introduction text not null default 'I''m Wisdom, a Computer Science student, software developer and creative technologist interested in what happens when engineering, design and intelligent tools work together.',
  biography text,
  philosophy text,
  location text default 'Lagos, Nigeria',
  availability text,
  portrait_url text,
  resume_url text,
  is_published boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.journey_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date_label text,
  icon text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  program text,
  qualification text,
  location text,
  start_year integer check (start_year is null or start_year between 1990 and 2100),
  end_year integer check (end_year is null or end_year between 1990 and 2100),
  is_current boolean not null default false,
  description text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  employment_type text,
  location text,
  start_date date,
  end_date date,
  current_position boolean not null default false,
  description text,
  responsibilities text,
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  group_name text not null check (group_name in ('Build','Design','Think','AI')),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, group_name)
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('Frontend','Backend/Data','Infrastructure','Creative','Business','AI')),
  icon_url text,
  website_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.design_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  year integer check (year is null or year between 2000 and 2100),
  category_id uuid references public.design_categories(id) on delete set null,
  description text,
  image_url text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  visibility text not null default 'public' check (visibility in ('public','private')),
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

update storage.buckets
set allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','application/pdf']::text[],
    file_size_limit = 15728640
where id = 'portfolio-public';

alter table public.about_profile enable row level security;
alter table public.journey_items enable row level security;
alter table public.education enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.technologies enable row level security;
alter table public.design_categories enable row level security;
alter table public.designs enable row level security;

grant select on public.about_profile, public.journey_items, public.education, public.experiences, public.skills, public.technologies, public.design_categories, public.designs to anon, authenticated;
grant insert, update, delete on public.about_profile, public.journey_items, public.education, public.experiences, public.skills, public.technologies, public.design_categories, public.designs to authenticated;

create policy "about_public_read" on public.about_profile for select to anon, authenticated using (is_published = true or (select private.is_cms_user()));
create policy "about_cms_write" on public.about_profile for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "journey_public_read" on public.journey_items for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "journey_cms_write" on public.journey_items for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "education_public_read" on public.education for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "education_cms_write" on public.education for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "experience_public_read" on public.experiences for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "experience_cms_write" on public.experiences for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "skills_public_read" on public.skills for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "skills_cms_write" on public.skills for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "technologies_public_read" on public.technologies for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "technologies_cms_write" on public.technologies for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "design_categories_public_read" on public.design_categories for select to anon, authenticated using (is_visible = true or (select private.is_cms_user()));
create policy "design_categories_cms_write" on public.design_categories for all to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "designs_public_read" on public.designs for select to anon, authenticated using ((visibility='public' and deleted_at is null) or (select private.is_cms_user()));
create policy "designs_cms_insert" on public.designs for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "designs_cms_update" on public.designs for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "designs_admin_delete" on public.designs for delete to authenticated using ((select private.is_admin()));

insert into public.about_profile(singleton_key) values ('default') on conflict(singleton_key) do nothing;
insert into public.design_categories(name,slug,sort_order) values
('SCM Capital','scm-capital',10),('Noureesh','noureesh',20),('Church Design','church-design',30),('Social Media','social-media',40),('Print','print',50),('AI Visual','ai-visual',60),('Presentation','presentation',70),('Outdoor','outdoor',80)
on conflict(slug) do nothing;

create index journey_visible_sort_idx on public.journey_items(is_visible,sort_order);
create index education_visible_sort_idx on public.education(is_visible,sort_order);
create index experiences_visible_sort_idx on public.experiences(is_visible,sort_order);
create index skills_group_sort_idx on public.skills(group_name,sort_order);
create index technologies_category_sort_idx on public.technologies(category,sort_order);
create index designs_public_sort_idx on public.designs(visibility,deleted_at,featured,sort_order);

create table public.design_media (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  image_url text not null,
  caption text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.design_media enable row level security;
grant select on public.design_media to anon, authenticated;
grant insert, update, delete on public.design_media to authenticated;
create policy "design_media_public_read" on public.design_media for select to anon, authenticated using (
  exists (
    select 1 from public.designs d
    where d.id=design_media.design_id
      and d.visibility='public'
      and d.deleted_at is null
  ) or (select private.is_cms_user())
);
create policy "design_media_cms_write" on public.design_media for all to authenticated
using ((select private.is_cms_user()))
with check ((select private.is_cms_user()));
create index design_media_design_sort_idx on public.design_media(design_id,sort_order);
