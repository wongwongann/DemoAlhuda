# Dokumentasi Teknis & Arsitektur Sistem
## Website Terpadu Yayasan Pendidikan Islam Al-Huda Tundungan

Dokumen ini berisi rangkuman teknis lengkap mengenai arsitektur, bahasa pemrograman, tools/runtime, pustaka antarmuka, basis data, dan metode pengembangan yang digunakan dalam pembuatan aplikasi web **Yayasan Al-Huda Tundungan**.

---

## 1. Ikhtisar Sistem & Metode Arsitektur

Website ini mengadopsi pola arsitektur **Hub-and-Spoke** (Portal Terpadu Multi-Unit) berbasis **Single Page Application (SPA)**:

* **Hub (Portal Yayasan Utama)**: Mengintegrasikan informasi lintas unit, visi misi induk, struktur organisasi pimpinan, berita yayasan, kalender agenda, dan informasi kontak.
* **Spoke 1 (Sub-Area SMP Al-Huda)**: Mengusung tema identitas biru tua/navy dengan fokus pada Kurikulum Merdeka, profil guru mata pelajaran, ekstrakurikuler, dan sarana laboratorium/kelas digital.
* **Spoke 2 (Sub-Area Pondok Pesantren Al-Huda)**: Mengusung aksen emas/mustard dengan fokus pada program *Tahfidzul Qur'an 30 Juz*, *Madrasah Diniyah Salafiyah*, dewan asatidz/masyayikh, jadwal 24 jam santri, dan fasilitas asrama mukim.
* **Admin Hub (`/admin`)**: Panel manajemen terpusat untuk CRUD berita, data pendidik/asatidz, galeri media, dan pesan masuk.

---

## 2. Runtime, Tools, & Environment

| Kategori | Tool / Teknologi | Versi | Fungsi & Peranan |
| :--- | :--- | :--- | :--- |
| **Runtime Environment** | **Node.js** | v20+ / v22+ | Menjalankan *environment* pengembangan, pengelola paket npm, dan kompilasi modul. |
| **Package Manager** | **npm** / **bun** | Standard | Mengelola dependensi paket dan pustaka eksternal dalam `package.json`. |
| **Build Tool & Dev Server** | **Vite** | `^6.2.3` | *Bundler* modern berkecepatan tinggi dengan integrasi Hot Module Replacement (HMR) dan server lokal. |
| **Compiler & Type Checker** | **TypeScript Compiler (`tsc`)** | `~5.8.2` | Memvalidasi integritas tipe data (*type safety*) dan mencegah *runtime error*. |
| **Module Bundler** | **esbuild** | `^0.25.0` | Transpilasi dan pengemasan modul berkecepatan tinggi saat proses build produksi. |

---

## 3. Bahasa Pemrograman & Framework

