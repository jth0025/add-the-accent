"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A header menu link that knows when its page is the one being viewed:
 * on that page it takes `activeClassName` (and aria-current="page")
 * instead of `className`. Sub-pages count too, so an open journal entry
 * keeps "Journal" marked.
 */
export default function NavLink({
  href,
  className = "",
  activeClassName = "",
  children,
  ...rest
}) {
  const pathname = usePathname() || "";
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={active ? activeClassName : className}
      {...rest}
    >
      {children}
    </Link>
  );
}
