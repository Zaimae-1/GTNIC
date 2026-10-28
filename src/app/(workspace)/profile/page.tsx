import { Card, PageHeading } from "@/components/page-parts";

export default function ProfilePage() {
  return (
    <div className="page-stack">
      <PageHeading eyebrow="AKUN SAYA" title="Profil" description="Tempat melihat informasi akun pemilik usaha." />
      <Card className="profile-card">
        <span className="profile-avatar" aria-hidden="true">P</span>
        <div><h2>Akun pemilik</h2><p className="muted">Informasi profil akan tampil setelah Anda masuk.</p></div>
      </Card>
      <Card title="Informasi akun">
        <dl className="detail-list"><div><dt>Nama</dt><dd>Belum tersedia</dd></div><div><dt>Email</dt><dd>Belum tersedia</dd></div><div><dt>Peran</dt><dd>Pemilik usaha</dd></div></dl>
        <p className="muted settings-footnote">Halaman ini akan dihubungkan dengan sistem login dan register yang sedang dikerjakan.</p>
      </Card>
    </div>
  );
}
