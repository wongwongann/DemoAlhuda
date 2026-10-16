import React, { useState } from 'react';
import { requireSupabase, supabaseConfigured } from '../../lib/supabase';
import './admin.css';
interface AdminLoginProps { onExit: () => void; checking: boolean; accessError: string | null; signedIn: boolean; onRetry: () => void; }
export function AdminLogin({ onExit, checking, accessError, signedIn, onRetry }: AdminLoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const data = new FormData(event.currentTarget); setBusy(true); setError(null);
    try {
      const { error: authError } = await requireSupabase().auth.signInWithPassword({ email: String(data.get('email')).trim(), password: String(data.get('password')) });
      if (authError) throw authError;
    } catch { setError('Tidak berhasil masuk. Periksa email, kata sandi, dan koneksi Anda.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-login"><section><p className="section-label">Yayasan Al-Huda Tundungan</p><h1>Masuk ke panel admin</h1><p>Gunakan akun pengelola untuk mengakses data dan memperbarui website.</p>
    {!supabaseConfigured ? <p role="alert">Koneksi database belum diatur. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di .env.local, lalu jalankan migrasi Supabase.</p>
      : checking ? <p role="status">Memeriksa akses dan memuat data…</p>
      : signedIn ? <div><p role="alert">{accessError}</p><button className="button-primary" onClick={onRetry}>Coba lagi</button><button className="text-link" onClick={() => void requireSupabase().auth.signOut({ scope: 'local' })}>Gunakan akun lain</button></div>
      : <form onSubmit={signIn}><label htmlFor="admin-email">Email admin</label><input id="admin-email" name="email" type="email" autoComplete="username" required /><label htmlFor="admin-password">Kata sandi</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /><button disabled={busy} className="button-primary">{busy ? 'Memproses…' : 'Masuk'}</button>{error && <p role="alert">{error}</p>}</form>}
    <button className="text-link" onClick={onExit}>Kembali ke website</button><small>Sesi login tidak disimpan di browser. Masuk kembali setelah memuat ulang halaman.</small>
  </section></div>;
}
