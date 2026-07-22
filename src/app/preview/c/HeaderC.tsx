"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/community", label: "The Campfire" },
  { href: "/merch", label: "The Gift Shop" },
];

export default function HeaderC() {
  const [open, setOpen] = useState(false);

  return (
    <header className="c-header">
      <div className="c-frame c-header-row">
        <Link href="/" className="c-logo">
          <span className="c-logo-mark" aria-hidden="true" />
          The Social Project
        </Link>

        <nav className="c-nav-desktop" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="c-nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" className="c-nav-cta">
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="c-menu-btn"
          aria-expanded={open}
          aria-controls="c-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav id="c-mobile-nav" className="c-nav-mobile" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
