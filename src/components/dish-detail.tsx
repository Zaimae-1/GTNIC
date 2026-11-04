"use client";
import Link from "next/link";
import { useState } from "react";
import { type Dish, money } from "@/lib/restaurant";
import {
  addToCart,
  useRestaurant,
  updateRestaurant,
} from "@/lib/restaurant-store";
import { Icon, Photo } from "./ui";
export function DishDetail({ dish }: { dish: Dish }) {
  const state = useRestaurant();
  const [variant, setVariant] = useState(dish.variants[0]);
  const [spice, setSpice] = useState("Sedang");
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const extraOptions =
    dish.category === "Minuman"
      ? [{ name: "Tambahan lemon", price: 3000 }]
      : [
          { name: "Nasi putih", price: 6000 },
          { name: "Tahu & tempe", price: 8000 },
        ];
  const price =
    dish.price +
    (variant.includes("+") ? 6000 : 0) +
    extraOptions
      .filter((item) => extras.includes(item.name))
      .reduce((sum, item) => sum + item.price, 0);
  const soldOut = dish.soldOut || state.unavailable.includes(dish.id);
  const favorite = state.favorites.includes(dish.id);
  function add() {
    try {
      addToCart({
        key: JSON.stringify([
          dish.id,
          variant,
          spice,
          [...extras].sort(),
          note.trim(),
        ]),
        dishId: dish.id,
        name: dish.name,
        image: dish.image,
        variant,
        spice,
        extras,
        note: note.trim(),
        price,
        quantity,
      });
      setMessage("Berhasil ditambahkan ke keranjang.");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }
  return (
    <div className="container detail-page">
      <Link href="/menu" className="back-link">
        ← Kembali ke menu
      </Link>
      <div className="detail-grid">
        <div className="detail-visual">
          <Photo
            image={dish.image}
            alt={"Ilustrasi " + dish.category.toLowerCase()}
            priority
          />
          <span className="visual-caption">
            Rasa yang akrab.
            <br />
            <em>Dibuat sesuai selera Anda.</em>
          </span>
          <span className="photo-credit">Foto ilustrasi</span>
        </div>
        <div className="detail-copy">
          <div className="detail-top">
            <p className="eyebrow">{dish.category}</p>
            <button
              className={
                "icon-button favorite-button" + (favorite ? " is-favorite" : "")
              }
              aria-label={favorite ? "Hapus dari favorit" : "Simpan ke favorit"}
              aria-pressed={favorite}
              onClick={() => {
                try {
                  updateRestaurant((current) => ({
                    ...current,
                    favorites: favorite
                      ? current.favorites.filter((id) => id !== dish.id)
                      : [...current.favorites, dish.id],
                  }));
                } catch (error) {
                  setMessage((error as Error).message);
                }
              }}
            >
              <Icon name="heart" />
            </button>
          </div>
          <h1>{dish.name}</h1>
          <p className="detail-price">{money(dish.price)}</p>
          <p>{dish.description}</p>
          <fieldset>
            <legend>
              Pilih varian <span>Wajib · pilih satu</span>
            </legend>
            <div className="choice-grid">
              {dish.variants.map((item) => (
                <label className="choice" key={item}>
                  <input
                    type="radio"
                    name="variant"
                    checked={variant === item}
                    onChange={() => setVariant(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              {dish.category === "Minuman" ? "Tingkat manis" : "Level pedas"}
            </legend>
            <div className="choice-grid compact">
              {(dish.category === "Minuman"
                ? ["Tanpa gula", "Sedang", "Manis"]
                : ["Tidak pedas", "Sedang", "Pedas"]
              ).map((item) => (
                <label className="choice" key={item}>
                  <input
                    type="radio"
                    name="spice"
                    checked={spice === item}
                    onChange={() => setSpice(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              Biar makin lengkap <span>Opsional</span>
            </legend>
            {extraOptions.map((item) => (
              <label className="extra-choice" key={item.name}>
                <input
                  type="checkbox"
                  checked={extras.includes(item.name)}
                  onChange={() =>
                    setExtras((current) =>
                      current.includes(item.name)
                        ? current.filter((name) => name !== item.name)
                        : [...current, item.name],
                    )
                  }
                />
                <span>{item.name}</span>
                <strong>+{money(item.price)}</strong>
              </label>
            ))}
          </fieldset>
          <label className="field">
            Catatan untuk dapur{" "}
            <span className="field-hint">Opsional, maksimal 200 karakter</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: sambal dipisah"
              maxLength={200}
            />
          </label>
          <div className="add-row">
            <div className="quantity-control">
              <button
                aria-label="Kurangi jumlah"
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                −
              </button>
              <output aria-label="Jumlah porsi">{quantity}</output>
              <button
                aria-label="Tambah jumlah"
                disabled={quantity >= 99}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button className="button" disabled={soldOut} onClick={add}>
              {soldOut ? "Habis hari ini" : "Tambah ke keranjang"}
              <strong>{money(price * quantity)}</strong>
            </button>
          </div>
          <p role="status" className="feedback">
            {message}
          </p>
          {message.includes("Berhasil") && (
            <Link className="text-link" href="/cart">
              Lihat keranjang →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
