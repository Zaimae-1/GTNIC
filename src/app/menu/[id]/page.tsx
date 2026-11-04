import { notFound } from "next/navigation";
import { dishes } from "@/lib/restaurant";
import { DishDetail } from "@/components/dish-detail";
export function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dish = dishes.find((item) => item.id === id);
  if (!dish) notFound();
  return <DishDetail dish={dish} />;
}
