-- Phase 2: media library, storage security, activity log and trash primitives.

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and is_active = true
      and role = 'admin'
  );
$$;

revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null check (storage_bucket in ('portfolio-public', 'portfolio-private')),
  storage_path text not null unique,
  original_name text not null,
  display_name text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text,
  caption text,
  category text not null default 'Other'
    check (category in ('Projects','Design','Branding','Profile','Blog','Documents','Other')),
  visibility text not null default 'public'
    check (visibility in ('public','private')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.media_library enable row level security;
revoke all on table public.media_library from anon, authenticated;
grant select, insert, update on table public.media_library to authenticated;
grant delete on table public.media_library to authenticated;

create policy "media_cms_select"
on public.media_library for select to authenticated
using ((select private.is_cms_user()));

create policy "media_cms_insert"
on public.media_library for insert to authenticated
with check (
  (select private.is_cms_user())
  and created_by = (select auth.uid())
);

create policy "media_cms_update"
on public.media_library for update to authenticated
using ((select private.is_cms_user()))
with check ((select private.is_cms_user()));

create policy "media_admin_delete"
on public.media_library for delete to authenticated
using ((select private.is_admin()));

create index media_library_active_created_idx
  on public.media_library (deleted_at, created_at desc);
create index media_library_category_idx
  on public.media_library (category) where deleted_at is null;

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;
revoke all on table public.activity_logs from anon, authenticated;
grant select, insert on table public.activity_logs to authenticated;

create policy "activity_cms_select"
on public.activity_logs for select to authenticated
using ((select private.is_cms_user()));

create policy "activity_cms_insert"
on public.activity_logs for insert to authenticated
with check (
  (select private.is_cms_user())
  and user_id = (select auth.uid())
);

create index activity_logs_created_idx on public.activity_logs (created_at desc);
create index activity_logs_entity_idx on public.activity_logs (entity_type, entity_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'portfolio-public',
    'portfolio-public',
    true,
    15728640,
    array['image/jpeg','image/png','image/webp','image/avif']::text[]
  ),
  (
    'portfolio-private',
    'portfolio-private',
    false,
    10485760,
    array['image/jpeg','image/png','image/webp','image/avif','application/pdf']::text[]
  )
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "portfolio_storage_cms_select"
on storage.objects for select to authenticated
using (
  bucket_id in ('portfolio-public','portfolio-private')
  and (select private.is_cms_user())
);

create policy "portfolio_storage_cms_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('portfolio-public','portfolio-private')
  and (select private.is_cms_user())
);

create policy "portfolio_storage_cms_update"
on storage.objects for update to authenticated
using (
  bucket_id in ('portfolio-public','portfolio-private')
  and (select private.is_cms_user())
)
with check (
  bucket_id in ('portfolio-public','portfolio-private')
  and (select private.is_cms_user())
);

create policy "portfolio_storage_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id in ('portfolio-public','portfolio-private')
  and (select private.is_admin())
);
