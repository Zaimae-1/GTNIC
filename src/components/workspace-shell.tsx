"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pos", label: "Kasir" },
  { href: "/products", label: "Produk & resep" },
  { href: "/inventory", label: "Stok bahan" },
  { href: "/waste", label: "Bahan terbuang" },
  { href: "/sales", label: "Riwayat penjualan" },
];

const accountNavigation = [
  { href: "/settings", label: "Pengaturan" },
  { href: "/profile", label: "Profil" },
];

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  function renderLinks(items: typeof navigation) {
    return items.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        className={`nav-link${pathname === href ? " nav-link-active" : ""}`}
      >
        {label}
      </Link>
    ));
  }

  return (
    <div className="workspace-layout">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <aside className="sidebar" aria-label="Menu aplikasi">
        <Link href="/" className="brand" aria-label="DapurCerdas, ke halaman utama">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span>DapurCerdas</span>
        </Link>
        <p className="sidebar-caption">MENU UTAMA</p>
        <nav aria-label="Menu utama" className="nav-list">{renderLinks(navigation)}</nav>
        <p className="sidebar-caption sidebar-caption-spaced">AKUN</p>
        <nav aria-label="Menu akun" className="nav-list">{renderLinks(accountNavigation)}</nav>
        <div className="sidebar-note">Tampilan awal • Data contoh</div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar">
          <Link href="/" className="mobile-brand">DapurCerdas</Link>
          <span className="topbar-business">Usaha Anda</span>
          <Link href="/profile" className="topbar-profile">Profil</Link>
        </header>
        <nav className="mobile-nav" aria-label="Menu aplikasi di ponsel">
          {renderLinks([...navigation, ...accountNavigation])}
        </nav>
        <main id="main-content" className="workspace-content">{children}</main>
      </div>
    </div>
  );
}
