import { EmptyFeature, PageHeading } from "@/components/page-parts";

export default function SalesPage() {
  return <div className="page-stack"><PageHeading eyebrow="PENJUALAN" title="Riwayat penjualan" description="Temukan kembali transaksi dan metode pembayaran yang dicatat." /><EmptyFeature title="Belum ada transaksi" description="Setelah kasir selesai dibangun, setiap transaksi akan muncul di sini bersama rincian produk dan totalnya." steps={["Lihat tanggal dan waktu transaksi", "Periksa produk serta total pembayaran", "Tinjau metode tunai atau QRIS"]} /></div>;
}
