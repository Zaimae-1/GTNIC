"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dishes, money } from "@/lib/restaurant";
import { type Reservation, updateRestaurant, useRestaurant } from "@/lib/restaurant-store";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { getStaffReservations, reservationStatuses, updateStaffReservation } from "@/lib/supabase/reservations";
import { Icon, Notice, PageTitle, Photo } from "./ui";
const tabs = [
  "Ringkasan",
  "Pesanan",
  "Reservasi",
  "Menu",
  "Meja",
  "Laporan",
  "Pengaturan",
];
export function AdminPanel() {
  const state = useRestaurant();
  const [tab, setTab] = useState("Ringkasan");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [staffReservations, setStaffReservations] = useState<Reservation[] | null>();
  const [reservationError, setReservationError] = useState("");
  const [reservationReload, setReservationReload] = useState(0);
  const [savingReservation, setSavingReservation] = useState(false);
  const reservations = hasSupabaseConfig ? staffReservations ?? [] : state.reservations;
  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let active = true;
    void getStaffReservations().then((items) => {
      if (!active) return;
      setReservationError("");
      setStaffReservations(items);
    }).catch((error: Error) => {
      if (!active) return;
      setReservationError(error.message);
      setStaffReservations(undefined);
    });
    return () => { active = false; };
  }, [reservationReload]);

  async function changeReservationStatus(id: string, status: string) {
    if (!hasSupabaseConfig) {
      update((current) => ({
        ...current,
        reservations: current.reservations.map((item) => item.id === id ? { ...item, status } : item),
      }));
      return;
    }
    setSavingReservation(true);
    try {
      await updateStaffReservation(id, status);
      setStaffReservations((items) => items?.map((item) => item.id === id ? { ...item, status } : item));
      setMessage("Status reservasi tersimpan.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setSavingReservation(false);
    }
  }

  async function signOut() {
    const { error } = await createClient().auth.signOut({ scope: "local" });
    if (error) return setMessage("Belum bisa keluar. Coba lagi.");
    setStaffReservations(null);
    setReservationReload((value) => value + 1);
    setMessage("Anda sudah keluar dari akun staf.");
  }
  function update(fn: Parameters<typeof updateRestaurant>[0]) {
    try {
      updateRestaurant(fn);
      setMessage("Perubahan demo tersimpan di browser ini.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }
  const active = state.orders.filter((order) => order.status !== "Dibatalkan");
  const revenue = active
    .filter((order) => order.status === "Selesai")
    .reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="container inner-page admin-page">
      <PageTitle
        label="PANEL STAF · DEMO"
        title="Dapur bergerak, meja terlayani."
        description="Simulasikan pengelolaan restoran dari satu tempat."
      />
      <Notice>
        {hasSupabaseConfig
          ? "Masuk sebagai staf untuk mengelola reservasi. Pesanan, menu, dan pengaturan lainnya masih simulasi di browser ini."
          : "Panel demo lokal. Data simulasi tersimpan di browser ini."}
      </Notice>
      {hasSupabaseConfig && Array.isArray(staffReservations) && (
        <button className="text-button" onClick={signOut}>Keluar dari akun staf</button>
      )}
      <nav className="admin-tabs" aria-label="Menu panel staf">
        {tabs.map((item) => (
          <button
            key={item}
            aria-pressed={tab === item}
            onClick={() => {
              setTab(item);
              setMessage("");
              setFilter("Semua");
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      <p role="status" className="feedback">
        {message}
      </p>
      {tab === "Ringkasan" && (
        <>
          <div className="admin-metrics">
            {[
              ["Pesanan masuk", state.orders.length],
              [
                "Dalam proses",
                active.filter((order) => order.status !== "Selesai").length,
              ],
              ["Penjualan selesai", money(revenue)],
              [
                "Reservasi menunggu",
                reservations.filter(
                  (item) => item.status === "Menunggu konfirmasi",
                ).length,
              ],
            ].map(([label, value]) => (
              <div className="panel" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="admin-overview">
            <section className="panel">
              <h2>Antrian dapur</h2>
              {active.filter((order) => order.status !== "Selesai").length ? (
                active
                  .filter((order) => order.status !== "Selesai")
                  .slice(0, 5)
                  .map((order) => (
                    <div className="admin-row" key={order.id}>
                      <div>
                        <strong>{order.id}</strong>
                        <p>
                          {order.name} ·{" "}
                          {order.table ? "Meja " + order.table : order.method}
                        </p>
                      </div>
                      <span className="status-tag">{order.status}</span>
                    </div>
                  ))
              ) : (
                <p className="muted">
                  Belum ada pesanan aktif. Buat pesanan simulasi dari menu untuk
                  mencoba alurnya.
                </p>
              )}
              <button className="text-button" onClick={() => setTab("Pesanan")}>
                Kelola semua pesanan →
              </button>
            </section>
            <section className="panel">
              <h2>Mulai simulasi</h2>
              <p>
                {hasSupabaseConfig
                  ? "Reservasi pelanggan muncul setelah staf masuk. Pesanan demo muncul di browser yang sama."
                  : "Data simulasi muncul di browser yang sama."}
              </p>
              <div className="quick-actions">
                <Link href="/menu">
                  Buka katalog menu <Icon name="arrow" />
                </Link>
                <Link href="/reservasi">
                  Buat reservasi <Icon name="arrow" />
                </Link>
                <Link href="/akun">
                  Lihat tampilan pelanggan <Icon name="arrow" />
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
      {tab === "Pesanan" && (
        <>
          <div className="filter-toolbar">
            <h2>Daftar pesanan ({state.orders.length})</h2>
            <label>
              Filter status
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                {[
                  "Semua",
                  "Menunggu konfirmasi",
                  "Diproses dapur",
                  "Siap disajikan",
                  "Selesai",
                  "Dibatalkan",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="record-list">
            {state.orders
              .filter((order) => filter === "Semua" || order.status === filter)
              .map((order) => (
                <article className="panel" key={order.id}>
                  <div className="record-heading">
                    <div>
                      <span className="record-code">{order.id}</span>
                      <h2>{order.name}</h2>
                      <p>
                        {order.phone} ·{" "}
                        {order.table ? "Meja " + order.table : order.method}
                      </p>
                    </div>
                    <strong>{money(order.total)}</strong>
                  </div>
                  <ul className="order-item-list">
                    {order.items.map((item) => (
                      <li key={item.key}>
                        {item.quantity}× {item.name}{" "}
                        <span className="muted">
                          ({item.variant}; {item.spice}
                          {item.extras.length
                            ? "; " + item.extras.join(", ")
                            : ""}
                          ){item.note ? " — " + item.note : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {order.note && <p>Catatan: {order.note}</p>}
                  <div className="record-bottom">
                    <Link href={"/pesanan/" + order.id} className="text-link">
                      Rincian pelanggan →
                    </Link>
                    <label className="status-select">
                      Status pesanan
                      <select
                        value={order.status}
                        onChange={(event) =>
                          update((current) => ({
                            ...current,
                            orders: current.orders.map((item) =>
                              item.id === order.id
                                ? { ...item, status: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      >
                        {[
                          "Menunggu konfirmasi",
                          "Diproses dapur",
                          "Siap disajikan",
                          "Selesai",
                          "Dibatalkan",
                        ].map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            {!state.orders.filter(
              (order) => filter === "Semua" || order.status === filter,
            ).length && (
              <div className="panel">
                <p>Tidak ada pesanan pada pilihan ini.</p>
              </div>
            )}
          </div>
        </>
      )}
      {tab === "Reservasi" && (
        <div className="record-list">
          <h2>Pengajuan reservasi</h2>
          {hasSupabaseConfig && (
            <div className="button-row">
              {staffReservations === null && <Link className="button" href="/admin/login">Masuk sebagai staf</Link>}
              {staffReservations === undefined && <p role="status">{reservationError || "Memuat reservasi…"}</p>}
              {staffReservations !== null && (
                <button className="text-button" onClick={() => setReservationReload((value) => value + 1)}>Muat ulang reservasi</button>
              )}
            </div>
          )}
          {reservations.map((reservation) => (
            <article className="panel" key={reservation.id}>
              <div className="record-heading">
                <div>
                  <span className="record-code">{reservation.id}</span>
                  <h2>{reservation.name}</h2>
                  <p>{reservation.phone}</p>
                </div>
                <span className="status-tag">{reservation.status}</span>
              </div>
              <p>
                {reservation.date} · {reservation.time} · {reservation.guests}{" "}
                tamu
              </p>
              <p>
                {reservation.area} ·{" "}
                {reservation.table
                  ? "Meja " + reservation.table
                  : "Diatur staf"}{" "}
                · {reservation.occasion}
              </p>
              {reservation.note && <p>Catatan: {reservation.note}</p>}
              <label className="status-select">
                Status reservasi
                <select
                  value={reservation.status}
                  disabled={savingReservation}
                  onChange={(event) => void changeReservationStatus(reservation.id, event.target.value)}
                >
                  {reservationStatuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </article>
          ))}
          {(!hasSupabaseConfig || Array.isArray(staffReservations)) && !reservations.length && (
            <p className="panel">Belum ada pengajuan reservasi.</p>
          )}
        </div>
      )}
      {tab === "Menu" && (
        <section>
          <h2>Ketersediaan menu</h2>
          <p className="muted">
            Perubahan ketersediaan langsung berlaku di katalog dan checkout
            demo.
          </p>
          <div className="admin-menu-list">
            {dishes.map((dish) => (
              <article className="panel admin-menu-item" key={dish.id}>
                <Photo image={dish.image} alt="Ilustrasi sajian" />
                <div>
                  <h3>{dish.name}</h3>
                  <p>
                    {money(dish.price)} · {dish.category}
                  </p>
                </div>
                <label className="availability-toggle">
                  <input
                    type="checkbox"
                    checked={
                      !dish.soldOut && !state.unavailable.includes(dish.id)
                    }
                    disabled={dish.soldOut}
                    onChange={(event) =>
                      update((current) => ({
                        ...current,
                        unavailable: event.target.checked
                          ? current.unavailable.filter((id) => id !== dish.id)
                          : [...current.unavailable, dish.id],
                      }))
                    }
                  />
                  {dish.soldOut ? "Habis pada data contoh" : "Tersedia"}
                </label>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === "Meja" && (
        <section className="panel">
          <h2>32 meja makan · simulasi</h2>
          <p className="muted">
            Status berdasarkan pesanan makan di tempat yang belum selesai pada
            perangkat ini. Denah reservasi adalah ilustrasi terpisah.
          </p>
          <div className="admin-table-grid">
            {Array.from({ length: 32 }, (_, index) => {
              const table = String(index + 1);
              const occupied = active.some(
                (order) => order.table === table && order.status !== "Selesai",
              );
              return (
                <div key={table} className={occupied ? "occupied" : ""}>
                  <Icon name="table" />
                  <strong>Meja {table}</strong>
                  <span>{occupied ? "Ada pesanan" : "Belum ada pesanan"}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {tab === "Laporan" && (
        <section className="panel">
          <h2>Ringkasan penjualan demo</h2>
          <p className="muted">
            Hanya pesanan berstatus Selesai yang dihitung sebagai penjualan
            selesai.
          </p>
          <div className="report-total">
            <span>Total penjualan selesai</span>
            <strong>{money(revenue)}</strong>
          </div>
          <div className="table-scroll">
            <table>
              <caption>Penjualan selesai berdasarkan menu</caption>
              <thead>
                <tr>
                  <th>Menu</th>
                  <th>Porsi</th>
                  <th>Nilai</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => {
                  const items = state.orders
                    .filter((order) => order.status === "Selesai")
                    .flatMap((order) => order.items)
                    .filter((item) => item.dishId === dish.id);
                  if (!items.length) return null;
                  return (
                    <tr key={dish.id}>
                      <td>{dish.name}</td>
                      <td>
                        {items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td>
                        {money(
                          items.reduce(
                            (sum, item) => sum + item.quantity * item.price,
                            0,
                          ),
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!revenue && <p>Belum ada penjualan selesai.</p>}
          <button
            className="button button-light no-print"
            onClick={() => window.print()}
          >
            Cetak laporan
          </button>
        </section>
      )}
      {tab === "Pengaturan" && (
        <form
          className="panel settings-form"
          key={JSON.stringify(state.settings)}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            update((current) => ({
              ...current,
              settings: {
                name: String(form.get("name")).trim(),
                phone: String(form.get("phone")).trim(),
                address: String(form.get("address")).trim(),
                hours: String(form.get("hours")).trim(),
              },
            }));
          }}
        >
          <h2>Informasi restoran demo</h2>
          <label className="field">
            Nama restoran
            <input
              name="name"
              required
              maxLength={80}
              defaultValue={state.settings.name}
            />
          </label>
          <label className="field">
            Nomor WhatsApp restoran
            <span className="field-hint">
              Isi nomor milik Anda, format 628...; kosong berarti belum aktif.
            </span>
            <input
              name="phone"
              type="tel"
              pattern="62[0-9]{9,13}"
              defaultValue={state.settings.phone}
            />
          </label>
          <label className="field">
            Alamat
            <input
              name="address"
              required
              maxLength={180}
              defaultValue={state.settings.address}
            />
          </label>
          <label className="field">
            Jam buka
            <input
              name="hours"
              required
              maxLength={40}
              defaultValue={state.settings.hours}
            />
          </label>
          <button className="button">
            Simpan pengaturan lokal <Icon name="check" />
          </button>
          <p className="field-hint">
            Logo dan nama merek pada desain masih Saji Rasa. Mengganti identitas
            global dilakukan di kode sebelum peluncuran.
          </p>
        </form>
      )}
    </div>
  );
}
