import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "Saji Rasa — Meja Kita Bersama",
    template: "%s — Saji Rasa",
  },
  description:
    "Jelajahi masakan Nusantara, pilih sajian favorit, dan rencanakan makan bersama di Saji Rasa.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
