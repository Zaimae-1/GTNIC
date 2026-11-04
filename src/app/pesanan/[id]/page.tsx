import { OrderPage } from "@/components/customer-pages";
export const metadata = { title: "Rincian Pesanan" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderPage id={id} />;
}
