"use client";
import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/restaurant";
import { updateRestaurant, useRestaurant } from "@/lib/restaurant-store";
import { ButtonLink, EmptyState, Icon, Notice, PageTitle } from "./ui";
export function AccountPage() {
  const state = useRestaurant();
  const [tab, setTab] = useState("Pesanan");
  const [message, setMessage] = useState("");
  function cancelReservation(id: string) {
    if (!window.confirm("Batalkan pengajuan reservasi demo ini?")) return;
    try {
      updateRestaurant((current) => ({
        ...current,
        reservations: current.reservations.map((item) =>
          item.id === id ? { ...item, status: "Dibatalkan" } : item,
        ),
      }));
    } catch (error) {
      setMessage((error as Error).message);
    }
  }
  return (
    <div className="container inner-page">
      <PageTitle
        label="RUANG PELANGGAN"
        title="Rencana & rasa favorit Anda."
        description="Lihat pesanan dan reservasi yang dibuat melalui perangkat ini."
      />
      <Notice>
        Mode tamu lokal. Data belum terhubung ke akun, WhatsApp, atau perangkat
        lain. <Link href="/login">Tentang akses akun →</Link>
      </Notice>
      <div className="category-tabs">
        <button
          aria-pressed={tab === "Pesanan"}
          onClick={() => setTab("Pesanan")}
        >
          Pesanan ({state.orders.length})
        </button>
        <button
          aria-pressed={tab === "Reservasi"}
          onClick={() => setTab("Reservasi")}
        >
          Reservasi ({state.reservations.length})
        </button>
      </div>
      {message && (
        <p role="alert" className="form-error">
          {message}
        </p>
      )}
      {tab === "Pesanan" ? (
        state.orders.length ? (
          <div className="record-list">
            {state.orders.map((order) => (
              <article className="panel record-card" key={order.id}>
                <div className="record-heading">
                  <div>
                    <span className="record-code">{order.id}</span>
                    <h2>{order.name}</h2>
                  </div>
                  <span className="status-tag">{order.status}</span>
                </div>
                <p>
                  {new Date(order.createdAt).toLocaleString("id-ID")} ·{" "}
                  {order.method}
                  {order.table ? " · Meja " + order.table : ""}
                </p>
                <p>
                  {order.items
                    .map((item) => item.quantity + "× " + item.name)
                    .join(", ")}
                </p>
                <div className="record-bottom">
                  <strong>{money(order.total)}</strong>
                  <Link href={"/pesanan/" + order.id} className="text-link">
                    Lihat rincian <Icon name="arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada pesanan."
            description="Pesanan simulasi Anda akan muncul di sini setelah menyelesaikan keranjang."
            href="/menu"
            label="Mulai pilih menu"
          />
        )
      ) : state.reservations.length ? (
        <div className="record-list">
          {state.reservations.map((item) => (
            <article className="panel record-card" key={item.id}>
              <div className="record-heading">
                <div>
                  <span className="record-code">{item.id}</span>
                  <h2>{item.name}</h2>
                </div>
                <span className="status-tag">{item.status}</span>
              </div>
              <p>
                {item.date} · {item.time} · {item.guests} orang
              </p>
              <p>
                {item.area}
                {item.table ? " · Meja " + item.table : " · Meja diatur staf"}
              </p>
              {item.note && <p className="muted">{item.note}</p>}
              <div className="record-bottom">
                <span>{item.occasion}</span>
                {item.status === "Menunggu konfirmasi" && (
                  <button
                    className="text-button danger"
                    onClick={() => cancelReservation(item.id)}
                  >
                    Batalkan pengajuan
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada rencana kunjungan."
          description="Siapkan momen bersama dengan memilih area dan waktu yang nyaman."
          href="/reservasi"
          label="Rencanakan kunjungan"
        />
      )}
    </div>
  );
}
export function OrderPage({ id }: { id: string }) {
  const state = useRestaurant();
  const order = state.orders.find((item) => item.id === id);
  const [message, setMessage] = useState("");
  if (!order)
    return (
      <div className="container inner-page">
        <EmptyState
          title="Pesanan belum ditemukan."
          description="Pesanan demo hanya tersedia di browser tempat pesanan dibuat."
          href="/akun"
          label="Lihat pesanan saya"
        />
      </div>
    );
  const steps = [
    "Menunggu konfirmasi",
    "Diproses dapur",
    "Siap disajikan",
    "Selesai",
  ];
  const current = steps.indexOf(order.status);
  return (
    <div className="container inner-page order-page">
      <Link className="back-link no-print" href="/akun">
        ← Kembali ke pesanan saya
      </Link>
      <PageTitle
        label="PESANAN SIMULASI"
        title={
          order.status === "Selesai"
            ? "Terima kasih, sampai bertemu lagi."
            : "Pilihan Anda sudah tercatat."
        }
        description={"Nomor pesanan " + order.id}
      />
      <Notice>
        Pesanan tersimpan lokal dan belum diteruskan ke restoran. Status diubah
        melalui panel staf demo; pembayaran belum diproses.
      </Notice>
      <div className="order-timeline">
        {steps.map((step, index) => (
          <div className={index <= current ? "complete" : ""} key={step}>
            <span>{index < current ? <Icon name="check" /> : index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      {order.status === "Dibatalkan" && (
        <p className="form-error">Pesanan ini dibatalkan pada demo.</p>
      )}
      <div className="panel receipt">
        <div className="record-heading">
          <div>
            <p className="eyebrow">SAJI RASA</p>
            <h2>Rincian pesanan</h2>
          </div>
          <span className="status-tag">{order.status}</span>
        </div>
        <dl className="summary-lines">
          <div>
            <dt>Pemesan</dt>
            <dd>{order.name}</dd>
          </div>
          <div>
            <dt>Waktu</dt>
            <dd>{new Date(order.createdAt).toLocaleString("id-ID")}</dd>
          </div>
          <div>
            <dt>Cara menikmati</dt>
            <dd>
              {order.method}
              {order.table ? " · Meja " + order.table : ""}
            </dd>
          </div>
          <div>
            <dt>Pembayaran</dt>
            <dd>
              {order.payment}
              <small>Belum dibayar melalui aplikasi</small>
            </dd>
          </div>
        </dl>
        <div className="receipt-items">
          {order.items.map((item) => (
            <div key={item.key}>
              <span>
                <strong>
                  {item.quantity}× {item.name}
                </strong>
                <small>
                  {item.variant} · {item.spice}
                  {item.extras.length ? " · " + item.extras.join(", ") : ""}
                  {item.note ? " · " + item.note : ""}
                </small>
              </span>
              <strong>{money(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="receipt-total">
          <span>Total</span>
          <strong>{money(order.total)}</strong>
        </div>
        {order.note && <p>Catatan: {order.note}</p>}
        <div className="button-row no-print">
          <button
            className="button button-light"
            onClick={() => window.print()}
          >
            Cetak rincian
          </button>
          <button
            className="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(order.id);
                setMessage("Nomor pesanan disalin.");
              } catch {
                setMessage("Salin manual: " + order.id);
              }
            }}
          >
            Salin nomor pesanan
          </button>
        </div>
        <p role="status">{message}</p>
      </div>
    </div>
  );
}
export function LoginPage() {
  const [phone, setPhone] = useState("");
  return (
    <div className="container inner-page auth-page">
      <PageTitle
        label="AKUN PELANGGAN"
        title="Kenali rasa. Simpan ceritanya."
        description="Akses akun pelanggan direncanakan menggunakan nomor WhatsApp."
      />
      <div className="panel auth-panel">
        <span className="empty-symbol">
          <Icon name="user" />
        </span>
        <h2>Masuk dengan WhatsApp</h2>
        <p>
          Kode verifikasi akan diperlukan untuk menghubungkan riwayat pesanan
          dengan akun Anda.
        </p>
        <label className="field">
          Nomor WhatsApp
          <input
            type="tel"
            autoComplete="tel"
            placeholder="08xxxxxxxxxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            maxLength={18}
          />
        </label>
        <button className="button full-width" disabled>
          Kirim kode OTP · belum aktif
        </button>
        <p className="field-hint">
          Pengiriman OTP belum terhubung ke penyedia WhatsApp. Tidak ada kode
          atau pesan yang dikirim.
        </p>
        <div className="auth-divider">Tetap bisa menjelajah</div>
        <ButtonLink href="/akun" secondary>
          Lihat pesanan perangkat ini
        </ButtonLink>
        <Link href="/menu" className="text-link">
          Lanjut pilih menu tanpa akun →
        </Link>
      </div>
    </div>
  );
}
