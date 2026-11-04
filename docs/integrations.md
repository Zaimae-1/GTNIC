# Integrasi restoran berikutnya

Fondasi UI berada di src/components dan data menu contoh di src/lib/restaurant.ts. src/lib/restaurant-store.ts menyediakan simulasi browser untuk cart, order, reservasi, ketersediaan menu, dan pengaturan.

## Pekerjaan autentikasi teman

Tujuan produk kini website restoran pelanggan. Jangan menggabungkan halaman login POS lama secara langsung. Tinjau bersama pilihan akun pelanggan (WhatsApp OTP atau email Supabase), serta akun staf.

- UI akun/OTP sekarang berada di src/components/customer-pages.tsx, route /login dan /akun.
- Panel /admin adalah demo publik. Ganti dengan autentikasi dan pengecekan role di server saat backend siap.
- Modul Supabase browser/server dan .env.example tetap tersedia untuk integrasi. Jangan menyimpan service-role key di kode klien.
- Pekerjaan login tidak boleh mengubah struktur menu, cart, atau CSS global tanpa koordinasi.

## Fitur yang memerlukan layanan nyata

1. Database restoran: menu, varian, order, item, pembayaran, meja, reservasi, pengaturan. Hitung ulang total dan kunci ketersediaan pada server.
2. Akun dan izin: pelanggan hanya membaca data miliknya; staf dibatasi berdasarkan role/restoran. Lindungi semua endpoint dan query, bukan hanya halaman.
3. OTP WhatsApp: penyedia resmi, verifikasi server, batas permintaan, penanganan kedaluwarsa kode. Jangan mensimulasikan OTP sebagai autentikasi sungguhan.
4. Pembayaran: penyedia pembayaran, webhook, status pembayaran server, idempotensi. Jangan menandai lunas berdasarkan tombol pelanggan.
5. Reservasi: aturan kapasitas dan durasi yang disepakati serta transaksi database untuk mencegah dua pengajuan memakai meja yang sama.
6. Chat: saat ini berbasis topik. Hubungkan model atau staf hanya jika penyedia dan informasi restoran sudah disepakati.
7. Konten: konfirmasi nama merek, kontak, lokasi, harga, pajak, jam, foto final, dan kapasitas meja.

Status admin lokal menghitung laporan hanya dari order Selesai, tetapi status tersebut tidak membuktikan adanya pembayaran. Data demo dan perubahan tab browser dapat diperiksa tanpa layanan eksternal.
