import { EmptyFeature, PageHeading } from "@/components/page-parts";

export default function ProductsPage() {
  return <div className="page-stack"><PageHeading eyebrow="MENU USAHA" title="Produk & resep" description="Atur produk yang dijual, harga, dan kebutuhan bahan per porsi." /><EmptyFeature title="Daftar produk belum tersedia" description="Saat fitur ini terhubung, setiap produk dapat memiliki resep agar pemakaian stok tercatat otomatis." steps={["Tambahkan nama dan harga produk", "Pilih bahan yang dipakai", "Isi takaran bahan per porsi"]} /></div>;
}
