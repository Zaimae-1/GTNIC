import { EmptyFeature, PageHeading } from "@/components/page-parts";

export default function WastePage() {
  return <div className="page-stack"><PageHeading eyebrow="PERSEDIAAN" title="Bahan terbuang" description="Catat bahan yang rusak, tumpah, atau tidak dapat digunakan." /><EmptyFeature title="Pencatatan belum tersedia" description="Nanti setiap bahan terbuang akan memiliki jumlah dan alasan yang jelas, sekaligus mengurangi stoknya." steps={["Pilih bahan dan batch", "Masukkan jumlah yang terbuang", "Catat alasan agar mudah ditinjau"]} /></div>;
}
