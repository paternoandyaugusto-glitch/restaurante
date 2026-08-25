import type { Metadata } from "next";
import { CustomerMenu } from "@/components/customer-menu";

export const metadata: Metadata = {
  title: "Menú · Kansas Palermo",
  description: "Explorá el menú, personalizá tus platos y pedí desde tu mesa.",
};

export default function MenuPage() {
  return <CustomerMenu />;
}
