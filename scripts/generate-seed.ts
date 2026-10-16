import fs from 'node:fs/promises';
import { mockNews, mockGallery, mockStaff, mockAgenda } from '../src/data/mockData';
import { toRow } from '../src/lib/rows';
const quote = (value: unknown) => value === null ? 'null' : typeof value === 'number' || typeof value === 'boolean' ? String(value) : "'" + String(value).replaceAll("'", "''") + "'";
const statements = ['-- Optional PUBLIC demo content only. No private messages or admin accounts.', 'begin;'];
for (const [table, records] of Object.entries({ news: mockNews, gallery: mockGallery, staff: mockStaff, agenda: mockAgenda })) {
  for (const record of records) {
    const row = toRow(record);
    statements.push(`insert into public.${table} (${Object.keys(row).map(key => '"' + key + '"').join(', ')}) values (${Object.values(row).map(quote).join(', ')}) on conflict (id) do nothing;`);
  }
}
statements.push('commit;');
await fs.writeFile('supabase/seed.sql', statements.join('\n') + '\n');
console.log('supabase/seed.sql generated: public content only.');
