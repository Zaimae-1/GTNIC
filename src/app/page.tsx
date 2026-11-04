import Link from "next/link";
import {
  ButtonLink,
  Icon,
  MenuCard,
  Photo,
  SectionTitle,
} from "@/components/ui";
import { dishes } from "@/lib/restaurant";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" /> DARI DAPUR, UNTUK ORANG TERDEKAT
          </p>
          <h1>
            Selalu ada rasa
            <br />
            untuk <em>bersama.</em>
          </h1>
          <p>
            Meja yang hangat. Masakan yang akrab.
            <br />
            Nikmati sajian Nusantara dan waktu berkualitas
            <br className="desktop-break" /> dengan mereka yang berarti.
          </p>
          <div className="hero-buttons">
            <ButtonLink href="/menu">Temukan menu favorit</ButtonLink>
            <ButtonLink href="/reservasi" secondary>
              Reservasi meja
            </ButtonLink>
          </div>
          <div className="hero-footnotes">
            <span>
              <Icon name="leaf" /> Dimasak saat dipesan
            </span>
            <span>
              <Icon name="table" /> Nyaman untuk keluarga
            </span>
          </div>
        </div>
        <div className="hero-composition">
          <div className="hero-image-frame">
            <Photo
              image="ayam.webp"
              alt="Ilustrasi sajian panggang hangat dengan bumbu rempah"
              priority
            />
          </div>
          <div className="hero-stamp">
            <small>RASA LOKAL</small>
            <span aria-hidden="true">✳</span>
            <small>SEPENUH HATI</small>
          </div>
          <div className="hero-image-note">
            <span>KENALAN DENGAN ANDALAN KAMI</span>
            <strong>Hangat dari dapur.</strong>
            <Link href="/menu/ayam-bakar">
              Ayam Bakar Rempah <Icon name="arrow" />
            </Link>
          </div>
          <span className="hero-side-text">
            MOMEN SEDERHANA, RASA ISTIMEWA.
          </span>
        </div>
      </section>
      <div className="values-ribbon">
        <div className="container">
          <span>Resep penuh cerita</span>
          <span aria-hidden="true">✳</span>
          <span>Rasa Nusantara</span>
          <span aria-hidden="true">✳</span>
          <span>Meja untuk semua</span>
          <span aria-hidden="true">✳</span>
          <span>Lebih nikmat bersama</span>
        </div>
      </div>
      <section className="section container">
        <SectionTitle
          label="PILIHAN DARI DAPUR KAMI"
          title="Sulit pilih satu? Kami mengerti."
          description="Dari lauk andalan sampai sajian hangat untuk berbagi."
        >
          <Link className="text-link" href="/menu">
            Jelajahi semua menu <Icon name="arrow" />
          </Link>
        </SectionTitle>
        <div className="menu-grid home-menu">
          {dishes
            .filter((dish) => dish.favorite)
            .slice(0, 3)
            .map((dish) => (
              <MenuCard key={dish.id} dish={dish} />
            ))}
        </div>
      </section>
      <section className="story-section" id="cerita">
        <div className="container story-grid">
          <div className="story-photo">
            <Photo
              image="restaurant"
              alt="Ilustrasi suasana restoran hangat dengan meja kayu dan cahaya lembut"
            />
            <span className="story-photo-label">
              Makan enak, ngobrol lebih lama.
            </span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">SEDERHANA, TAPI BERARTI</p>
            <h2>
              Bukan sekadar makan.
              <br />
              <em>Waktunya bersama.</em>
            </h2>
            <p>
              Di antara hari yang sibuk, selalu ada alasan untuk duduk sejenak.
              Membagi lauk, bertukar cerita, dan menikmati rasa yang
              mengingatkan pada rumah.
            </p>
            <p>
              Itulah suasana yang ingin kami hadirkan di Saji Rasa. Menu yang
              familiar dan tempat yang membuat semua orang merasa diterima.
            </p>
            <div className="story-details">
              <span>
                <Icon name="leaf" /> Masakan Indonesia
              </span>
              <span>
                <Icon name="table" /> Beragam area makan
              </span>
            </div>
            <ButtonLink href="/reservasi">Siapkan meja Anda</ButtonLink>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          label="PILIH SUASANA ANDA"
          title="Satu tempat. Banyak momen."
          description="Makan siang santai, kumpul keluarga, atau perayaan kecil."
        />
        <div className="occasion-grid">
          <Link
            href="/reservasi?area=Ruang%20keluarga"
            className="occasion-card"
          >
            <Photo
              image="restaurant"
              alt="Ilustrasi area makan dalam ruangan"
            />
            <div>
              <span>01 / RUANG KELUARGA</span>
              <h3>
                Duduk nyaman,
                <br />
                cerita lebih panjang.
              </h3>
              <span className="occasion-arrow">
                <Icon name="arrow" />
              </span>
            </div>
          </Link>
          <Link href="/reservasi?area=Teras%20taman" className="occasion-card">
            <Photo
              image="table"
              alt="Ilustrasi meja makan untuk momen bersama"
            />
            <div>
              <span>02 / MEJA BERSAMA</span>
              <h3>
                Untuk pertemuan
                <br />
                yang dirindukan.
              </h3>
              <span className="occasion-arrow">
                <Icon name="arrow" />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="visit-section" id="lokasi">
        <div className="container visit-grid">
          <div>
            <p className="eyebrow">KAMI SIAP MENYAMBUT</p>
            <h2>
              Datang dengan selera.
              <br />
              <em>Pulang membawa cerita.</em>
            </h2>
            <p>
              Rencanakan kunjungan Anda dan pilih suasana yang paling nyaman.
            </p>
            <ButtonLink href="/reservasi">Buat reservasi</ButtonLink>
          </div>
          <div className="visit-info">
            <div>
              <Icon name="clock" />
              <div>
                <h3>Waktu untuk makan enak</h3>
                <p>
                  Setiap hari · 10.00–21.00
                  <br />
                  Jam operasional contoh
                </p>
              </div>
            </div>
            <div>
              <Icon name="pin" />
              <div>
                <h3>Lokasi restoran</h3>
                <p>
                  Alamat resmi sedang disiapkan.
                  <br />
                  Detail lokasi perlu dikonfirmasi sebelum berkunjung.
                </p>
              </div>
            </div>
            <Link href="/akun" className="text-link">
              Cek rencana kunjungan Anda <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
