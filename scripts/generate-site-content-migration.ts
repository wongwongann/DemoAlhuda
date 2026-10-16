import fs from 'node:fs/promises';
import { defaultSiteContent } from '../src/data/siteContent';

const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const inserts = defaultSiteContent.map(section => `  (${quote(section.id)}, ${quote(section.page)}, ${quote(section.label)}, ${quote(JSON.stringify(section.data))}::jsonb, ${section.visible})`).join(',\n');

const migration = `begin;

create table if not exists public.site_content (
  id text primary key,
  page text not null,
  label text not null,
  data jsonb not null default '{}'::jsonb,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists site_content_admin_insert on public.site_content;
create policy site_content_admin_insert on public.site_content
  for insert to authenticated with check ((select public.is_admin()));
drop policy if exists site_content_admin_update on public.site_content;
create policy site_content_admin_update on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.site_content (id, page, label, data, visible)
values
${inserts}
on conflict (id) do nothing;

commit;
`;

await fs.writeFile('supabase/migrations/202610170001_site_content.sql', migration);
console.log('Generated site content migration with defaults and RLS policies.');
