export type Dish = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  favorite?: boolean;
  soldOut?: boolean;
  variants: string[];
};
export const categories = [
  "Semua",
  "Favorit",
  "Ayam & Ikan",
  "Nasi & Mi",
  "Kuah & Sayur",
  "Minuman",
  "Paket Bersama",
];
export const dishes: Dish[] = [
  {
    id: "ayam-bakar",
    name: "Ayam Bakar Rempah",
    category: "Ayam & Ikan",
    price: 34000,
    description:
      "Ayam berbumbu rempah, dibakar perlahan. Lengkap dengan sambal dan lalapan segar.",
    image: "ayam.webp",
    badge: "Andalan dapur",
    favorite: true,
    variants: ["Paha", "Dada"],
  },
  {
    id: "gurame",
    name: "Gurame Bakar Kecap",
    category: "Ayam & Ikan",
    price: 72000,
    description:
      "Gurame utuh dengan olesan kecap manis dan bumbu yang meresap hingga ke dalam.",
    image: "fish.webp",
    badge: "Untuk berbagi",
    favorite: true,
    variants: ["Bakar kecap", "Bumbu rujak"],
  },
  {
    id: "nasi-goreng",
    name: "Nasi Goreng Kampung",
    category: "Nasi & Mi",
    price: 29000,
    description:
      "Nasi goreng dengan bumbu rumahan, ayam suwir, telur, dan kerupuk.",
    image: "rice",
    badge: "Paling akrab",
    favorite: true,
    variants: ["Telur mata sapi", "Telur dadar"],
  },
  {
    id: "soto",
    name: "Soto Ayam Kuning",
    category: "Kuah & Sayur",
    price: 27000,
    description:
      "Kuah rempah hangat, ayam suwir, soun, dan perasan jeruk nipis.",
    image: "soup",
    favorite: true,
    variants: ["Tanpa nasi", "Dengan nasi (+Rp6.000)"],
  },
  {
    id: "ayam-goreng",
    name: "Ayam Goreng Lengkuas",
    category: "Ayam & Ikan",
    price: 32000,
    description:
      "Ayam goreng gurih dengan taburan lengkuas renyah dan sambal dadak.",
    image: "chicken-fried.webp",
    variants: ["Paha", "Dada"],
  },
  {
    id: "ikan-sambal",
    name: "Ikan Goreng Sambal",
    category: "Ayam & Ikan",
    price: 65000,
    description: "Ikan goreng renyah dengan sambal terasi dan lalapan.",
    image: "fish.webp",
    variants: ["Sambal terasi", "Sambal kecap"],
  },
  {
    id: "mi-goreng",
    name: "Mi Goreng Jawa",
    category: "Nasi & Mi",
    price: 28000,
    description:
      "Mi dengan sayur segar, ayam, dan telur. Aroma manis gurih yang familiar.",
    image: "rice",
    variants: ["Mi goreng", "Mi nyemek"],
  },
  {
    id: "nasi-timbel",
    name: "Nasi Timbel Komplit",
    category: "Nasi & Mi",
    price: 39000,
    description:
      "Nasi hangat, ayam, tahu, tempe, sambal, dan lalapan dalam satu sajian.",
    image: "rice",
    badge: "Lengkap",
    variants: ["Ayam bakar", "Ayam goreng"],
  },
  {
    id: "sayur-asem",
    name: "Sayur Asem Segar",
    category: "Kuah & Sayur",
    price: 18000,
    description:
      "Kuah asam segar dengan jagung dan aneka sayuran, teman makan yang pas.",
    image: "vegetable.webp",
    variants: ["Porsi biasa", "Porsi berbagi (+Rp6.000)"],
  },
  {
    id: "capcay",
    name: "Capcay Kuah",
    category: "Kuah & Sayur",
    price: 26000,
    description: "Aneka sayur dalam kuah gurih yang ringan dan hangat.",
    image: "soup",
    soldOut: true,
    variants: ["Kuah", "Goreng"],
  },
  {
    id: "teh",
    name: "Es Teh Melati",
    category: "Minuman",
    price: 8000,
    description: "Teh melati harum, diseduh segar untuk menemani sajian Anda.",
    image: "drink",
    variants: ["Dingin", "Hangat"],
  },
  {
    id: "jeruk",
    name: "Jeruk Peras Segar",
    category: "Minuman",
    price: 14000,
    description: "Perasan jeruk dengan rasa manis-asam alami yang menyegarkan.",
    image: "juice.webp",
    variants: ["Dingin", "Hangat"],
  },
  {
    id: "lemon",
    name: "Lemon Tea",
    category: "Minuman",
    price: 15000,
    description: "Teh dengan irisan lemon segar. Ringan dan menyegarkan.",
    image: "drink",
    badge: "Segar",
    variants: ["Dingin", "Hangat"],
  },
  {
    id: "paket-dua",
    name: "Paket Teman Berdua",
    category: "Paket Bersama",
    price: 89000,
    description:
      "Dua ayam bakar, dua nasi putih, tahu tempe, sambal, dan dua es teh.",
    image: "table",
    badge: "Untuk 2 orang",
    variants: ["Ayam bakar", "Ayam goreng"],
  },
  {
    id: "paket-empat",
    name: "Paket Meja Keluarga",
    category: "Paket Bersama",
    price: 169000,
    description:
      "Empat ayam bakar, empat nasi, sayur asem, lalapan, dan empat es teh.",
    image: "table",
    favorite: true,
    badge: "Untuk 4 orang",
    variants: ["Ayam bakar", "Campur bakar & goreng"],
  },
  {
    id: "paket-enam",
    name: "Paket Kumpul Hangat",
    category: "Paket Bersama",
    price: 299000,
    description:
      "Gurame bakar, empat ayam, enam nasi, sayur, tahu tempe, dan enam es teh.",
    image: "table",
    badge: "Untuk 6 orang",
    variants: ["Gurame kecap", "Gurame rujak"],
  },
];
export const areas = [
  {
    name: "Ruang keluarga",
    description: "Sejuk, nyaman, dan bebas asap rokok.",
    capacity: 4,
    image: "restaurant",
  },
  {
    name: "Teras taman",
    description: "Udara terbuka untuk obrolan yang lebih santai.",
    capacity: 6,
    image: "table",
  },
  {
    name: "Ruang privat",
    description: "Sudut tenang untuk momen istimewa bersama.",
    capacity: 8,
    image: "restaurant",
  },
  {
    name: "Lesehan",
    description: "Duduk santai, nikmati suasana yang akrab.",
    capacity: 6,
    image: "table",
  },
];
export const money = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
export const localDate = () => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};
