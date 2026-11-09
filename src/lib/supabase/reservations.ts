import type { Reservation } from "@/lib/restaurant-store";
import { createClient } from "./client";

export const reservationStatuses = [
  "Menunggu konfirmasi",
  "Dikonfirmasi",
  "Selesai",
  "Ditolak",
  "Dibatalkan",
] as const;

export async function submitReservation(reservation: Reservation) {
  const { data, error } = await createClient().rpc("saji_submit_reservation", {
    p_token: reservation.trackingToken,
    p_id: reservation.id,
    p_name: reservation.name,
    p_phone: reservation.phone,
    p_date: reservation.date,
    p_time: reservation.time,
    p_guests: reservation.guests,
    p_area: reservation.area,
    p_table: reservation.table,
    p_occasion: reservation.occasion,
    p_note: reservation.note,
  });
  if (error?.code === "23P01") {
    throw new Error("Meja sudah dipesan pada waktu tersebut. Pilih meja atau jam lain.");
  }
  if (error?.code === "22023") {
    throw new Error("Pilih tanggal dan jam kunjungan yang belum lewat (WIB).");
  }
  if (error || typeof data !== "string") {
    throw new Error("Reservasi belum dapat dikonfirmasi. Coba kirim lagi.");
  }
  return data;
}

export async function getReservationStatus(trackingToken: string, cancel = false) {
  const { data, error } = await createClient().rpc("saji_reservation_status", {
    p_token: trackingToken,
    p_cancel: cancel,
  });
  if (error || typeof data !== "string") {
    throw new Error("Status reservasi belum bisa diperbarui. Coba lagi.");
  }
  return data;
}

export async function getStaffReservations() {
  const client = createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return null;
  const { data: staff, error: staffError } = await client
    .from("saji_reservation_staff")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (staffError) throw new Error("Akses staf belum bisa diperiksa. Coba lagi.");
  if (!staff) return null;
  const { data, error } = await client
    .from("saji_reservations")
    .select("id,name,phone,date,time,guests,area,table,occasion,note,status")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Daftar reservasi belum bisa dimuat. Coba lagi.");
  return data.map((item) => ({ ...item, time: item.time.slice(0, 5) }));
}

export async function updateStaffReservation(id: string, status: string) {
  const { data, error } = await createClient().rpc("saji_update_reservation_status", {
    p_id: id,
    p_status: status,
  });
  if (error?.code === "23P01") throw new Error("Jadwal meja bertabrakan dengan reservasi aktif.");
  if (error || !data) throw new Error("Status belum tersimpan. Periksa akses staf dan coba lagi.");
}
