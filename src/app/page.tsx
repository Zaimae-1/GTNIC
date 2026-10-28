import Link from "next/link";

const benefits = [
  { number: "01", title: "Jual dengan lebih mudah", description: "Catat pesanan dan metode pembayaran dalam alur yang sederhana." },
  { number: "02", title: "Tahu stok yang tersisa", description: "Resep membantu menghitung bahan yang dipakai setiap kali produk terjual." },
  { number: "03", title: "Kurangi bahan terbuang", description: "Lihat bahan yang menipis atau mendekati tanggal kedaluwarsa." },
];

export default function Home() {
  return (
    <div className="home-page">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <header className="home-header">
        <Link href="/" className="brand" aria-label="DapurCerdas, halaman utama"><span className="brand-mark" aria-hidden="true">D</span><span>DapurCerdas</span></Link>
        <Link href="/dashboard" className="header-link">Lihat dashboard <span aria-hidden="true">→</span></Link>
      </header>
      <main id="main-content">
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">SMART POS UNTUK USAHA KULINER</p>
            <h1>Usaha lebih tertata, <span>hari terasa lebih ringan.</span></h1>
            <p className="hero-description">Penjualan, resep, dan stok bahan dalam satu tempat yang mudah dipahami. Dibuat untuk membantu usaha kecil menjalani hari dengan lebih tenang.</p>
            <div className="hero-actions"><Link href="/dashboard" className="button-primary">Lihat tampilan aplikasi <span aria-hidden="true">→</span></Link><span className="hero-note">Pratinjau dengan data contoh</span></div>
          </div>
          <div className="hero-visual" aria-label="Ilustrasi ringkasan usaha">
            <div className="visual-top"><span className="visual-logo">D</span><span>Ringkasan hari ini</span><span className="visual-dots" aria-hidden="true">•••</span></div>
            <div className="visual-main"><span>Penjualan hari ini</span><strong>Rp 245.000</strong><small>8 transaksi contoh</small></div>
            <div className="visual-row"><span className="visual-indicator" aria-hidden="true" /><span><strong>Stok lebih terkendali</strong><small>Periksa bahan yang perlu perhatian</small></span></div>
            <div className="visual-row"><span className="visual-indicator visual-indicator-light" aria-hidden="true" /><span><strong>Resep selalu tercatat</strong><small>Takaran bahan per porsi</small></span></div>
          </div>
        </section>
        <section className="home-benefits" aria-labelledby="benefits-title"><div className="section-heading"><p className="eyebrow">DIBUAT UNTUK KESEHARIAN USAHA</p><h2 id="benefits-title">Yang penting, terlihat jelas.</h2><p>Tiga hal utama agar Anda bisa fokus melayani pelanggan.</p></div><div className="benefit-grid">{benefits.map((benefit) => <article className="benefit-card" key={benefit.number}><span>{benefit.number}</span><h3>{benefit.title}</h3><p>{benefit.description}</p></article>)}</div></section>
      </main>
      <footer className="home-footer"><span>DapurCerdas</span><span>Fondasi aplikasi • Fitur sedang dikembangkan</span></footer>
    </div>
  );
}
