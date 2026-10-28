import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DapurCerdas",
  description: "Smart POS yang sederhana untuk UMKM kuliner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
