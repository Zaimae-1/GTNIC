"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { dishes, money } from "@/lib/restaurant";
import {
  makeId,
  updateRestaurant,
  useRestaurant,
} from "@/lib/restaurant-store";
import { EmptyState, Icon, Notice, PageTitle, Photo } from "./ui";
export function CartView() {
  const state = useRestaurant();
  const router = useRouter();
  const submitting = useRef(false);
  const [method, setMethod] = useState("Makan di tempat");
  const [payment, setPayment] = useState("Tunai di kasir");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  function quantity(key: string, amount: number) {
    try {
      updateRestaurant((current) => ({
        ...current,
        cart: current.cart
          .map((item) =>
            item.key === key ? { ...item, quantity: amount } : item,
          )
          .filter((item) => item.quantity > 0),
      }));
    } catch (err) {
      setError((err as Error).message);
    }
  }
  function checkout(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").replace(/[\s-]/g, "");
    const table = String(form.get("table") || "");
    if (!name || !/^(?:\+62|62|0)8\d{7,12}$/.test(phone)) {
      setError("Isi nama dan nomor WhatsApp Indonesia yang valid.");
      return;
    }
    if (method === "Makan di tempat" && !table) {
      setError("Pilih nomor meja untuk makan di tempat.");
      return;
    }
    if (
      state.cart.some(
        (item) =>
          state.unavailable.includes(item.dishId) ||
          dishes.find((dish) => dish.id === item.dishId)?.soldOut,
      )
    ) {
      setError(
        "Ada menu yang sedang habis. Hapus menu tersebut sebelum melanjutkan.",
      );
      return;
    }
    if (!state.cart.length) {
      setError("Keranjang masih kosong.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const id = makeId("SR");
      updateRestaurant((current) => ({
        ...current,
        cart: [],
        orders: [
          {
            id,
            createdAt: new Date().toISOString(),
            name,
            phone,
            method,
            table: method === "Makan di tempat" ? table : "",
            payment,
            items: current.cart,
            total: current.cart.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            ),
            status: "Menunggu konfirmasi",
            note: String(form.get("note") || "").trim(),
          },
          ...current.orders,
        ],
      }));
      router.push("/pesanan/" + id);
    } catch (err) {
      submitting.current = false;
      setBusy(false);
      setError((err as Error).message);
    }
  }
  return (
    <div className="container inner-page">
      <PageTitle
        label="SEDIKIT LAGI, SIAP DINIKMATI"
        title="Pilihan di meja Anda."
        description="Periksa pesanan, lalu lengkapi informasi Anda."
      />
      {!state.cart.length ? (
        <EmptyState
          title="Keranjangnya masih kosong."
          description="Ada banyak rasa yang menunggu. Mulai dengan menu favorit Anda."
          href="/menu"
          label="Lihat menu"
        />
      ) : (
        <div className="checkout-grid">
          <div>
            <div className="cart-list">
              {state.cart.map((item) => (
                <article className="cart-item" key={item.key}>
                  <Photo image={item.image} alt="Ilustrasi sajian" />
                  <div className="cart-item-info">
                    <h2>{item.name}</h2>
                    <p>
                      {item.variant} · {item.spice}
                      {item.extras.length ? " · " + item.extras.join(", ") : ""}
                    </p>
                    {item.note && <p className="muted">Catatan: {item.note}</p>}
                    <div className="cart-item-bottom">
                      <strong>{money(item.price * item.quantity)}</strong>
                      <div className="quantity-control">
                        <button
                          aria-label={"Kurangi " + item.name}
                          onClick={() => quantity(item.key, item.quantity - 1)}
                        >
                          −
                        </button>
                        <output aria-label={"Jumlah " + item.name}>
                          {item.quantity}
                        </output>
                        <button
                          aria-label={"Tambah " + item.name}
                          disabled={item.quantity >= 99}
                          onClick={() => quantity(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-button danger"
                        onClick={() => quantity(item.key, 0)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/menu" className="text-link">
              + Tambah menu lain
            </Link>
            <Notice>
              Pesanan ini adalah simulasi lokal. Tidak dikirim ke dapur dan
              tidak memproses pembayaran.
            </Notice>
          </div>
          <form className="panel checkout-form" onSubmit={checkout}>
            <h2>Lengkapi pesanan</h2>
            <fieldset>
              <legend>Cara menikmati</legend>
              <div className="choice-grid">
                {["Makan di tempat", "Bawa pulang"].map((item) => (
                  <label key={item} className="choice">
                    <input
                      type="radio"
                      name="method"
                      checked={method === item}
                      onChange={() => setMethod(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="field">
              Nama pemesan
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="Nama Anda"
              />
            </label>
            <label className="field">
              Nomor WhatsApp
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="08xxxxxxxxxx"
                maxLength={18}
              />
            </label>
            {method === "Makan di tempat" && (
              <label className="field">
                Nomor meja
                <select name="table" defaultValue={state.table} required>
                  <option value="">Pilih meja</option>
                  {Array.from({ length: 32 }, (_, index) => (
                    <option key={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              Metode pembayaran
              <select
                value={payment}
                onChange={(event) => setPayment(event.target.value)}
              >
                <option>Tunai di kasir</option>
                <option>QRIS di kasir</option>
                <option>Transfer — konfirmasi kasir</option>
              </select>
              <span className="field-hint">
                Pilihan metode saja. Belum ada pembayaran otomatis.
              </span>
            </label>
            <label className="field">
              Catatan tambahan <span className="field-hint">Opsional</span>
              <textarea
                name="note"
                maxLength={300}
                placeholder="Ada yang perlu kami tahu?"
              />
            </label>
            <dl className="summary-lines">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div>
                <dt>Biaya tambahan demo</dt>
                <dd>Rp0</dd>
              </div>
              <div className="summary-total">
                <dt>Total</dt>
                <dd>{money(subtotal)}</dd>
              </div>
            </dl>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button className="button full-width" disabled={busy}>
              {busy ? "Menyimpan..." : "Buat pesanan simulasi"}
              <Icon name="arrow" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
