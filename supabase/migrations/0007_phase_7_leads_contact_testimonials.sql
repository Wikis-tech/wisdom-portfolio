-- Phase 7: lead capture, quote CRM, contact inbox and testimonials.

alter table public.activity_logs alter column user_id drop not null;\n\ncreate table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  subject text not null check (char_length(subject) between 2 and 180),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'unread' check (status in ('unread','read','replied','archived')),
  source text not null default 'portfolio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 40),
  project_type text not null check (project_type in ('website','web_application','ui_ux','brand_graphics','ai_solution','business_technology','other')),
  description text not null check (char_length(description) between 20 and 8000),
  budget text check (budget is null or budget in ('under_100k','100k_300k','300k_750k','750k_plus','discuss')),
  timeline text check (timeline is null or char_length(timeline) <= 180),
  contact_method text not null default 'email' check (contact_method in ('email','whatsapp','phone')),
  attachment_bucket text check (attachment_bucket is null or attachment_bucket='portfolio-private'),
  attachment_path text,
  attachment_name text,
  attachment_mime text,
  attachment_size bigint check (attachment_size is null or attachment_size between 1 and 10485760),
  status text not null default 'new' check (status in ('new','reviewed','contacted','negotiating','accepted','declined','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint quote_attachment_consistency check (
    (attachment_path is null and attachment_bucket is null and attachment_name is null and attachment_mime is null and attachment_size is null)
    or
    (attachment_path is not null and attachment_bucket is not null and attachment_name is not null and attachment_mime is not null and attachment_size is not null)
  )
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  position text,
  company text,
  photo_url text,
  quote text not null check (char_length(quote) between 10 and 1500),
  project_id uuid references public.projects(id) on delete set null,
  featured boolean not null default false,
  visibility boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.form_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  hit_count integer not null default 0 check (hit_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
alter table public.quote_requests enable row level security;
alter table public.testimonials enable row level security;
alter table public.form_rate_limits enable row level security;

revoke all on public.contact_messages from anon, authenticated;
revoke all on public.quote_requests from anon, authenticated;
revoke all on public.testimonials from anon, authenticated;
revoke all on public.form_rate_limits from anon, authenticated;

grant select, update, delete on public.contact_messages to authenticated;
grant select, update, delete on public.quote_requests to authenticated;
grant select, insert, update, delete on public.testimonials to authenticated;
grant select on public.testimonials to anon;

create policy "messages_cms_select" on public.contact_messages for select to authenticated using ((select private.is_cms_user()));
create policy "messages_cms_update" on public.contact_messages for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "messages_admin_delete" on public.contact_messages for delete to authenticated using ((select private.is_admin()));

create policy "quotes_cms_select" on public.quote_requests for select to authenticated using ((select private.is_cms_user()));
create policy "quotes_cms_update" on public.quote_requests for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()));
create policy "quotes_admin_delete" on public.quote_requests for delete to authenticated using ((select private.is_admin()));

create policy "testimonials_public_read" on public.testimonials for select to anon, authenticated using ((visibility=true and deleted_at is null) or (select private.is_cms_user()));
create policy "testimonials_cms_insert" on public.testimonials for insert to authenticated with check ((select private.is_cms_user()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy "testimonials_cms_update" on public.testimonials for update to authenticated using ((select private.is_cms_user())) with check ((select private.is_cms_user()) and updated_by=(select auth.uid()));
create policy "testimonials_admin_delete" on public.testimonials for delete to authenticated using ((select private.is_admin()));

create or replace function public.consume_form_rate_limit(p_key_hash text,p_limit integer,p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  started_at timestamptz;
begin
  if p_key_hash is null or char_length(p_key_hash) < 16 or p_limit < 1 or p_limit > 100 or p_window_seconds < 60 or p_window_seconds > 86400 then
    return false;
  end if;

  select hit_count, window_started_at into current_count, started_at
  from public.form_rate_limits
  where key_hash=p_key_hash
  for update;

  if not found then
    insert into public.form_rate_limits(key_hash, hit_count) values (p_key_hash, 1);
    return true;
  end if;

  if started_at <= now() - make_interval(secs => p_window_seconds) then
    update public.form_rate_limits set window_started_at=now(), hit_count=1, updated_at=now() where key_hash=p_key_hash;
    return true;
  end if;

  if current_count >= p_limit then
    return false;
  end if;

  update public.form_rate_limits set hit_count=hit_count+1, updated_at=now() where key_hash=p_key_hash;
  return true;
end;
$$;

revoke execute on function public.consume_form_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_form_rate_limit(text,integer,integer) to service_role;

create index contact_messages_status_created_idx on public.contact_messages(status,created_at desc);
create index quote_requests_status_created_idx on public.quote_requests(status,created_at desc);
create index testimonials_public_sort_idx on public.testimonials(visibility,deleted_at,featured,sort_order);
create index form_rate_limits_updated_idx on public.form_rate_limits(updated_at);

insert into public.page_sections(page_key,section_key,title,description,enabled,sort_order)
values ('home','testimonials','Testimonials','Only real published testimonials appear here.',true,95)
on conflict(page_key,section_key) do nothing;
