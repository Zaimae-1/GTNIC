# Kontrak integrasi autentikasi

Teman yang mengerjakan autentikasi memiliki halaman login/register, logout, sesi, callback, dan proteksi rute. Fondasi ini menyediakan `src/lib/supabase/client.ts` dan `server.ts`; gunakan atau sesuaikan modul bersama itu, jangan membuat konfigurasi Supabase lain yang berjalan paralel.

Gunakan satu proyek Supabase tim dan variabel `NEXT_PUBLIC_SUPABASE_URL` serta `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Sesi mengikuti cookie yang digunakan `@supabase/ssr`. Saat mengintegrasikan autentikasi, tambahkan mekanisme penyegaran sesi di batas request sesuai panduan Supabase/Next.js versi yang terpasang, lalu uji login, logout, muat ulang halaman, dan akses halaman terlindungi.

Sebelum merge, bandingkan perubahan `package.json`, lockfile, `src/app/layout.tsx`, dan modul Supabase. Integrator menyelesaikan konflik pada file bersama; halaman autentikasi dapat masuk sebagai rute tersendiri. Registrasi pemilik usaha dan kebijakan akses data diimplementasikan bersamaan dengan skema serta RLS, bukan di fondasi ini.
