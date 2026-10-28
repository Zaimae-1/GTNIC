# Rancangan database tahap fitur

Rancangan ini belum diterapkan. Gunakan Supabase Auth (`auth.users`) untuk identitas pengguna dan satu usaha per pemilik pada versi lomba.

| Tabel | Kolom inti | Catatan |
| --- | --- | --- |
| `businesses` | `id`, `owner_id`, `name`, `timezone` | `owner_id` mengacu ke `auth.users`; satu usaha per pemilik. |
| `products` | `id`, `business_id`, `name`, `price_rupiah`, `is_active` | Harga bilangan bulat. |
| `ingredients` | `id`, `business_id`, `name`, `base_unit`, `minimum_quantity` | Satuan dasar `ml`, `g`, atau `pcs`. |
| `recipes` | `product_id`, `ingredient_id`, `quantity_per_portion` | Pasangan produk dan bahan unik; bahan harus dari usaha yang sama. |
| `stock_batches` | `id`, `ingredient_id`, `received_at`, `expires_on`, `initial_quantity`, `remaining_quantity` | Kedaluwarsa per batch; kuantitas desimal dan tidak negatif. |
| `sales` | `id`, `business_id`, `sold_at`, `total_rupiah`, `payment_method`, `idempotency_key` | Metode `cash`/`qris`; kunci unik mencegah transaksi ganda. |
| `sale_items` | `id`, `sale_id`, `product_id`, `product_name`, `quantity`, `unit_price_rupiah`, `subtotal_rupiah` | Nama dan harga disalin untuk riwayat. |
| `stock_movements` | `id`, `stock_batch_id`, `quantity_delta`, `kind`, `reason`, `sale_item_id`, `created_at` | Jejak stok masuk, penjualan, bahan terbuang, dan koreksi. |

Aturan implementasi: aktifkan RLS pada seluruh tabel bisnis dan batasi akses berdasarkan pemilik usaha. Pastikan relasi tidak melintasi usaha. Stok tersedia berasal dari batch yang belum kedaluwarsa, dengan pemakaian batch berdasarkan tanggal kedaluwarsa terdekat (FEFO). Bahan terbuang mengurangi batch dan membuat pergerakan dengan alasan.

Penyelesaian penjualan harus dilakukan dalam satu transaksi database: periksa serta kunci batch, hitung ulang harga dan resep dari database, simpan penjualan dan item, kurangi batch, dan catat pergerakan. Jika stok tidak cukup, seluruh operasi dibatalkan. Definisi migrasi, RLS, serta fungsi transaksi dibuat pada tahap implementasi fitur.
