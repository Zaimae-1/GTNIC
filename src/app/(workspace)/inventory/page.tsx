import { EmptyFeature, PageHeading } from "@/components/page-parts";

export default function InventoryPage() {
  return <div className="page-stack"><PageHeading eyebrow="PERSEDIAAN" title="Stok bahan" description="Pantau jumlah bahan dan tanggal kedaluwarsa tiap pembelian." /><EmptyFeature title="Stok bahan belum tersedia" description="Bahan akan dicatat per batch supaya bahan yang mendekati kedaluwarsa mudah ditemukan." steps={["Daftarkan bahan dan satuannya", "Catat jumlah serta tanggal kedaluwarsa", "Lihat peringatan saat stok menipis"]} /></div>;
}
