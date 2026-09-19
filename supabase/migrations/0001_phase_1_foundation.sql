create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
create policy "profiles_select_self" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_update_self" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_cms_user()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and is_active = true and role in ('admin','editor')); $$;
revoke execute on function private.is_cms_user() from public, anon;
grant execute on function private.is_cms_user() to authenticated;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), 'editor')
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null default 'default' unique check (singleton_key = 'default'),
  professional_name text not null default 'Wisdom',
  brand_name text not null default 'Wikis Tech Corporation',
  tagline text,
  location text,
  availability_enabled boolean not null default true,
  availability_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
revoke all on table public.site_settings from anon, authenticated;
grant select on table public.site_settings to anon, authenticated;
grant insert, update, delete on table public.site_settings to authenticated;
create policy "site_settings_public_read" on public.site_settings for select to anon, authenticated using (true);
create policy "site_settings_cms_insert" on public.site_settings for insert to authenticated with check ((select private.is_cms_user()));
create policy "site_settings_cms_update" on public.site_settings for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "site_settings_cms_delete" on public.site_settings for delete to authenticated using ((select private.is_cms_user()));

insert into public.site_settings (singleton_key, professional_name, brand_name, tagline, location, availability_message)
values ('default','Wisdom','Wikis Tech Corporation','Software Developer · Digital Product Builder · Creative Technologist','Lagos, NG','Available for selected freelance & collaboration opportunities')
on conflict (singleton_key) do nothing;
create index profiles_role_active_idx on public.profiles(role, is_active);
