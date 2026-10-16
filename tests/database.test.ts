import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { toRow, fromRow } from '../src/lib/rows';
import { agendaItemsFor, defaultSiteContent, orgStructureFor, pageSectionOrderFor } from '../src/data/siteContent';

const db = new PGlite();
const admin = '10000000-0000-4000-8000-000000000001';
const visitor = '10000000-0000-4000-8000-000000000002';
const message = { name: 'Wali Uji', email: 'test@example.com', phone: '081234567890', subject: 'Informasi',
  message: 'Pertanyaan dari pengujian database.', target_unit: 'pondok', status: 'read', is_read: true };
async function role(name: 'anon' | 'authenticated' | 'postgres', user = '') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user]);
  if (name !== 'postgres') await db.exec(`set role ${name}`);
}
before(async () => {
  await db.exec(`create role anon; create role authenticated;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    insert into auth.users values ('${admin}'), ('${visitor}');`);
  await db.exec(await fs.readFile('supabase/migrations/202610010001_initial.sql', 'utf8'));
  await db.exec(await fs.readFile('supabase/migrations/202610170001_site_content.sql', 'utf8'));
  await db.exec(await fs.readFile('supabase/seed.sql', 'utf8'));
  await db.query('insert into public.admin_users(user_id) values ($1)', [admin]);
});
after(async () => { await db.close(); });

test('row conversion preserves optional values, aliases, and round trips', () => {
  const record = { fullName: 'Nama', parentPhone: '08123', isRead: false, order: 0, birthDate: undefined };
  assert.deepEqual(toRow(record), { full_name: 'Nama', parent_phone: '08123', is_read: false, order: 0 });
  assert.deepEqual(fromRow(toRow(record)), { fullName: 'Nama', parentPhone: '08123', isRead: false, order: 0 });
});
test('homepage agenda and foundation org chart use editable site content collections', () => {
  const agenda = agendaItemsFor([]);
  assert.ok(agenda.length > 0);
  const agendaRecords = defaultSiteContent.map(section => section.id === 'home.agenda'
    ? { ...section, data: { ...section.data, items: [{ id: 'edited-agenda', title: 'Agenda baru', date: '2026-10-20', time: '08.00', location: 'Aula', unit: 'smp', category: 'Akademik', description: 'Jadwal baru' }] } }
    : section);
  assert.equal(agendaItemsFor(agendaRecords).find(item => item.id === 'edited-agenda')?.title, 'Agenda baru');

  const structure = orgStructureFor([]);
  assert.equal(structure.id, 'org-root');
  assert.ok(structure.children?.some(node => node.id === 'org-ketua'));
  const orgRecords = defaultSiteContent.map(section => section.id === 'about.organization'
    ? { ...section, data: { ...section.data, items: [{ id: 'root', name: 'Pembina baru', role: 'Pembina', unit: 'yayasan', level: '1', parentId: '' }, { id: 'child', name: 'Ketua baru', role: 'Ketua', unit: 'yayasan', level: '2', parentId: 'root' }] } }
    : section);
  const edited = orgStructureFor(orgRecords);
  assert.equal(edited.name, 'Pembina baru');
  assert.equal(edited.children?.[0].name, 'Ketua baru');
});
test('public page section order follows saved configuration and restores missing sections', () => {
  const ids = ['home.hero', 'home.units', 'home.foundation', 'home.news', 'home.agenda'];
  const saved = defaultSiteContent.map(section => section.id === 'layout.home'
    ? { ...section, data: { ...section.data, items: [{ id: 'home.agenda' }, { id: 'home.hero' }, { id: 'unknown.section' }] } }
    : section);
  assert.deepEqual(pageSectionOrderFor('layout.home', ids, saved), [
    'home.agenda', 'home.hero', 'home.units', 'home.foundation', 'home.news',
  ]);
});
test('anonymous visitor can read public content but cannot write or read private data', async () => {
  await role('anon');
  assert.ok((await db.query('select * from public.news')).rows.length > 0);
  assert.ok((await db.query('select * from public.site_content')).rows.length > 0);
  for (const table of ['contact_messages','admin_users']) await assert.rejects(db.query(`select * from public.${table}`));
  await assert.rejects(db.query("delete from public.news"));
  await assert.rejects(db.query("update public.site_content set visible = false"));
  await assert.rejects(db.query("insert into public.admin_users(user_id) values ($1)", [visitor]));
});
test('contact RPC is idempotent and ignores caller-supplied read status', async () => {
  await role('anon'); const request = '20000000-0000-4000-8000-000000000002';
  const a = await db.query('select public.submit_contact($1, $2)', [request, JSON.stringify(message)]);
  const b = await db.query('select public.submit_contact($1, $2)', [request, JSON.stringify(message)]);
  assert.deepEqual(a.rows,b.rows);
  await role('postgres');
  const rows = (await db.query<{ status: string; is_read: boolean; target_unit: string }>('select * from public.contact_messages')).rows;
  assert.equal(rows.length, 1);assert.equal(rows[0].status,'unread');assert.equal(rows[0].is_read,false);assert.equal(rows[0].target_unit,'pondok');
});
test('ordinary authenticated accounts cannot self-promote or access private rows', async () => {
  await role('authenticated', visitor);
  assert.equal((await db.query<{ is_admin: boolean }>('select public.is_admin()')).rows[0].is_admin, false);
  assert.equal((await db.query('select * from public.contact_messages')).rows.length, 0);
  assert.equal((await db.query("update public.site_content set visible = false returning *")).rows.length, 0);
  assert.equal((await db.query('delete from public.news returning *')).rows.length, 0);
  await assert.rejects(db.query('insert into public.admin_users(user_id) values ($1)', [visitor]));
});
test('allowlisted admin can manage records and status, including persisted reads', async () => {
  await role('authenticated', admin);
  assert.equal((await db.query<{ is_admin: boolean }>('select public.is_admin()')).rows[0].is_admin, true);
  assert.equal((await db.query("update public.contact_messages set status='read', is_read=true returning *")).rows.length, 1);
  const content = await db.query<{ data: { title: string } }>("update public.site_content set data = jsonb_set(data, '{title}', '\"Judul diperbarui\"'::jsonb) where id = 'home.hero' returning data");
  assert.equal(content.rows[0].data.title, 'Judul diperbarui');
  const row = await db.query<{id: string}>("insert into public.news(title,slug,excerpt,content,unit,category,author) values ('Uji','uji','Uji','Uji','yayasan','Kegiatan','Admin') returning id");
  assert.equal((await db.query('delete from public.news where id=$1 returning *',[row.rows[0].id])).rows.length,1);
});
test('source has no browser-persistent data or auth storage fallback', async () => {
  const app = await fs.readFile('src/App.tsx','utf8'); const client = await fs.readFile('src/lib/supabase.ts','utf8');
  assert.doesNotMatch(app,/localStorage|sessionStorage/); assert.match(client,/persistSession: false/);
});
