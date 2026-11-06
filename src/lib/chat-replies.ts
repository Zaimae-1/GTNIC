import { dishes, money } from "./restaurant";
import type { DemoState } from "./restaurant-store";

export type ChatReply = {
  text: string;
  actions?: { label: string; href: string }[];
  dishId?: string;
  category?: string;
};

export function restaurantReply(
  question: string,
  state: DemoState,
  previous?: ChatReply,
): ChatReply {
  const query = question
    .toLowerCase()
    .trim()
    .replace(/\bpedes\b/g, "pedas");
  const available = dishes.filter(
    (dish) => !dish.soldOut && !state.unavailable.includes(dish.id),
  );
  const menuAction = [{ label: "Lihat menu", href: "/menu" }];
  if (/alergi|alergy|allerg|gluten|halal|vegan|pantangan/.test(query))
    return {
      text: "Boleh, kita cek dulu ya. Aku belum punya rincian bahan dan sertifikasi yang lengkap, jadi belum bisa memastikan menu mana yang cocok. Untuk alergi atau pantangan, konfirmasi langsung ke staf sebelum memesan ya.",
      actions: [{ label: "Lihat informasi restoran", href: "/#lokasi" }],
    };
  if (/status|pesanan saya|udah pesan|sudah pesan|riwayat/.test(query))
    return {
      text: "Sudah pesan, ya? Kamu bisa cek rinciannya di halaman Pesanan & Reservasi Saya. Untuk sekarang, yang tampil adalah pesanan demo dari browser ini, belum pesanan yang masuk ke dapur sungguhan.",
      actions: [{ label: "Cek pesanan saya", href: "/akun" }],
    };
  if (/bayar|qris|transfer|tunai|cash/.test(query))
    return {
      text: "Bisa pilih tunai, QRIS di kasir, atau transfer saat checkout. Tapi di versi demo ini kita baru mencatat pilihannya ya, belum menerima atau memverifikasi pembayaran. Kamu belum dikenai biaya apa pun.",
      actions: [{ label: "Lihat keranjang", href: "/cart" }],
    };
  if (/reserv|meja|booking/.test(query))
    return {
      text: "Boleh banget! Mau datang kapan dan berapa orang? Di halaman Reservasi, kamu bisa pilih jadwal, area, dan meja yang disukai. Pengajuan di sini masih simulasi; untuk kunjungan sungguhan, mejanya perlu dikonfirmasi staf dulu ya.",
      actions: [{ label: "Rencanakan kunjungan", href: "/reservasi" }],
    };
  if (/jam|buka|tutup/.test(query))
    return {
      text:
        "Di sini jadwalnya tercantum pukul " +
        state.settings.hours +
        " setiap hari. Jadwal ini masih contoh ya, jadi pastikan lagi ke restoran sebelum berangkat. Lagi mau sekadar lihat menu atau rencanakan kunjungan?",
      actions: [
        { label: "Lihat menu", href: "/menu" },
        { label: "Reservasi", href: "/reservasi" },
      ],
    };
  if (/lokasi|alamat|maps|di mana|dimana/.test(query))
    return {
      text:
        state.settings.address === "Lokasi restoran belum ditentukan"
          ? "Alamat resminya belum dicantumkan, nih. Aku belum bisa kasih titik lokasi yang pasti. Nanti setelah informasinya tersedia, kamu bisa lihat di bagian Lokasi ya."
          : "Alamat yang tercantum: " +
            state.settings.address +
            ". Detail ini berasal dari pengaturan demo, jadi konfirmasi lagi sebelum berangkat ya.",
      actions: [{ label: "Informasi lokasi", href: "/#lokasi" }],
    };
  if (
    /^(hai|halo|hello|hi|pagi|siang|sore|malam|assalamualaikum)[!.,\s]*$/.test(
      query,
    )
  )
    return {
      text: "Hai, senang kamu mampir! Aku Teman Saji. Lagi ingin makanan hangat, yang segar-segar, atau menu buat makan bareng? Cerita saja, aku bantu pilihkan.",
      actions: menuAction,
    };
  if (
    /^(makasih|terima kasih|thanks|thank you|oke|ok|sip|siap|mantap|iya|ya)[!.,\s]*$/.test(
      query,
    )
  )
    return {
      text: /makasih|terima kasih|thank/.test(query)
        ? "Sama-sama! Semoga ketemu menu yang pas ya. Kalau masih bingung pilih lauk atau minuman, bilang saja, aku bantu lagi."
        : "Siap! Kalau mau lihat detail atau lanjut pilih menu, tinggal buka tombol di bawah ya.",
      actions: previous?.actions || menuAction,
      dishId: previous?.dishId,
      category: previous?.category,
    };
  const named = available.find((dish) =>
    query.includes(dish.name.toLowerCase()),
  );
  const last = available.find((dish) => dish.id === previous?.dishId);
  if (
    named ||
    (/harga|berapa/.test(query) &&
      last &&
      !/murah|hemat|budget|bujet/.test(query))
  ) {
    const dish = named || last!;
    return {
      text:
        dish.name +
        " mulai " +
        money(dish.price) +
        (dish.category === "Paket Bersama"
          ? " per paket, ya. "
          : dish.category === "Minuman"
            ? " per gelas, ya. "
            : " per porsi, ya. ") +
        dish.description +
        " Harga akhirnya mengikuti varian dan tambahan yang kamu pilih. Mau lihat pilihannya?",
      actions: [{ label: "Lihat " + dish.name, href: "/menu/" + dish.id }],
      dishId: dish.id,
      category: dish.category,
    };
  }
  if (
    /cara pesan|cara order|keranjang|checkout|mau pesan|mau order/.test(query)
  )
    return {
      text: "Bisa, aku bantu arahin ya. Pilih menunya dulu, atur varian dan jumlah, lalu tambahkan ke keranjang. Setelah itu lengkapi nama dan cara menikmati pesanan. Ingat, checkout di sini masih simulasi dan belum mengirim pesanan ke restoran.",
      actions: [
        { label: "Pilih menu", href: "/menu" },
        { label: "Buka keranjang", href: "/cart" },
      ],
    };
  if (
    /menu|rekomend|makan|lapar|ayam|ikan|murah|hemat|harga|budget|bujet|minum|haus|segar|nasi|kuah|soto|pedas|keluarga|orang|lain|lagi|\d+\s*(?:rb|ribu|k)\b/.test(
      query,
    )
  ) {
    const category = /minum|haus/.test(query)
      ? "Minuman"
      : /keluarga|orang|rame|berempat|berdua/.test(query)
        ? "Paket Bersama"
        : /kuah|soto/.test(query)
          ? "Kuah & Sayur"
          : /nasi/.test(query)
            ? "Nasi & Mi"
            : /lain|lagi|murah|hemat/.test(query)
              ? previous?.category
              : undefined;
    let choices = available.filter(
      (dish) =>
        (!category || dish.category === category) &&
        (!/lain|lagi/.test(query) || dish.id !== previous?.dishId),
    );
    if (!category && /makan|lapar/.test(query))
      choices = choices.filter((dish) => dish.category !== "Minuman");
    if (/ayam/.test(query))
      choices = choices.filter((dish) => dish.name.includes("Ayam"));
    if (/ikan/.test(query))
      choices = choices.filter(
        (dish) => dish.name.includes("Gurame") || dish.name.includes("Ikan"),
      );
    const budget = query.match(/(\d+)\s*(?:rb|ribu|k)\b/);
    if (budget)
      choices = choices.filter(
        (dish) => dish.price <= Number(budget[1]) * 1000,
      );
    if (/murah|hemat|budget|bujet/.test(query) || budget)
      choices.sort((a, b) => a.price - b.price);
    if (!choices.length)
      return {
        text: "Untuk pilihan itu, aku belum menemukan menu yang tersedia. Mau coba kategori lain atau ubah kisaran harganya? Kita cari yang paling mendekati selera kamu.",
        actions: menuAction,
      };
    const selected = choices.slice(0, 2);
    const introduction = /lain|lagi/.test(query)
      ? "Ada pilihan lain, nih. "
      : /murah|hemat|budget|bujet/.test(query) || budget
        ? "Bisa, kita cari yang lebih hemat ya. "
        : category === "Minuman"
          ? "Kalau lagi haus, ini yang bisa kamu lirik. "
          : "Boleh! Aku punya beberapa pilihan buat kamu. ";
    return {
      text:
        introduction +
        selected
          .map((dish) => dish.name + " (" + money(dish.price) + ")")
          .join(" atau ") +
        ". " +
        (/pedas/.test(query)
          ? "Di detail makanan, kamu bisa memilih level pedas. Untuk permintaan khusus, tulis catatan juga ya."
          : "Lebih tertarik yang mana? Kalau mau tahu harganya lebih lanjut, tinggal tanya saja."),
      actions: selected.map((dish) => ({
        label: dish.name,
        href: "/menu/" + dish.id,
      })),
      dishId: selected[0].id,
      category: selected[0].category,
    };
  }
  return {
    text: "Aku belum menangkap maksudnya, nih. Mau ceritakan sedikit lagi? Aku bisa bantu pilih menu, cek harga, jelaskan cara pesan, atau arahkan reservasi.",
    actions: menuAction,
  };
}
