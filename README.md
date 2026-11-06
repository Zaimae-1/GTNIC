# Saji Rasa

Prototipe website restoran Nusantara. Dibangun ulang dari fondasi DapurCerdas di branch zaim, dengan alur pelanggan mengacu pada situs Restoran Rahmawati dan identitas visual baru.

## Jalankan

Gunakan Node.js yang kompatibel dengan Next.js 16, lalu:

1. Jalankan npm ci.
2. Jalankan npm run dev.
3. Buka http://localhost:3000.

Pemeriksaan: npm run lint, npm run typecheck, dan npm run build. Untuk menjalankan build produksi: npm run start setelah build berhasil.

Halaman restoran dapat dicoba tanpa variabel lingkungan. Untuk chat Gemini, salin .env.example menjadi .env.local lalu isi GEMINI_API_KEY. GEMINI_MODEL opsional (default gemini-3.5-flash-lite). Restart server setelah mengubah konfigurasi. Jangan gunakan awalan NEXT_PUBLIC_ untuk key Gemini. Modul Supabase lama tetap tersedia, tetapi belum digunakan oleh aplikasi restoran.

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
- Chat pelanggan terhubung ke Gemini melalui POST /api/chat di server. Mendukung konteks pertanyaan lanjutan dan tautan menu. Saat layanan gagal, pengguna dapat mencoba lagi atau memilih bantuan dasar lokal yang ditandai jelas.

## Chat Gemini

API key hanya dibaca server dan dikirim ke Google melalui header, bukan ke browser. Konteks model berasal dari menu contoh di kode dan ID menu yang tidak tersedia pada browser. Riwayat yang dikirim dibatasi delapan pesan terakhir; data order/reservasi, nomor pelanggan, dan seluruh penyimpanan browser tidak dikirim. Teks yang diketik ke chat tetap dikirim ke Google, jadi jangan masukkan kredensial atau data pribadi.

Permintaan dibatasi panjangnya, diberi timeout, dan memiliki pembatas sederhana 10 permintaan per menit per alamat jaringan dalam satu proses. Pembatas ini tidak terdistribusi dan tidak menggantikan autentikasi atau layanan pembatas kuota untuk produksi. Daftar tautan jawaban diperiksa kembali di server. AI tidak dapat membuat order, memproses pembayaran, atau mengonfirmasi meja.

Jalankan npm run test:chat untuk pemeriksaan route tanpa memakai API key atau melakukan panggilan berbayar. Di hosting nanti, masukkan GEMINI_API_KEY dan GEMINI_MODEL melalui environment variables penyedia hosting; .env.local tidak ikut Git.

## Batas prototipe

Data disimpan di localStorage dengan key sajirasa-demo-v1. Data tidak tersinkron antarperangkat dan dapat hilang jika penyimpanan browser dibersihkan. Panel staf melihat data yang dibuat pada browser/origin yang sama. Ini bukan autentikasi atau penyimpanan server.

Pembayaran tidak diproses; metode hanya dicatat. Pesanan tidak dikirim ke dapur nyata dan pengajuan reservasi tidak menjamin meja nyata. Menu, harga, jam buka, area, dan alamat adalah data contoh. Kontak WhatsApp kosong secara default; dapat diisi melalui pengaturan demo, lalu tautan WhatsApp dan pencarian alamat pada footer menjadi tersedia.

Untuk mencoba: pilih menu → atur varian → tambah ke keranjang → lengkapi checkout → buka /admin dan ubah status → periksa /akun. Reservasi dapat ditinjau dan dikonfirmasi melalui panel yang sama. Tidak ada data yang dikirim ke situs referensi.

## Integrasi berikutnya

Lihat docs/integrations.md. Jangan gunakan panel demo terbuka untuk data pelanggan nyata. Terapkan autentikasi staf, otorisasi server, database, dan validasi harga/ketersediaan pada server sebelum penggunaan operasional.

Versi DapurCerdas terdahulu ada pada tag lokal backup/dapurcerdas-20261104 dan riwayat Git.
