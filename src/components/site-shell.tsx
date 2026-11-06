"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Brand, Icon } from "./ui";
import { useRestaurant } from "@/lib/restaurant-store";
import { restaurantReply, type ChatReply } from "@/lib/chat-replies";
import { MotionEffects } from "./motion-effects";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu Kami" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/#cerita", label: "Cerita Kami" },
];
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useRestaurant();
  const [open, setOpen] = useState(false);
  const total = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function outside(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node))
        setOpen(false);
    }
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Lewati ke konten utama
      </a>
      <div className="announcement">
        <span>Rasa Nusantara. Cerita di setiap meja.</span>
        <span>
          <Icon name="clock" /> Setiap hari · {state.settings.hours}
        </span>
      </div>
      <header className="site-header" ref={navRef}>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navigasi utama">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              href="/cart"
              className="cart-link"
              aria-label={"Keranjang, " + total + " item"}
            >
              <Icon name="bag" />
              <span className="cart-count" key={total}>
                {total}
              </span>
            </Link>
            <Link
              href="/akun"
              className="account-link"
              aria-label="Akun dan pesanan"
            >
              <Icon name="user" />
            </Link>
            <Link href="/menu" className="button button-small header-order">
              Pesan sekarang <Icon name="arrow" />
            </Link>
            <button
              className="mobile-toggle icon-button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
        <nav
          id="mobile-menu"
          className={"mobile-menu" + (open ? " is-open" : "")}
          aria-hidden={!open}
          inert={!open}
          aria-label="Navigasi ponsel"
        >
          {[
            ...links,
            { href: "/cart", label: "Keranjang" },
            { href: "/akun", label: "Akun & pesanan" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <MotionEffects />
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Masakan yang akrab di lidah.
              <br />
              Tempat untuk kembali bersama.
            </p>
            <span className="footer-note">
              Prototipe restoran • konten ilustrasi
            </span>
          </div>
          <div>
            <h2>Jelajahi</h2>
            <Link href="/menu">Menu restoran</Link>
            <Link href="/reservasi">Reservasi meja</Link>
            <Link href="/akun">Pesanan & reservasi saya</Link>
            <Link href="/#cerita">Cerita kami</Link>
          </div>
          <div>
            <h2>Mampir ke sini</h2>
            <p>{state.settings.address}</p>
            <p>
              Setiap hari, {state.settings.hours}
              <br />
              Pesanan terakhir 20.30
            </p>
            <Link href="/#lokasi">Lihat informasi lokasi →</Link>
            {state.settings.phone ? (
              <a
                href={
                  "https://wa.me/" + state.settings.phone.replace(/\D/g, "")
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi via WhatsApp ↗
              </a>
            ) : (
              <p className="footer-note">Nomor WhatsApp resmi belum diatur.</p>
            )}
            {state.settings.address !== "Lokasi restoran belum ditentukan" && (
              <a
                href={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(state.settings.address)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Cari alamat di Google Maps ↗
              </a>
            )}
          </div>
          <div>
            <h2>Meja untuk semua</h2>
            <p>
              Keluarga, teman lama, atau waktu untuk diri sendiri. Selalu ada
              tempat untuk Anda.
            </p>
            <Link href="/admin">Panel staf · demo lokal →</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Saji Rasa</span>
          <span>Dibuat untuk momen yang lebih dekat.</span>
        </div>
      </footer>
      <RestaurantChat />
    </>
  );
}

function RestaurantChat() {
  const state = useRestaurant();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<(ChatReply & { role: string })[]>(
    [],
  );
  const body = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!open || !body.current) return;
    body.current.scrollTo({
      top: body.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [messages, open]);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector("button")?.focus({ preventScroll: true });
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus({ preventScroll: true });
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  function reply(text: string) {
    const previous = messages
      .filter((message) => message.role === "assistant")
      .at(-1);
    const answer = restaurantReply(text, state, previous);
    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", ...answer },
    ]);
    setQuestion("");
  }
  return (
    <div className="chat-widget">
      <section
        ref={panel}
        className={"chat-panel" + (open ? " is-open" : "")}
        aria-label="Bantuan restoran"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="chat-heading">
          <div>
            <span>
              <Icon name="chat" /> Teman Saji
            </span>
            <small>Asisten otomatis · menu demo</small>
          </div>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Tutup bantuan"
          >
            <Icon name="close" />
          </button>
        </div>
        <div
          ref={body}
          className="chat-body"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          <p className="chat-message">
            Hai, selamat datang! Aku Teman Saji. Lagi ingin makan apa? Boleh
            cerita selera atau kisaran harganya, nanti aku bantu pilihkan.
          </p>
          {messages.map((message, index) => (
            <div className="chat-entry" key={index}>
              <p
                className={
                  "chat-message " + (message.role === "user" ? "chat-user" : "")
                }
              >
                {message.text}
              </p>
              {message.actions && (
                <div className="chat-reply-actions">
                  {message.actions.map((action) => (
                    <Link key={action.href} href={action.href} onClick={close}>
                      {action.label}
                      <Icon name="arrow" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-topics">
          {["Rekomendasi menu", "Reservasi meja", "Jam buka"].map((topic) => (
            <button key={topic} onClick={() => reply(topic)}>
              {topic}
            </button>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            if (question.trim()) reply(question.trim());
          }}
        >
          <label className="sr-only" htmlFor="chat-question">
            Pertanyaan Anda
          </label>
          <input
            id="chat-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Tulis pertanyaan..."
            maxLength={300}
          />
          <button
            className="icon-button"
            aria-label="Kirim pertanyaan"
            disabled={!question.trim()}
          >
            <Icon name="arrow" />
          </button>
        </form>
      </section>
      <button
        className="chat-launcher"
        ref={launcher}
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? "Tutup bantuan" : "Buka bantuan restoran"}
      >
        <Icon name={open ? "close" : "chat"} />
        <span>{open ? "Tutup" : "Butuh bantuan?"}</span>
      </button>
    </div>
  );
}
