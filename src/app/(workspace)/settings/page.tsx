import { Card, PageHeading } from "@/components/page-parts";

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <PageHeading eyebrow="PREFERENSI" title="Pengaturan" description="Informasi usaha dan cara aplikasi menampilkan data." />
      <div className="settings-grid">
        <Card title="Informasi usaha">
          <dl className="detail-list"><div><dt>Nama usaha</dt><dd>Belum diatur</dd></div><div><dt>Zona waktu</dt><dd>Asia/Jakarta (contoh)</dd></div><div><dt>Mata uang</dt><dd>Rupiah (Rp)</dd></div></dl>
          <p className="muted">Pengubahan informasi usaha tersedia setelah akun dan database terhubung.</p>
        </Card>
        <Card title="Kenyamanan membaca">
          <p>Huruf besar, jarak antarbaris lega, dan warna berkontras jelas digunakan di seluruh aplikasi.</p>
          <p className="muted settings-footnote">Pengaturan ukuran huruf pribadi akan ditambahkan pada tahap berikutnya. Anda juga dapat memakai fitur perbesaran di browser.</p>
        </Card>
      </div>
    </div>
  );
}
