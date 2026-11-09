"use client";
import { useMemo, useSyncExternalStore } from "react";
export type CartItem = {
  key: string;
  dishId: string;
  name: string;
  image: string;
  variant: string;
  spice: string;
  extras: string[];
  note: string;
  price: number;
  quantity: number;
};
export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  method: string;
  table: string;
  payment: string;
  items: CartItem[];
  total: number;
  status: string;
  note: string;
};
export type Reservation = {
  id: string;
  trackingToken?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  area: string;
  table: string;
  occasion: string;
  note: string;
  status: string;
};
export type Settings = {
  name: string;
  phone: string;
  address: string;
  hours: string;
};
export type DemoState = {
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  favorites: string[];
  unavailable: string[];
  table: string;
  settings: Settings;
};
const defaults: DemoState = {
  cart: [],
  orders: [],
  reservations: [],
  favorites: [],
  unavailable: [],
  table: "",
  settings: {
    name: "Saji Rasa",
    phone: "",
    address: "Lokasi restoran belum ditentukan",
    hours: "10.00–21.00",
  },
};
const KEY = "sajirasa-demo-v1";
const event = "sajirasa-store";
function snapshot() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}
function parse(raw: string): DemoState {
  if (!raw) return defaults;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object") return defaults;
    return {
      ...defaults,
      cart: Array.isArray(value.cart)
        ? value.cart.filter(
            (item: CartItem) =>
              item &&
              typeof item.key === "string" &&
              typeof item.dishId === "string" &&
              typeof item.name === "string" &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              item.quantity <= 99 &&
              typeof item.price === "number" &&
              item.price >= 0 &&
              Array.isArray(item.extras),
          )
        : [],
      orders: Array.isArray(value.orders)
        ? value.orders.filter(
            (item: Order) =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              Array.isArray(item.items) &&
              typeof item.total === "number" &&
              typeof item.createdAt === "string",
          )
        : [],
      reservations: Array.isArray(value.reservations)
        ? value.reservations.filter(
            (item: Reservation) =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.date === "string" &&
              typeof item.time === "string" &&
              typeof item.guests === "number",
          )
        : [],
      favorites: Array.isArray(value.favorites)
        ? value.favorites.filter((id: unknown) => typeof id === "string")
        : [],
      unavailable: Array.isArray(value.unavailable)
        ? value.unavailable.filter((id: unknown) => typeof id === "string")
        : [],
      table: typeof value.table === "string" ? value.table : "",
      settings: {
        name:
          typeof value.settings?.name === "string"
            ? value.settings.name
            : defaults.settings.name,
        phone:
          typeof value.settings?.phone === "string" ? value.settings.phone : "",
        address:
          typeof value.settings?.address === "string"
            ? value.settings.address
            : defaults.settings.address,
        hours:
          typeof value.settings?.hours === "string"
            ? value.settings.hours
            : defaults.settings.hours,
      },
    };
  } catch {
    return defaults;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}
export function useRestaurant() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  return useMemo(() => parse(raw), [raw]);
}
export function updateRestaurant(update: (state: DemoState) => DemoState) {
  const next = update(parse(snapshot()));
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(event));
  } catch {
    throw new Error(
      "Penyimpanan browser tidak tersedia atau penuh. Izinkan penyimpanan situs lalu coba lagi.",
    );
  }
}
export function addToCart(item: CartItem) {
  updateRestaurant((state) => {
    const existing = state.cart.find((entry) => entry.key === item.key);
    return {
      ...state,
      cart: existing
        ? state.cart.map((entry) =>
            entry.key === item.key
              ? {
                  ...entry,
                  quantity: Math.min(99, entry.quantity + item.quantity),
                }
              : entry,
          )
        : [...state.cart, item],
    };
  });
}
export function makeId(prefix: string) {
  return prefix + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();
}