### A. Bahasa Pemrograman
* **TypeScript (`.ts`, `.tsx`)**: Digunakan di seluruh basis kode untuk mendefinisikan tipe data yang ketat (`UnitType`, `NewsItem`, `StaffMember`, `ContactMessage`, `AgendaItem`, dsb.).
* **HTML5 Semantic**: Struktur semantik (`<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) untuk aksesibilitas dan SEO yang optimal.

### B. Framework & Pustaka Frontend
* **React 19 (`react`, `react-dom`)**:
  * Menggunakan pendekatan fungsional murni (*Functional Components*) dan *Hooks* (`useState`, `useEffect`, `useMemo`).
  * Struktur komponen terisolasi (*modular component-driven architecture*).
* **Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)**:
  * Framework CSS utilitas untuk styling responsif, palet warna kustom (*Forest Emerald*, *Navy*, *Gold Amber*, *Warm Slate*), dan tipografi modern tanpa ketergantungan CSS eksternal.
* **Motion / Framer Motion (`motion`)**:
  * Animasi transisi halus antar-halaman, efek *fade-in*, *accordion*, dan interaksi *hover*.
* **Lucide React (`lucide-react`)**:
  * Kumpulan ikon vektor SVG yang modern, ringan, dan seragam di seluruh tombol dan status indikator.

---

## 4. Struktur Direktori & Komponen

```
├── public/                     # Aset publik statis
├── src/
│   ├── components/             # Komponen antarmuka yang dapat digunakan kembali
│   │   ├── common/             # OrgChart, ContactForm, Lightbox, StatCard, EmptyState
│   │   └── layout/             # Navbar responsif, Footer global, UnitSwitcher
│   ├── data/
│   │   └── mockData.ts         # Data awal/seeding awal untuk warta, dewan guru, galeri, agenda
│   ├── pages/                  # Halaman-halaman rute aplikasi
│   │   ├── HomePage.tsx        # Portal Beranda Yayasan
│   │   ├── AboutPage.tsx       # Profil, Visi Misi, Sejarah, & Struktur Organisasi
│   │   ├── NewsPage.tsx        # Indeks Berita & Pembaca Artikel Detail
│   │   ├── GalleryPage.tsx     # Album Foto & Video dengan Modal Lightbox
│   │   ├── ContactPage.tsx     # Kontak Sekretariat, Google Maps, & Form Aduan
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx # Panel Kelola Data Berita, Guru, & Galeri
│   │   ├── smp/                # Halaman Khusus SMP Al-Huda
│   │   │   ├── SMPProfilePage.tsx
│   │   │   ├── SMPStaffPage.tsx
│   │   │   ├── SMPExtracurricularPage.tsx
│   │   │   └── SMPFacilitiesPage.tsx
│   │   └── pondok/             # Halaman Khusus Pondok Pesantren Al-Huda
│   │       ├── PondokProfilePage.tsx
│   │       ├── PondokAsatidzPage.tsx
│   │       ├── PondokSchedulePage.tsx
│   │       └── PondokFacilitiesPage.tsx
│   ├── types.ts                # Deklarasi Interface & Type TypeScript global
│   ├── App.tsx                 # Root Router, State Management, & LocalStorage sync
│   ├── index.css               # Import Tailwind CSS & konfigurasi styling global
│   └── main.tsx                # Titik masuk utama React DOM
├── index.html                  # HTML Shell & Konfigurasi Metadata
├── package.json                # Manifest dependensi & script proyek
├── tsconfig.json               # Konfigurasi TypeScript
└── vite.config.ts              # Konfigurasi Vite & Plugin Tailwind
```

---

## 5. Arsitektur Basis Data & Persistensi

Data dinamis memakai Supabase PostgreSQL melalui `src/lib/database.ts`. Konfigurasi klien ada di `src/lib/supabase.ts`, pemuatan data dan verifikasi akses di `src/hooks/useWebsiteData.ts`.

- Tabel publik: `news`, `gallery`, `staff`, `agenda`, `site_content`; pengunjung hanya dapat membaca.
- Tabel privat: `contact_messages`; hanya admin yang tercatat dalam `admin_users` dapat mengelolanya.
- RPC `submit_contact` menerima pesan pengunjung tanpa memberikan akses baca data pribadi. Request ID mencegah pengiriman ulang menghasilkan baris ganda.
- Panel admin menggunakan Supabase Auth. RLS tetap membatasi akses meskipun antarmuka dimodifikasi di browser.
- Tidak ada persistensi browser. State React dan sesi login hanya berada di memori, sehingga refresh meminta login ulang tetapi data tetap tersimpan di Supabase.
- SQL: `supabase/migrations/202610010001_initial.sql` dan `supabase/migrations/202610170001_site_content.sql`. Seed publik opsional: `supabase/seed.sql`. Ikuti langkah konfigurasi dan pembuatan admin pada README.
- Pengelola dapat mengubah teks, visibilitas, navigasi, tema warna/huruf, tahun ajaran, daftar agenda beranda, struktur pengurus (termasuk atasan), fasilitas, ekstrakurikuler, dan jadwal santri lewat menu **Konten website**. Item daftar dapat ditambah, dihapus, dan diurutkan; urutan bagian utama juga bisa diubah untuk beranda, Tentang, profil SMP, profil pesantren, dan Kontak. Nilai awal tampil sebelum disimpan ke Supabase.
- Pesan berhasil hanya muncul setelah database mengonfirmasi perubahan; kegagalan menampilkan error dan mempertahankan isian.
- Bentuk visual tiap bagian tetap mengikuti template website; foto dalam editor diubah melalui URL gambar.

---
## 6. Perintah Menjalankan Proyek (Commands)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm install` | Memasang seluruh dependensi pustaka Node.js yang tercantum di `package.json`. |
| `npm run dev` | Menjalankan *development server* lokal pada `http://localhost:3000`. |
| `npm run lint` | Memvalidasi sintaksis dan kesesuaian tipe TypeScript (`tsc --noEmit`). |
| `npm run build` | Melakukan kompilasi aset frontend menjadi berkas statis siap rilis di direktori `dist/`. |
| `npm run preview` | Menjalankan pratinjau lokal dari hasil kompilasi folder `dist/`. |

