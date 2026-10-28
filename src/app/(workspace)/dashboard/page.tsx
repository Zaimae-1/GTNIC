import Link from "next/link";
import { Card, DemoNotice, PageHeading } from "@/components/page-parts";

const metrics = [
  { label: "Penjualan hari ini", value: "Rp 245.000", detail: "8 transaksi contoh" },
  { label: "Produk terjual", value: "18 porsi", detail: "Dari semua produk" },
  { label: "Bahan perlu dicek", value: "2 bahan", detail: "Stok rendah atau segera kedaluwarsa" },
];

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeading eyebrow="RINGKASAN USAHA" title="Dashboard" description="Lihat hal terpenting untuk usaha Anda dalam satu halaman." />
      <DemoNotice />
      <div className="metric-grid">
        {metrics.map((metric) => (
          <Card key={metric.label} className="metric-card">
            <h2>{metric.label}</h2>
            <p className="metric-value">{metric.value}</p>
            <p className="muted">{metric.detail}</p>
          </Card>
        ))}
      </div>
      <div className="content-grid">
        <Card title="Perlu perhatian">
          <ul className="attention-list">
            <li><span className="status-dot status-amber" /><span><strong>Susu segar</strong><small>Stok tersisa 800 ml</small></span></li>
            <li><span className="status-dot status-red" /><span><strong>Sirup vanila</strong><small>Kedaluwarsa dalam 2 hari</small></span></li>
          </ul>
          <Link href="/inventory" className="text-link">Lihat stok bahan <span aria-hidden="true">→</span></Link>
        </Card>
        <Card title="Akses cepat">
          <div className="quick-links">
            <Link href="/pos" className="quick-link"><strong>Buka kasir</strong><span>Catat penjualan baru</span></Link>
            <Link href="/products" className="quick-link"><strong>Produk & resep</strong><span>Siapkan menu dan takaran bahan</span></Link>
            <Link href="/sales" className="quick-link"><strong>Riwayat penjualan</strong><span>Lihat transaksi yang tercatat</span></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
