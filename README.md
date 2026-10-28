# DapurCerdas

Fondasi aplikasi Smart POS berbasis Next.js untuk UMKM kuliner. Saat ini hanya ada halaman awal sementara dan modul koneksi Supabase. Fitur bisnis dan autentikasi belum diimplementasikan.

## Menjalankan lokal

1. Gunakan Node.js yang memenuhi persyaratan versi Next.js di `package.json` dan npm.
2. Jalankan `npm ci` dari folder ini.
3. Jalankan `npm run dev` lalu buka `http://localhost:3000`.

Halaman awal dapat dibuka tanpa konfigurasi Supabase. Saat proyek Supabase tim tersedia, salin `.env.example` menjadi `.env.local` dan isi URL serta publishable key dari proyek tersebut. Jangan memasukkan secret key atau service-role key ke variabel `NEXT_PUBLIC_` atau Git. Restart server setelah mengubah `.env.local`.

## Pemeriksaan

Jalankan `npm run lint`, `npm run typecheck`, dan `npm run build` sebelum menggabungkan perubahan.

## Struktur

- `src/app`: halaman dan tampilan dasar Next.js.
- `src/lib/supabase`: klien browser/server bersama. Modul autentikasi tim memakai modul ini.
- `docs/database-plan.md`: rancangan skema untuk tahap fitur.
- `docs/auth-integration.md`: kontrak penggabungan pekerjaan autentikasi.

Tahap berikutnya mencakup proyek Supabase, migrasi dan RLS, autentikasi, produk, resep, stok, POS, serta dashboard. Rancangan di `docs` belum diterapkan ke database.
