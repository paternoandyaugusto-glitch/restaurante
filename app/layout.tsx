import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kansas Operations", template: "%s · Kansas Operations" },
  description: "Mesas, pedidos, cocina, reservas, pagos y equipo conectados en una sola operación.",
};

export const viewport: Viewport = {
  themeColor: "#181411",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" data-scroll-behavior="smooth"><body className="font-sans">{children}</body></html>;
}
