import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim();
export const supabaseConfigured = Boolean(url && /^https?:\/\//.test(url) && key);
// The client and auth session exist only in memory. No browser persistence.
export const supabase = supabaseConfigured ? createClient(url!, key!, {
  auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
}) : null;

export function requireSupabase() {
  if (!supabase) throw new Error('Koneksi Supabase belum dikonfigurasi. Hubungi pengelola website.');
  return supabase;
}

export function dataError(error: unknown): string {
  if (error instanceof Error && error.message.startsWith('Koneksi Supabase')) return error.message;
  const code = (error as { code?: string })?.code;
  if (code === '42501' || code === 'PGRST301') return 'Akses ditolak atau sesi berakhir. Silakan masuk kembali sebagai admin.';
  if (code === '23505') return 'Data dengan identitas tersebut sudah ada. Periksa isian Anda.';
  if (code === '23514' || code === '22023' || code === '22007') return 'Ada isian yang tidak valid. Periksa kembali formulir Anda.';
  return 'Data belum berhasil diproses oleh server. Periksa koneksi lalu coba lagi.';
}
