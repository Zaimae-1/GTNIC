# Saji Rasa

Prototipe website restoran Nusantara. Dibangun ulang dari fondasi DapurCerdas di branch zaim, dengan alur pelanggan mengacu pada situs Restoran Rahmawati dan identitas visual baru.

## Jalankan

Gunakan Node.js yang kompatibel dengan Next.js 16, lalu:

1. Jalankan npm ci.
2. Jalankan npm run dev.
3. Buka http://localhost:3000.

Pemeriksaan: npm run lint, npm run typecheck, dan npm run build. Untuk menjalankan build produksi: npm run start setelah build berhasil.

Tidak ada variabel lingkungan yang diperlukan untuk mencoba prototipe. Modul Supabase lama tetap tersedia di src/lib/supabase sebagai titik integrasi berikutnya, tetapi belum digunakan oleh aplikasi restoran.

## Halaman dan fungsi

- /: beranda, pilihan menu, cerita, area makan, dan informasi lokasi.
- /menu: 16 menu contoh, pencarian, kategori, favorit, pengurutan harga, pilihan nomor meja.
- /menu/[id]: varian, pedas/manis, tambahan, catatan, jumlah porsi, favorit, penambahan ke keranjang.
- /cart: ubah jumlah, hapus item, makan di tempat/bawa pulang, data pemesan, pilihan metode pembayaran, pesanan simulasi.
- /pesanan/[id]: rincian, status, salin nomor, cetak rincian.
- /reservasi: data pengunjung, jadwal, area, denah meja ilustrasi, tinjau dan simpan pengajuan.
- /akun: pesanan dan reservasi perangkat ini; batalkan pengajuan yang belum dikonfirmasi.
- /login: rancangan masuk WhatsApp; pengiriman OTP belum aktif. /register diarahkan ke halaman ini.
- /admin: **panel demo lokal terbuka**, ringkasan, pengelolaan status pesanan/reservasi, ketersediaan menu, meja, laporan dan pengaturan kontak restoran.
- Bantuan percakapan memakai bahasa santai, konteks pertanyaan lanjutan, pilihan berdasarkan harga, dan tautan menu. Jawaban diproses lokal berdasarkan data contoh; belum memakai model AI atau chat staf.

## Batas prototipe

Data disimpan di localStorage dengan key sajirasa-demo-v1. Data tidak tersinkron antarperangkat dan dapat hilang jika penyimpanan browser dibersihkan. Panel staf melihat data yang dibuat pada browser/origin yang sama. Ini bukan autentikasi atau penyimpanan server.

Pembayaran tidak diproses; metode hanya dicatat. Pesanan tidak dikirim ke dapur nyata dan pengajuan reservasi tidak menjamin meja nyata. Menu, harga, jam buka, area, dan alamat adalah data contoh. Kontak WhatsApp kosong secara default; dapat diisi melalui pengaturan demo, lalu tautan WhatsApp dan pencarian alamat pada footer menjadi tersedia.

Untuk mencoba: pilih menu → atur varian → tambah ke keranjang → lengkapi checkout → buka /admin dan ubah status → periksa /akun. Reservasi dapat ditinjau dan dikonfirmasi melalui panel yang sama. Tidak ada data yang dikirim ke situs referensi.

## Integrasi berikutnya

Lihat docs/integrations.md. Jangan gunakan panel demo terbuka untuk data pelanggan nyata. Terapkan autentikasi staf, otorisasi server, database, dan validasi harga/ketersediaan pada server sebelum penggunaan operasional.

Versi DapurCerdas terdahulu ada pada tag lokal backup/dapurcerdas-20261104 dan riwayat Git.
