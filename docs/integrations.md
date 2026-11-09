# Integrasi restoran berikutnya

Fondasi UI berada di src/components dan data menu contoh di src/lib/restaurant.ts. src/lib/restaurant-store.ts menyimpan keranjang, pesanan demo, riwayat pelanggan, ketersediaan menu, dan pengaturan di browser. Supabase menyimpan pengajuan reservasi terpusat saat dikonfigurasi.

## Pekerjaan autentikasi teman

Tujuan produk kini website restoran pelanggan. Jangan menggabungkan halaman login POS lama secara langsung. Tinjau bersama pilihan akun pelanggan (WhatsApp OTP atau email Supabase), serta akun staf.

- UI akun/OTP sekarang berada di src/components/customer-pages.tsx, route /login dan /akun.
- Tab reservasi di /admin memakai Supabase Auth dan RLS. Fitur panel lain masih berjalan sebagai demo lokal.
- Kunci publishable Supabase dipakai untuk mengakses fungsi dengan hak terbatas. Akses staf mengikuti daftar `saji_reservation_staff`.
- Pekerjaan login tidak boleh mengubah struktur menu, cart, atau CSS global tanpa koordinasi.

## Fitur yang memerlukan layanan nyata

1. Database restoran: menu, varian, order, item, pembayaran, meja, pengaturan. Hitung ulang total dan kunci ketersediaan pada server.
2. Akun dan izin: pelanggan hanya membaca data miliknya; staf dibatasi berdasarkan role/restoran. Lindungi semua endpoint dan query, bukan hanya halaman.
3. OTP WhatsApp: penyedia resmi, verifikasi server, batas permintaan, penanganan kedaluwarsa kode. Jangan mensimulasikan OTP sebagai autentikasi sungguhan.
4. Pembayaran: penyedia pembayaran, webhook, status pembayaran server, idempotensi. Jangan menandai lunas berdasarkan tombol pelanggan.
5. Reservasi: sesuaikan kapasitas dan durasi demo 90 menit dengan aturan operasional restoran. Database sudah mencegah dua pengajuan aktif untuk meja yang sama dalam jadwal bertumpuk.
6. Chat: Gemini kini tersambung melalui route server /api/chat; key berada di GEMINI_API_KEY. Bantuan dasar lokal tetap tersedia atas pilihan pengguna ketika layanan gagal. AI hanya memberi informasi, tidak menjalankan transaksi atau mengakses data akun. Untuk produksi, tambahkan pembatas kuota terdistribusi serta autentikasi/aturan akses sesuai kebutuhan. Konten restoran masih data contoh.
7. Konten: konfirmasi nama merek, kontak, lokasi, harga, pajak, jam, foto final, dan kapasitas meja.

Status admin lokal menghitung laporan hanya dari order Selesai, tetapi status tersebut tidak membuktikan adanya pembayaran. Data demo dan perubahan tab browser dapat diperiksa tanpa layanan eksternal.
