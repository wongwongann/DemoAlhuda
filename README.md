# Website Yayasan Al-Huda Tundungan

Portal React + TypeScript + Vite untuk yayasan, SMP, pesantren, dan panel admin. Data dinamis memakai Supabase PostgreSQL; aplikasi tidak membaca/menulis localStorage atau sessionStorage. Auth Supabase hanya disimpan dalam memori.

## Menyiapkan Supabase

1. Buat atau pilih proyek Supabase. Jalankan `supabase/migrations/202610010001_initial.sql` di SQL Editor proyek **satu kali**. Migrasi ditujukan untuk proyek baru; jika tabel bernama sama sudah ada, tinjau skemanya terlebih dahulu. Migrasi tidak menghapus tabel yang ada.
2. Jalankan `supabase/migrations/202610170001_site_content.sql` untuk mengaktifkan editor konten. Migrasi membuat tabel `site_content` dengan akses RLS dan mengisi nilai bawaan semua halaman. Nilai yang sudah ada tidak ditimpa saat migrasi dijalankan ulang.
3. Opsional: jalankan `supabase/seed.sql` untuk mengisi berita, galeri, pendidik, dan agenda contoh. Seed tidak memuat pesan pribadi atau akun admin, dan tidak menimpa ID yang sudah ada. Regenerasi: `npm run db:seed:generate`.
4. Salin `.env.example` menjadi `.env.local`, lalu isi:

   ```dotenv
   VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   Ambil URL dan publishable key dari dashboard proyek. Legacy anon key juga didukung lewat `VITE_SUPABASE_ANON_KEY`. Jangan gunakan secret/service_role key di aplikasi browser. Jangan commit `.env.local`.
5. Di Supabase Authentication, buat akun admin dengan email/password. Kemudian berikan akses melalui SQL Editor (ganti alamat contoh):

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'email-admin-anda@example.com'
   on conflict do nothing;
   ```

6. Jalankan `npm install` dan `npm run dev`. Setelah mengubah `.env.local`, restart Vite. Buka website, klik **Panel admin** di footer, lalu masuk menggunakan akun tadi. Pilih **Konten website** untuk mengubah tulisan atau menyembunyikan bagian halaman.

Tanpa konfigurasi, aplikasi menampilkan pesan koneksi belum tersedia. Tidak ada fallback penyimpanan lokal atau keberhasilan formulir palsu. Kredensial proyek dan penerapan migrasi tetap diperlukan sebelum database cloud bisa dipakai.

## Penyimpanan dan akses

- `news`, `gallery`, `staff`, `agenda`: publik dapat membaca; hanya admin yang dapat mengubah.
- `site_content`: pengunjung dapat membaca konten halaman; hanya admin allowlist yang dapat menyimpan perubahan. Panel menyediakan pilihan halaman dan bagian, kolom bertanda jelas, kontrol tampil/sembunyi, serta daftar item yang bisa ditambah, dihapus, dan diurutkan. Pengelola juga dapat mengatur urutan bagian di beranda, Tentang, profil SMP, profil pesantren, dan Kontak.
- `contact_messages`: hanya admin yang dapat membaca/mengelola.
- Pengunjung mengirim pesan melalui RPC terbatas dengan validasi server. Request ID acak mencegah duplikasi ketika permintaan yang sama diulang setelah gangguan koneksi.
- Sesi login tidak persisten. Refresh/tutup halaman mengharuskan admin masuk kembali; data website tetap ada di database.
- Perubahan UI dikonfirmasi setelah server berhasil menyimpan. Jika gagal, form tetap terbuka dengan isian dan pesan kesalahan.
- Membuka ulang halaman mengambil data terkini. Admin juga dapat memuat ulang lewat tab Referensi database. Belum ada langganan Realtime.
- Galeri tetap menerima URL media; perpindahan ini tidak mencakup upload berkas ke Supabase Storage.
- Data browser dari versi sebelumnya tidak dibaca, dihapus, atau diunggah otomatis. Jika ada data nyata yang perlu dipindahkan, ekspor terlebih dahulu dari browser asal dan migrasikan secara terkontrol. Seed publik bukan migrasi data pribadi.
- Editor mencakup teks halaman, kontak/footer, navigasi, warna dan huruf dasar, tahun ajaran, daftar agenda beranda, struktur pengurus, fasilitas, ekstrakurikuler, dan jadwal santri. Atasan pengurus dipilih dari daftar, sedangkan foto memakai URL gambar; unggah langsung ke Supabase Storage belum tersedia. Bagian utama beberapa halaman dapat disusun ulang atau disembunyikan; bentuk dan desain tiap bagian tetap mengikuti template website.
- Jika definisi konten bawaan di source berubah, regenerasi migrasi dengan `npm run db:site-content:migration` sebelum menerapkannya pada proyek Supabase baru.

## Pengujian

```bash
npm run lint
npm test
npm run build
```

`npm test` menjalankan migrasi SQL pada PostgreSQL PGlite yang hanya hidup di memori proses pengujian. Pengujian mencakup izin RLS anon/admin/nonadmin, validasi form, idempotensi, receipt server, dan konversi kolom. PGlite adalah dev dependency, bukan database website atau fallback produksi.

Dependensi runtime baru: `@supabase/supabase-js`.

Referensi: [Supabase JavaScript](https://supabase.com/docs/reference/javascript/initializing), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Database functions](https://supabase.com/docs/guides/database/functions).
