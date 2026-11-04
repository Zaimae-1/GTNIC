import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { type Dish, money } from "@/lib/restaurant";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    heart: <path d="m12 21-8-8C-3 5 8-1 12 6c4-7 15-1 8 7l-8 8Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    chat: (
      <>
        <path d="M21 11a9 9 0 0 1-9 9H4l-2 2 2-7a9 9 0 1 1 17-4Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C8 1 2 7 6 15c8 4 14-2 14-12Z" />
        <path d="m4 21 10-12" />
      </>
    ),
    table: (
      <>
        <path d="M3 8h18v5H3zM6 13v8M18 13v8M8 3h8" />
      </>
    ),
    star: <path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" />,
  };
  return (
    <svg
      className={"icon " + className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function Photo({
  image,
  alt,
  className = "",
  priority = false,
}: {
  image: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={"photo " + className}>
      <Image
        src={"/images/" + (image.includes(".") ? image : image + ".jpg")}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        preload={priority}
      />
    </div>
  );
}
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Saji Rasa, beranda">
      <span className="brand-symbol">
        <Icon name="leaf" />
      </span>
      <span>
        SAJI RASA<small>MEJA KITA BERSAMA</small>
      </span>
    </Link>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={secondary ? "button button-light" : "button"}>
      {children}
      <Icon name="arrow" />
    </Link>
  );
}
export function SectionTitle({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function PageTitle({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function MenuCard({
  dish,
  unavailable = false,
}: {
  dish: Dish;
  unavailable?: boolean;
}) {
  const soldOut = dish.soldOut || unavailable;
  return (
    <article className={"menu-card" + (soldOut ? " unavailable" : "")}>
      <Link
        href={"/menu/" + dish.id}
        className="menu-card-photo"
        aria-label={"Lihat " + dish.name}
      >
        <Photo
          image={dish.image}
          alt={"Ilustrasi sajian " + dish.category.toLowerCase()}
        />
        {(dish.badge || soldOut) && (
          <span className="dish-badge">
            {soldOut ? "Habis hari ini" : dish.badge}
          </span>
        )}
      </Link>
      <div className="menu-card-body">
        <p className="dish-category">{dish.category}</p>
        <h3>
          <Link href={"/menu/" + dish.id}>{dish.name}</Link>
        </h3>
        <p>{dish.description}</p>
        <div className="menu-card-bottom">
          <strong>{money(dish.price)}</strong>
          <Link
            href={"/menu/" + dish.id}
            className="round-button"
            aria-label={"Pilih " + dish.name}
          >
            <span aria-hidden="true">+</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="notice">
      <Icon name="leaf" />
      <p>{children}</p>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-symbol">
        <Icon name="bag" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <ButtonLink href={href}>{label}</ButtonLink>
    </div>
  );
}
