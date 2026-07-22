"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/community", label: "The Campfire" },
  { href: "/merch", label: "The Gift Shop" },
];

export default function HeaderB() {
  const [open, setOpen] = useState(false);

  return (
    <header className="b-header">
      <div className="b-container b-header-inner">
        <Link href="/" className="b-brand">
          <span className="b-brand-mark" aria-hidden="true" />
          The Social Project
        </Link>

        <nav className="b-nav" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="b-nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" className="b-btn b-btn-sm">
            Sign in
          </Link>
        </nav>

        <button
          type="button"
          className="b-menu-btn"
          aria-expanded={open}
          aria-controls="b-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? "b-bar b-bar-top-open" : "b-bar"} />
          <span className={open ? "b-bar b-bar-mid-open" : "b-bar"} />
          <span className={open ? "b-bar b-bar-bot-open" : "b-bar"} />
        </button>
      </div>

      {open && (
        <nav id="b-mobile-nav" className="b-mobile-nav" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="b-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sign-in"
            className="b-btn b-mobile-signin"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
