import { requireSupabase } from './supabase';
import { fromRow, toRow } from './rows';
import type { NewsItem, GalleryItem, StaffMember, ContactMessage, AgendaItem, SiteContentRecord } from '../types';

export interface Tables {
  news: NewsItem;
  gallery: GalleryItem;
  staff: StaffMember;
  contact_messages: ContactMessage;
  agenda: AgendaItem;
  site_content: SiteContentRecord;
}
const sortColumns: Record<keyof Tables, string> = {
  news: 'publish_date', gallery: 'date', staff: 'order',
  contact_messages: 'created_at', agenda: 'date', site_content: 'page',
};
export async function readTable<K extends keyof Tables>(table: K): Promise<Tables[K][]> {
  const result: Tables[K][] = [];
  // Supabase returns up to 1,000 rows per request by default. Fetch all pages.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await requireSupabase().from(table).select('*')
      .order(sortColumns[table], { ascending: table === 'staff' || table === 'agenda' })
      .order('id').range(offset, offset + 999);
    if (error) throw error;
    result.push(...(data || []).map(row => fromRow<Tables[K]>(row)));
    if (!data || data.length < 1000) return result;
  }
}
export async function saveRecord<K extends keyof Tables>(table: K, record: Tables[K], isNew: boolean): Promise<Tables[K]> {
  const row = toRow(record);
  if (isNew) delete row.id;
  const query = isNew ? requireSupabase().from(table).insert(row)
    : requireSupabase().from(table).update(row).eq('id', record.id);
  const { data, error } = await query.select().single();
  if (error) throw error;
  return fromRow<Tables[K]>(data);
}
export async function upsertRecord<K extends keyof Tables>(table: K, record: Tables[K]): Promise<Tables[K]> {
  const { data, error } = await requireSupabase().from(table).upsert(toRow(record)).select().single();
  if (error) throw error;
  return fromRow<Tables[K]>(data);
}
export async function updateRecord<K extends keyof Tables>(table: K, id: string, fields: Partial<Tables[K]>): Promise<Tables[K]> {
  const { data, error } = await requireSupabase().from(table).update(toRow(fields)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow<Tables[K]>(data);
}
export async function deleteRecord(table: keyof Tables, id: string): Promise<void> {
  const { data, error } = await requireSupabase().from(table).delete().eq('id', id).select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Data tidak ditemukan atau akses telah berubah.');
}
export async function submitContact(message: ContactMessage): Promise<ContactMessage> {
  const { data, error } = await requireSupabase().rpc('submit_contact', {
    p_request_id: message.id,
    p_data: toRow(message),
  });
  if (error) throw error;
  return { ...message, ...fromRow<Pick<ContactMessage, 'id' | 'createdAt'>>(data), status: 'unread', isRead: false };
}
