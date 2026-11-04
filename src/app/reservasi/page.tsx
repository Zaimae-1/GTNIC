import { ReservationForm } from "@/components/reservation-form";
export const metadata = { title: "Reservasi" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  return <ReservationForm initialArea={area} />;
}
