import { EmptyFeature, PageHeading } from "@/components/page-parts";

export default function PosPage() {
  return <div className="page-stack"><PageHeading eyebrow="PENJUALAN" title="Kasir" description="Tempat mencatat pesanan dan pembayaran pelanggan." /><EmptyFeature title="Kasir sedang disiapkan" description="Nanti Anda bisa memilih produk, memasukkan jumlah, lalu mencatat pembayaran tunai atau QRIS." steps={["Pilih produk dan jumlah", "Periksa total pesanan", "Selesaikan transaksi dan kurangi stok otomatis"]} /></div>;
}
