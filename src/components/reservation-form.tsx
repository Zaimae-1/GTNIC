"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { areas, localDate } from "@/lib/restaurant";
import {
  makeId,
  type Reservation,
  useRestaurant,
  updateRestaurant,
} from "@/lib/restaurant-store";
import { ButtonLink, Icon, Notice, PageTitle, Photo } from "./ui";
export function ReservationForm({
  initialArea = "",
}: {
  initialArea?: string;
}) {
  const state = useRestaurant();
  const router = useRouter();
  const [area, setArea] = useState(
    areas.some((item) => item.name === initialArea)
      ? initialArea
      : areas[0].name,
  );
  const [table, setTable] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [draft, setDraft] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const saving = useRef(false);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    occasion: "Makan bersama",
    note: "",
  });
  const selectedArea = areas.find((item) => item.name === area)!;
  const unavailable = state.reservations
    .filter(
      (item) =>
        item.date === date &&
        item.area === area &&
        item.status !== "Dibatalkan" &&
        item.status !== "Ditolak" &&
        Math.abs(
          Number(item.time.slice(0, 2)) * 60 +
            Number(item.time.slice(3)) -
            Number(time.slice(0, 2)) * 60 -
            Number(time.slice(3)),
        ) < 90,
    )
    .map((item) => item.table);
  function review(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").replace(/[\s-]/g, "");
    if (!name || !/^(?:\+62|62|0)8\d{7,12}$/.test(phone)) {
      setError("Isi nama dan nomor WhatsApp Indonesia yang valid.");
      return;
    }
    if (!date || !time || new Date(date + "T" + time) <= new Date()) {
      setError("Pilih tanggal dan jam kunjungan yang belum lewat.");
      return;
    }
    if (
      table &&
      (unavailable.includes(table) || guests > selectedArea.capacity)
    ) {
      setError(
        "Meja tidak sesuai atau sudah dipilih pada waktu tersebut. Pilih meja lain atau biarkan staf mengatur.",
      );
      return;
    }
    setError("");
    setDraft({
      id: makeId("RSV"),
      name,
      phone,
      date,
      time,
      guests,
      area,
      table,
      occasion: String(form.get("occasion") || "Makan bersama"),
      note: String(form.get("note") || "").trim(),
      status: "Menunggu konfirmasi",
    });
  }
  function confirm() {
    if (!draft || saving.current) return;
    saving.current = true;
    try {
      updateRestaurant((current) => {
        const conflict =
          draft.table &&
          current.reservations.some(
            (item) =>
              item.date === draft.date &&
              item.area === draft.area &&
              item.table === draft.table &&
              !["Dibatalkan", "Ditolak", "Selesai"].includes(item.status) &&
              Math.abs(
                Number(item.time.slice(0, 2)) * 60 +
                  Number(item.time.slice(3)) -
                  Number(draft.time.slice(0, 2)) * 60 -
                  Number(draft.time.slice(3)),
              ) < 90,
          );
        if (conflict)
          throw new Error(
            "Meja baru saja dipilih oleh pengajuan lain di browser ini. Kembali dan pilih meja berbeda.",
          );
        return { ...current, reservations: [draft, ...current.reservations] };
      });
      setSaved(draft.id);
      setDraft(null);
    } catch (err) {
      saving.current = false;
      setError((err as Error).message);
    }
  }
  if (saved)
    return (
      <div className="container inner-page">
        <div className="success-panel">
          <span className="success-icon">
            <Icon name="check" />
          </span>
          <p className="eyebrow">PENGAJUAN SIMULASI TERSIMPAN</p>
          <h1>Meja untuk cerita berikutnya.</h1>
          <p>
            Kode reservasi Anda <strong>{saved}</strong>. Status masih menunggu
            konfirmasi demo. Pengajuan ini belum dikirim ke restoran.
          </p>
          <ButtonLink href="/akun">Lihat reservasi saya</ButtonLink>
          <button className="text-button" onClick={() => router.refresh()}>
            Data hanya tersimpan di browser ini
          </button>
        </div>
      </div>
    );
  return (
    <div className="container inner-page">
      <PageTitle
        label="SISAKAN WAKTU UNTUK BERSAMA"
        title="Mejanya kami siapkan."
        description="Bawa orang terdekat, pilih suasana, dan rencanakan momen Anda."
      />
      {draft ? (
        <div className="panel review-panel">
          <h2>Periksa rencana Anda</h2>
          <dl className="summary-lines">
            {[
              ["Atas nama", draft.name],
              ["WhatsApp", draft.phone],
              ["Tanggal & jam", draft.date + " · " + draft.time],
              ["Jumlah tamu", String(draft.guests) + " orang"],
              ["Area", draft.area],
              ["Meja", draft.table || "Diatur staf"],
              ["Acara", draft.occasion],
              ["Catatan", draft.note || "Tidak ada"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <Notice>
            Ini pengajuan simulasi yang disimpan di perangkat. Reservasi nyata
            memerlukan layanan backend dan konfirmasi staf.
          </Notice>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="button-row">
            <button
              className="button button-light"
              onClick={() => setDraft(null)}
            >
              Kembali mengedit
            </button>
            <button className="button" onClick={confirm}>
              Simpan reservasi demo <Icon name="check" />
            </button>
          </div>
        </div>
      ) : (
        <form className="reservation-grid" onSubmit={review}>
          <div>
            <section className="panel form-section">
              <h2>
                <span className="step-number">01</span> Siapa yang akan datang?
              </h2>
              <div className="form-grid">
                <label className="field">
                  Nama pemesan *
                  <input
                    name="name"
                    value={contact.name}
                    onChange={(event) =>
                      setContact({ ...contact, name: event.target.value })
                    }
                    required
                    autoComplete="name"
                    placeholder="Nama Anda"
                    maxLength={80}
                  />
                </label>
                <label className="field">
                  Nomor WhatsApp *
                  <input
                    name="phone"
                    value={contact.phone}
                    onChange={(event) =>
                      setContact({ ...contact, phone: event.target.value })
                    }
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    maxLength={18}
                  />
                </label>
              </div>
            </section>
            <section className="panel form-section">
              <h2>
                <span className="step-number">02</span> Rencana kunjungan
              </h2>
              <div className="form-grid">
                <label className="field">
                  Tanggal *
                  <input
                    type="date"
                    required
                    min={localDate()}
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setTable("");
                    }}
                  />
                </label>
                <label className="field">
                  Jam *
                  <select
                    required
                    value={time}
                    onChange={(event) => {
                      setTime(event.target.value);
                      setTable("");
                    }}
                  >
                    <option value="">Pilih jam</option>
                    {Array.from({ length: 21 }, (_, index) => {
                      const value =
                        String(10 + Math.floor(index / 2)).padStart(2, "0") +
                        ":" +
                        (index % 2 ? "30" : "00");
                      return <option key={value}>{value}</option>;
                    })}
                  </select>
                </label>
                <label className="field">
                  Jumlah tamu *
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={guests}
                    onChange={(event) => {
                      setGuests(Number(event.target.value));
                      setTable("");
                    }}
                  />
                </label>
                <label className="field">
                  Keperluan
                  <select
                    name="occasion"
                    value={contact.occasion}
                    onChange={(event) =>
                      setContact({ ...contact, occasion: event.target.value })
                    }
                  >
                    <option>Makan bersama</option>
                    <option>Ulang tahun</option>
                    <option>Arisan</option>
                    <option>Pertemuan</option>
                    <option>Lainnya</option>
                  </select>
                </label>
              </div>
              <label className="field">
                Catatan tambahan
                <textarea
                  name="note"
                  value={contact.note}
                  onChange={(event) =>
                    setContact({ ...contact, note: event.target.value })
                  }
                  maxLength={400}
                  placeholder="Contoh: perlu kursi anak atau akses kursi roda"
                />
              </label>
            </section>
            <section className="panel form-section">
              <h2>
                <span className="step-number">03</span> Pilih suasana
              </h2>
              <div className="area-grid">
                {areas.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={
                      "area-card" + (area === item.name ? " area-selected" : "")
                    }
                    aria-pressed={area === item.name}
                    onClick={() => {
                      setArea(item.name);
                      setTable("");
                    }}
                  >
                    <Photo image={item.image} alt={"Ilustrasi " + item.name} />
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                    <small>Hingga {item.capacity} orang per meja</small>
                  </button>
                ))}
              </div>
              <h3 className="table-title">
                Posisi meja <span className="muted">· opsional</span>
              </h3>
              <p className="muted">
                Denah ilustrasi. Ketersediaan di bawah hanya berdasarkan
                pengajuan pada browser ini.
              </p>
              <div className="table-map">
                {Array.from({ length: 8 }, (_, index) => {
                  const number = String(
                    areas.findIndex((item) => item.name === area) * 8 +
                      index +
                      1,
                  );
                  return (
                    <button
                      type="button"
                      key={number}
                      disabled={
                        unavailable.includes(number) ||
                        guests > selectedArea.capacity
                      }
                      aria-pressed={table === number}
                      className={table === number ? "selected" : ""}
                      onClick={() => setTable(table === number ? "" : number)}
                    >
                      <Icon name="table" />
                      {number}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => setTable("")}
              >
                Biarkan staf mengatur meja
              </button>
              <p className="field-hint">
                Untuk rombongan di atas kapasitas satu meja, staf perlu mengatur
                beberapa meja.
              </p>
            </section>
          </div>
          <aside className="reservation-summary">
            <Photo
              image="table"
              alt="Ilustrasi sajian dan suasana makan bersama"
            />
            <div className="panel">
              <p className="eyebrow">RENCANA ANDA</p>
              <h2>
                Sampai bertemu
                <br />
                <em>di meja kita.</em>
              </h2>
              <dl className="summary-lines">
                <div>
                  <dt>Tanggal</dt>
                  <dd>{date || "Belum dipilih"}</dd>
                </div>
                <div>
                  <dt>Jam</dt>
                  <dd>{time || "Belum dipilih"}</dd>
                </div>
                <div>
                  <dt>Tamu</dt>
                  <dd>{guests} orang</dd>
                </div>
                <div>
                  <dt>Area</dt>
                  <dd>{area}</dd>
                </div>
                <div>
                  <dt>Meja</dt>
                  <dd>{table || "Diatur staf"}</dd>
                </div>
              </dl>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="button full-width">
                Tinjau reservasi <Icon name="arrow" />
              </button>
              <p className="field-hint">
                Belum ada reservasi yang dikirim ke restoran. Konfirmasi staf
                diperlukan untuk kunjungan nyata.
              </p>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
