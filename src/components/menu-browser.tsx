"use client";
import { useState } from "react";
import { dishes, categories } from "@/lib/restaurant";
import { updateRestaurant, useRestaurant } from "@/lib/restaurant-store";
import { Icon, MenuCard, Photo } from "./ui";
export function MenuBrowser() {
  const state = useRestaurant();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState("recommended");
  const [table, setTable] = useState(state.table);
  const [tableOpen, setTableOpen] = useState(false);
  const [error, setError] = useState("");
  const filtered = dishes
    .filter(
      (dish) =>
        (category === "Semua" ||
          (category === "Favorit"
            ? dish.favorite || state.favorites.includes(dish.id)
            : dish.category === category)) &&
        (dish.name + " " + dish.description)
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  return (
    <>
      <section className="menu-cover">
        <Photo image="restaurant" alt="Ilustrasi ruang makan restoran" priority />
        <div className="container menu-cover-content">
          <p className="eyebrow">DARI DAPUR, DENGAN SEPENUH HATI</p>
          <h1>Temukan selera Anda.</h1>
          <p>Masakan Nusantara, untuk semua yang duduk di meja kita.</p>
        </div>
      </section>
      <div className="container menu-page">
        <div className="restaurant-strip">
          <div>
            <span className="small-brand">SR</span>
            <div>
              <h2>{state.settings.name}</h2>
              <p>
                <Icon name="clock" /> Setiap hari {state.settings.hours}{" "}
                <span>· Masakan Indonesia</span>
              </p>
            </div>
          </div>
          <span className="outline-tag">Dimasak saat dipesan</span>
        </div>
        <div className="table-picker">
          <Icon name="table" />
          <div>
            <strong>
              {state.table ? "Meja " + state.table : "Makan di tempat?"}
            </strong>
            <p>
              {state.table
                ? "Nomor meja akan disertakan pada pesanan."
                : "Pilih nomor meja atau lanjutkan untuk dibawa pulang."}
            </p>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setTableOpen(!tableOpen);
              setTable(state.table);
            }}
          >
            {state.table ? "Ubah meja" : "Pilih meja"}
          </button>
        </div>
        {tableOpen && (
          <form
            className="inline-form panel"
            onSubmit={(event) => {
              event.preventDefault();
              try {
                updateRestaurant((current) => ({ ...current, table }));
                setTableOpen(false);
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            <label>
              Nomor meja
              <select
                value={table}
                onChange={(event) => setTable(event.target.value)}
              >
                <option value="">Belum memilih</option>
                {Array.from({ length: 32 }, (_, index) => (
                  <option key={index + 1} value={String(index + 1)}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>
            <button className="button">Simpan meja</button>
          </form>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="search-toolbar">
          <div className="search-field">
            <Icon name="search" />
            <label className="sr-only" htmlFor="menu-search">
              Cari nama menu
            </label>
            <input
              id="menu-search"
              placeholder="Lagi ingin makan apa?"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <label className="sort-label">
            <span className="sr-only">Urutkan menu</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recommended">Pilihan dapur</option>
              <option value="low">Harga terendah</option>
              <option value="high">Harga tertinggi</option>
            </select>
          </label>
        </div>
        <nav className="category-tabs" aria-label="Kategori menu">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item === "Favorit" && <Icon name="star" />}
              {item}
            </button>
          ))}
        </nav>
        <div className="result-heading">
          <h2>
            {category === "Semua" ? "Satu menu, banyak cerita." : category}
          </h2>
          <span aria-live="polite">{filtered.length} pilihan menu</span>
        </div>
        {filtered.length ? (
          <div className="menu-grid">
            {filtered.map((dish) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                unavailable={state.unavailable.includes(dish.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Menu belum ditemukan</h2>
            <p>Coba kata lain atau lihat semua kategori.</p>
            <button
              className="button"
              onClick={() => {
                setSearch("");
                setCategory("Semua");
              }}
            >
              Tampilkan semua menu
            </button>
          </div>
        )}
        <p className="image-note">
          Foto merupakan ilustrasi. Harga dan menu adalah data contoh untuk
          prototipe.
        </p>
      </div>
    </>
  );
}
