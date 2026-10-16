-- Apply once to a new Supabase project using its SQL Editor or Supabase CLI.
-- This migration is transactional; it never replaces existing tables.
begin;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy admin_membership_self on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table public.news (
  id text primary key default gen_random_uuid()::text,
  title text not null check (length(trim(title)) between 1 and 500),
  slug text not null, excerpt text not null, content text not null,
  unit text not null check (unit in ('yayasan','smp','pondok')),
  category text not null, author text not null, publish_date date not null default current_date,
  image_url text not null default '', is_featured boolean not null default false,
  views integer not null default 0 check (views >= 0)
);
create table public.gallery (
  id text primary key default gen_random_uuid()::text,
  title text not null, unit text not null check (unit in ('yayasan','smp','pondok')),
  category text not null check (category in ('kegiatan','fasilitas','prestasi','keagamaan')),
  type text not null check (type in ('image','video')),
  media_url text not null, thumbnail_url text, image_url text, description text,
  date date not null default current_date
);
create table public.staff (
  id text primary key default gen_random_uuid()::text,
  name text not null, title text, role text not null,
  unit text not null check (unit in ('yayasan','smp','pondok')),
  category text not null check (category in ('pimpinan','guru','asatidz','staff','pengasuh','ustadz')),
  education text, subject text, photo_url text, image_url text, nip text, bio text,
  "order" integer not null default 99
);
create table public.agenda (
  id text primary key default gen_random_uuid()::text,
  title text not null, date date not null, end_date date, time text not null,
  location text not null, unit text not null check (unit in ('yayasan','smp','pondok')),
  category text not null, description text not null default ''
);

create table public.contact_messages (
  id text primary key default gen_random_uuid()::text,
  request_id uuid unique,
  name text not null check (length(trim(name)) between 1 and 200),
  email text not null, phone text not null, subject text not null, message text not null,
  unit text check (unit in ('yayasan','smp','pondok')),
  target_unit text check (target_unit in ('yayasan','smp','pondok')),
  created_at timestamptz not null default now(),
  status text not null default 'unread' check (status in ('unread','read','replied')),
  is_read boolean not null default false
);

-- Public content is readable by visitors; only allowlisted admins may write.
do $$
declare table_name text;
begin
  foreach table_name in array array['news','gallery','staff','agenda'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant select on public.%I to anon, authenticated', table_name);
    execute format('grant insert, update, delete on public.%I to authenticated', table_name);
    execute format('create policy public_read on public.%I for select to anon, authenticated using (true)', table_name);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select public.is_admin()))', table_name);
    execute format('create policy admin_update on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', table_name);
    execute format('create policy admin_delete on public.%I for delete to authenticated using ((select public.is_admin()))', table_name);
  end loop;
  foreach table_name in array array['contact_messages'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
    execute format('create policy admin_only on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', table_name);
  end loop;
end $$;

create function public.submit_contact(p_request_id uuid, p_data jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare receipt public.contact_messages;
  target text := coalesce(p_data->>'target_unit',p_data->>'unit','yayasan');
begin
  if p_request_id is null or p_data is null or octet_length(p_data::text) > 20000 then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  if coalesce(length(trim(p_data->>'name')),0) not between 1 and 200
    or coalesce(p_data->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or coalesce(length(trim(p_data->>'phone')),0) not between 8 and 30
    or coalesce(length(trim(p_data->>'subject')),0) not between 1 and 300
    or coalesce(length(trim(p_data->>'message')),0) not between 10 and 10000
    or target not in ('yayasan','smp','pondok') then
    raise exception 'Invalid message fields' using errcode = '22023';
  end if;
  insert into public.contact_messages (request_id,name,email,phone,subject,message,unit,target_unit)
  values (p_request_id,trim(p_data->>'name'),p_data->>'email',p_data->>'phone',trim(p_data->>'subject'),trim(p_data->>'message'),target,target)
  on conflict (request_id) do nothing returning * into receipt;
  if receipt.id is null then select * into receipt from public.contact_messages where request_id = p_request_id; end if;
  return jsonb_build_object('id', receipt.id, 'created_at', receipt.created_at);
end $$;
revoke all on function public.submit_contact(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.submit_contact(uuid,jsonb) to anon, authenticated;
create index news_publication_idx on public.news(publish_date desc,id);
create index contact_created_idx on public.contact_messages(created_at desc,id);
commit;
